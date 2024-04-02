import { type NextAuthConfig } from "next-auth";
// NextAuthOptions is renamed to NextAuthConfig in Auth.js V5
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { compare } from "bcryptjs";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

//Note that we only need to mandatorily define an authorize method that is in charge of receiving the credentials inserted by the user and call the authorization service.
//This method expects a User object to be returned for a successful login.
export default {
providers: [
		Credentials({
			async authorize(credentials) {
				const validatedFields = loginSchema.safeParse(credentials);
				if (validatedFields.success) {
					const { email, password } = validatedFields.data;
					const user = await getUserByEmail(email);
					if (!user || !user.password) return null;

					const passwordMatch = await compare(
						password,
						user.password,
					);

					if (passwordMatch) return user;
				}
				return null;
			},
		}),
		Google,
		Github,
	],
} satisfies NextAuthConfig;
