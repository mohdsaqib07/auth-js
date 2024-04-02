"use server";
import { z } from "zod";
import { resetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";
export async function resetPassword(data: z.infer<typeof resetSchema>) {
	const validatedFields = resetSchema.safeParse(data);
	if (!validatedFields.success) {
		return { error: "Invalid Email!" };
	}

	const { email } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser) {
		return { error: "Email Does Not Exist!" };
	}
	// TODO: Generate Token and Send Email

	const passwordResetToken = await generatePasswordResetToken(email);
	await sendPasswordResetEmail(
		passwordResetToken.email,
		passwordResetToken.token,
	);
	return { success: "Reset Link sent to Email!" };
}
