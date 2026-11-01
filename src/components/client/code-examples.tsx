"use client";

import { useState } from "react";

interface CodeExamplesProps {
  apiKey?: string;
}

function CodeExamples({ apiKey = "YOUR_SECRET_API_KEY" }: CodeExamplesProps) {
  const [activeTab, setActiveTab] = useState<"ts" | "curl">("ts");

  const tsCode = `const API_BASE_URL = window.location.origin; // Or "https://your-domain.com"
const API_KEY = "${apiKey}";

async function analyzeVideo(file: File) {
  const fileType = "." + file.name.split(".").pop();
  const contentType = file.type || "video/mp4";

  // 1. Get presigned S3 upload URL
  const res = await fetch(\`\${API_BASE_URL}/api/upload-url\`, {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${API_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileType, contentType }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Failed to get upload URL");
  }

  const { url, key } = await res.json();

  // 2. Upload video binary directly to S3
  const uploadRes = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("Failed to upload video to storage");
  }

  // 3. Request sentiment analysis inference
  const analysisRes = await fetch(\`\${API_BASE_URL}/api/sentiment-inference\`, {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${API_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key }),
  });

  if (!analysisRes.ok) {
    const error = await analysisRes.json();
    throw new Error(error?.error || "Failed to analyze video");
  }

  const { analysis } = await analysisRes.json();
  console.log("Analysis Result:", analysis);
  return analysis;
}`;

  const curlCode = `# 1. Get S3 presigned upload URL
curl -X POST \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"fileType": ".mp4", "contentType": "video/mp4"}' \\
  https://your-domain.com/api/upload-url

# Response returns: {"url": "https://s3...", "key": "inference/xyz.mp4"}

# 2. Upload video directly to S3 (replace URL with the presigned url from step 1)
curl -X PUT \\
  -H "Content-Type: video/mp4" \\
  --data-binary @sample_video.mp4 \\
  "<PRESIGNED_URL_FROM_STEP_1>"

# 3. Request sentiment analysis (replace key with the key from step 1)
curl -X POST \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"key": "<KEY_FROM_STEP_1>"}' \\
  https://your-domain.com/api/sentiment-inference`;

  return (
    <div className="mt-3 flex h-fit w-full flex-col rounded-xl bg-gray-100 bg-opacity-70 p-4">
      <span className="text-sm font-medium">API Usage</span>
      <span className="mb-4 text-sm text-gray-500">
        Examples of how to use the API with TypeScript and cURL.
      </span>

      <div className="overflow-hidden rounded-md bg-gray-900">
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab("ts")}
            className={`px-4 py-2 text-xs font-medium ${
              activeTab === "ts" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-gray-300"
            }`}
          >
            TypeScript
          </button>
          <button
            onClick={() => setActiveTab("curl")}
            className={`px-4 py-2 text-xs font-medium ${
              activeTab === "curl" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-gray-300"
            }`}
          >
            cURL
          </button>
        </div>
        <div className="p-4">
          <pre className="max-h-[300px] overflow-y-auto font-mono text-xs text-gray-300">
            <code>{activeTab === "ts" ? tsCode : curlCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default CodeExamples;
