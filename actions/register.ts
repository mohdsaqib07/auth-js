"use server";
import { z } from "zod";
import { registerSchema } from "@/schemas/index";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from "@/lib/mail";
export async function register(formData: z.infer<typeof registerSchema>) {
	// client side validation can be bypassed so it is always a good practice to do both client and server side validation

	const validatedValues = registerSchema.safeParse(formData);

	if (!validatedValues.success) {
		return { error: "Something Went Wrong!" };
	}

	const { name, email, password } = validatedValues.data;
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(password, salt);
	const existingUser = await getUserByEmail(email);
	if (existingUser) {
		return { error: "Email Already in Use!" };
	}

	await db.user.create({
		data: {
			name,
			email,
			password: hashPassword,
		},
	});

	// TODO: Send Verification Token

	const verificationToken = await generateVerificationToken(email);

	await sendVerificationEmail(verificationToken.email, verificationToken.token);
	return { success: "Confirmation Email Sent Check Your MailBox!" };
}
