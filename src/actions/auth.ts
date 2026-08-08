"use server";

import bcrypt from "bcryptjs";
import { signupSchema, type SignupSchema } from "~/schemas/auth";
import { db } from "~/server/db";

export async function registerUser(data: SignupSchema) {
    try {
        const result = signupSchema.safeParse(data);
        if (!result.success) {
            return { error: "Invalid data" }
        }
        const { name, email, password } = data;

        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { error: "User already exists" };
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Error in registerUser:", error);
        return { error: "Something went wrong. Please try again." };
    }
}