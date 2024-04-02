import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
type NextAuthSessionProviderProps = {
	children: React.ReactNode;
};

export const NextAuthSessionProvider = async ({
	children,
}: NextAuthSessionProviderProps) => {
	const session = await auth();
	return <SessionProvider session={session}>{children}</SessionProvider>;
};
