// this type of comment is called js document.
/**
 * An array of routes that that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 * */

export const publicRoutes = ["/", "/auth/new-verification"];

/**
 * An array of routes that that are used for authentication
 * These routes will redirect loggedin users to /settings
 * @type {string[]}
 * */
export const authRoutes = [
	"/auth/login",
	"/auth/register",
	"/auth/error",
	"/auth/reset",
	"/auth/new-password"
];

/**
 * This represent auth.js api endpoint
 * It is important we never block this route it should allow on every case whether the used is logged in or not.
 * It is a prefix for api authentication related routes.
 * Route that start with this prefix are used for API authentication purposes.
 * @type {string}
 * */

export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 * */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
