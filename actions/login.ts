"use server";
import { z } from "zod";
import { loginSchema } from "@/schemas/index";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import {
	generateVerificationToken,
	generateTwoFactorToken,
} from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
export async function login(
	formData: z.infer<typeof loginSchema>,
	callbackUrl?: string | null,
) {
	// client side validation can be bypassed so it is always a good practice to do both client and server side validation
	const validatedValues = loginSchema.safeParse(formData);

	if (!validatedValues.success) {
		return { error: "Something Went Wrong!" };
	}

	const { email, password, code } = validatedValues.data;
	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser.email || !existingUser.password) {
		return { error: "Invalid Credentials!" };
	}

	if (!existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(
			existingUser.email,
		);
		await sendVerificationEmail(
			verificationToken.email,
			verificationToken.token,
		);
		return { success: "Confirm Your Email to Continue!" };
	}

	if (existingUser.isTwoFactorEnabled && existingUser.email) {
		if (code) {
			// TODO: Verify the code
			const twoFactorToken = await getTwoFactorTokenByEmail(
				existingUser.email,
			);
			if (!twoFactorToken) {
				return { error: "Invalid Code" };
			}

			if (twoFactorToken.token !== code) {
				return { error: "Invalid Code" };
			}

			const hasExpired = new Date(twoFactorToken.expires) < new Date();

			if (hasExpired) {
				return { error: "Code Expired" };
			}

			await db.twoFactorToken.delete({
				where: { id: twoFactorToken.id },
			});

			const existingConfirmation = await getTwoFactorConfirmationByUserId(
				existingUser.id,
			);

			if (existingConfirmation) {
				db.twoFactorConfirmation.delete({
					where: { id: existingConfirmation.id },
				});
			}

			await db.twoFactorConfirmation.create({
				data: {
					userId: existingUser.id,
				},
			});
		} else {
			// Send the 2FA Code
			const twoFactorToken = await generateTwoFactorToken(
				existingUser.email,
			);
			await sendTwoFactorTokenEmail(
				twoFactorToken.email,
				twoFactorToken.token,
			);

			return { twoFactor: true };
		}
	}
	/**
	 * If an CredentialsSignin is thrown or null is returned, two things can happen:
	 * The user is redirected to the login page, witherror=CredentialsSignin&code=credentials in the URL.
	 * If you throw this error in a framework that handles form actions server-side, this error is thrown by the login form action, so you'll need to handle it there.
	 * */

	try {
		// By default, the user is redirected to the current page after signing in. You can override this behavior by setting the redirectTo option.
		await signIn("credentials", {
			email,
			password,
			redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
		});
	} catch (err) {
		// If an error occurs during signin, an instance of AuthError will be thrown. You can catch it like this:
		// Todo:
		if (err instanceof AuthError) {
			switch (err.type) {
				case "CredentialsSignin":
					return {
						error: "Invalid Credentials!",
					};
				default:
					return {
						error: "Something Went Wrong!",
					};
			}
		}
		// in server actions we also need to throw the error back
		throw err;
	}

	//return {success:''}
}
