import { z } from "zod";
import { UserRole } from "@prisma/client";

export const SettingsSchema = z
	.object({
		name: z.optional(z.string()),
		isTwoFactorEnabled: z.optional(z.boolean()),
		role: z.optional(z.enum([UserRole.ADMIN, UserRole.USER])),
		email: z.optional(
			z.string().email({ message: "Invalid Email Address" }),
		),
		password: z.optional(
			z.string().min(6, {
				message: "Password must be atleast 6 chracters long!",
			}),
		),
		newPassword: z.optional(
			z
				.string()
				.min(6, {
					message: "Password must be atleast 6 chracters long!",
				})
				.regex(
					/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/,
					{
						message:
							"Password must contain one lower and uppercase letter, a number, and a symbol",
					},
				),
		),
	})
	.refine(
		(data) => {
			if (data.newPassword && !data.password) {
				return false;
			}

			return true;
		},
		{
			message: "Existing Password is Required!",
			path: ["password"],
		},
	)
	.refine(
		(data) => {
			if (data.password && !data.newPassword) {
				return false;
			}

			return true;
		},
		{
			message: "New Password is required!",
			path: ["newPassword"],
		},
	);

export const newPasswordSchema = z.object({
	password: z
		.string()
		.min(6, {
			message: "Password must be atleast 6 chracters long!",
		})
		.regex(
			/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/,
			{
				message:
					"Password must contain one lower and uppercase letter, a number, and a symbol",
			},
		),
});
export const resetSchema = z.object({
	email: z
		.string({
			invalid_type_error: "Email Required!",
		})
		.email({ message: "Invalid Email Address" }),
});

export const loginSchema = z.object({
	email: z
		.string({
			invalid_type_error: "Email Required!",
		})
		.email({ message: "Invalid Email Address" }),
	password: z.string().min(1, {
		message: "password is required",
	}),
	code: z.optional(z.string()),
});

export const registerSchema = z.object({
	email: z
		.string({
			invalid_type_error: "Email Required!",
		})
		.email({ message: "Invalid Email Address" }),
	password: z
		.string()
		.min(6, {
			message: "Password must be atleast 6 chracters long!",
		})
		.regex(
			/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/,
			{
				message:
					"Password must contain one lower and uppercase letter, a number, and a symbol",
			},
		),
	name: z.string().min(2, {
		message: "Name is Required",
	}),
});
