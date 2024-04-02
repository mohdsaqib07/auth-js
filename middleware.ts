import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);
import {
	DEFAULT_LOGIN_REDIRECT,
	apiAuthPrefix,
	authRoutes,
	publicRoutes,
} from "@/routes";
//Adding auth to your Middleware is optional, but recommended to keep the user session alive.
//For advanced use cases, you can use auth as a wrapper for your Middleware:

// middleware works on the edge
// Prisma ORM/library is not yet compatible with the Edge runtime.
//@ts-expect-error
export default auth((req) => {
	//req.auth
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;
	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);
	if (isApiAuthRoute) {
		return null;
	}

	if (isAuthRoute) {
		if (isLoggedIn)
			// inside new URL() constructor apart from redirect URL we also need to pass req.url so that it can make a absolute URL
			return NextResponse.redirect(
				new URL(DEFAULT_LOGIN_REDIRECT, nextUrl),
			);
		return null;
	}

	if (!isLoggedIn && !isPublicRoute) {
		let callbackUrl = nextUrl.pathname;
		console.log("callbackUrl is : ", callbackUrl);
		console.log("Next Url Search is : ", nextUrl.search);
		if (nextUrl.search) {
			callbackUrl += nextUrl.search;
		}

		const encodedCallbackUrl = encodeURIComponent(callbackUrl);
		return NextResponse.redirect(
			new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
		);
	}

	return null;
});

// Optionally, don't invoke Middleware on some paths
// the pattern in the matcher option is called negative lookhead this middleware will run for every route except for route mention in the matcher option for negative look head these routes are :
/*
 * Match all request paths except for the ones starting with:
 * - api (API routes)
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - favicon.ico (favicon file)
 */
// export const config = {
// 	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

// matcher from https://clerk.com/docs/references/nextjs/auth-middleware
export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
