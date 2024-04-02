"use server";
import { z } from "zod";
import { newPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
export async function newPassword(
	values: z.infer<typeof newPasswordSchema>,
	token?: string | null,
) {
	if (!token) {
		return { error: "Missing Token!" };
	}
	const validatedValues = newPasswordSchema.safeParse(values);
	if (!validatedValues.success) {
		return { error: "Invalid Password!" };
	}

	const { password } = validatedValues.data;

	const existingToken = await getPasswordResetTokenByToken(token);

	if (!existingToken) {
		return { error: "Invalid Token!" };
	}

	const hasExpired = new Date(existingToken.expires) < new Date();

	if (hasExpired) {
		return { error: "Token Has Expired!" };
	}

	const existingUser = await getUserByEmail(existingToken.email);

	if (!existingUser) {
		return { error: "Email Does Not Exist!" };
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	await db.user.update({
		where: { id: existingUser.id },
		data: {
			password: hashedPassword,
		},
	});

	await db.passwordResetToken.delete({
		where: { id: existingToken.id },
	});

	return { success: "Password Updated Successfully!" };
}
