"use server";
import { z } from "zod";
import { SettingsSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
	const user = await currentUser();
	if (!user) {
		return { error: "Unauthorized!" };
	}

	const dbUser = await getUserById(user.id);
	if (!dbUser) {
		return { error: "Unauthorized!" };
	}

	if (user.isOAuth) {
		values.email = undefined;
		values.password = undefined;
		values.newPassword = undefined;
		values.isTwoFactorEnabled = undefined;
	}

	if (values.email && values.email !== user.email) {
		const existingUser = await getUserByEmail(values.email);
		if (existingUser && existingUser.id !== user.id) {
			return { error: "Email Already in Use!" };
		}

		const verificationToken = await generateVerificationToken(values.email);
		await sendVerificationEmail(
			verificationToken.email,
			verificationToken.token,
		);

		return { success: "Verification email sent!" };
	}

	if (values.password && values.newPassword && dbUser.password) {
		const passwordMatch = await bcrypt.compare(
			values.password,
			dbUser.password,
		);
		if (!passwordMatch) {
			return { error: "Invalid Password!" };
		}
		const salt = await bcrypt.genSalt(10);
		const newHashedPassword = await bcrypt.hash(values.newPassword, salt);
		values.password = newHashedPassword;
		values.newPassword = undefined;
	}
	const updatedUser = await db.user.update({
		where: { id: dbUser.id },
		data: {
			...values,
		},
	});

	return { success: "Settings Updated" };
};
