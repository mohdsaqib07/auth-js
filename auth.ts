import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "@/data/account";
import { UserRole } from "@prisma/client";
// Since NextAuth.js v5 can automatically infer environment variables that are prefixed with AUTH_.
// Prisma ORM/library is not yet compatible with the Edge runtime.
// these can be used inside server components or server actions
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  //Events are asynchronous functions that do not return a response, they are useful for audit logs / reporting or handling any other side-effects.
  events: {
    // linkAccount event occur when we sign with an OAuth Provider
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  // Callbacks are asynchronous functions you can use to control what happens when an action is performed.
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth Provider SignIn Without Email Verification
      if (account?.provider !== "credentials") return true;
      const existingUser = await getUserById(user.id);

      // Prevent SignIn without email verification
      if (!existingUser || !existingUser?.emailVerified) return false;

      // TODO: Add 2FA Check
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id,
        );

        console.log({ twoFactorConfirmation });
        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }
      return true;
    },
    //The session callback is called whenever a session is checked.
    async session({ session, token }) {
      console.log({ sessionToken: token, session });
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (token.isTwoFactorEnabled && session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      if (session.user && token.email) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
      }
      return session;
    },
    // the callback is called whenever a json web token is created (i.e at signIn) or updated(i.e whenever a session is accessed in the client)
    // request to api/auth/signIn or api/auth/session and call to useSession() will invoke this function .
    // arguements available {token,user,account,profile,trigger,isNewUser,session} with user,account,profile,isNewUser are only passed for the first time this callback is called for the subsequent calls only token will be available.
    // TIP
    //When using JSON Web Tokens the jwt() callback is invoked before the session() callback, so anything you add to the JSON Web Token will be immediately available in the session callback, like for example an access_token from a provider.
    async jwt({ token, user, profile, session, account }) {
      console.log("I am Being Called Again");

      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
