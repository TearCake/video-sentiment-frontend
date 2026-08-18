import { InvokeEndpointCommand, SageMakerRuntime } from "@aws-sdk/client-sagemaker-runtime";
import { NextResponse } from "next/server";
import { checkAndUpdateQuota } from "~/lib/quota";
import { db } from "~/server/db";

export async function POST(req:Request) {
    try {
        const apiKey = req.headers.get("Authorization")?.replace("Bearer ", "");
        if (!apiKey) {
            return NextResponse.json({error: "API key required"}, {status: 401});
        }

        const quota = await db.apiQuota.findUnique({
            where: {
                secretKey: apiKey,
            },
            select: {
                userId: true,
            }
        })

        if (!quota) {
            return NextResponse.json({error: "Invalid API key"}, {status: 401});
        }

        const { key } = await req.json();

        if (!key) {
            return NextResponse.json({error: "Key is required", status: 400});
        }

        const file = await db.videoFile.findUnique({
            where: { key },
            select: { userId: true, analyzed: true },
        });

        if (!file) {
            return NextResponse.json({error: "Invalid key"}, {status: 404});
        }

        if (file.userId !== quota.userId) {
            return NextResponse.json({error: "Unauthorized"}, {status: 403});
        }

        if (file.analyzed) {
            return NextResponse.json({error: "File already analyzed"}, {status: 400});
        }

        // Check quota without deducting — only deduct after successful inference
        const hasQuota = await checkAndUpdateQuota(quota.userId, false);

        if (!hasQuota) {
            return NextResponse.json(
                {error: "Quota exceeded. Please upgrade to a pro plan"},
                {status: 420}
            );
        }

        const sagemakerClient = new SageMakerRuntime({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });

        const command = new InvokeEndpointCommand({
            EndpointName: process.env.SAGEMAKER_ENDPOINT_NAME,
            ContentType: "application/json",
            Body: JSON.stringify({
                video_path: `s3://${process.env.AWS_INFERENCE_BUCKET_NAME}/${key}`
            }),
        });

        const response = await sagemakerClient.send(command);
        const analysis = JSON.parse(new TextDecoder().decode(response.Body));

        // Deduct quota only after successful inference
        await checkAndUpdateQuota(quota.userId, true);

        await db.videoFile.update({
            where: {key},
            data: {
                analyzed: true,
            }
        })

        return NextResponse.json({analysis})
        
    } catch (error: unknown) {
        console.error("Analysis error: ", error);
        const isTimeout =
            typeof error === "object" &&
            error !== null &&
            "ErrorCode" in error &&
            (error as { ErrorCode: string }).ErrorCode === "INTERNAL_FAILURE_FROM_MODEL";
        return NextResponse.json(
            {
                error: isTimeout
                    ? "Analysis timed out. The model is warming up — please try again in a moment."
                    : "Failed to analyze video",
            },
            { status: 500 }
        );
    }
}