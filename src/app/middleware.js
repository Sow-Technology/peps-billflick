import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Fetch the token from the request cookies using the NEXTAUTH_SECRET
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // If no token is found (i.e., user not logged in), redirect to the auth page
  if (!token) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }
  console.log(token);

  // Check for access to user-panel route and if the user is not a superuser, redirect to unauthorized
  if (req.nextUrl.pathname === "/user-panel" && token.role !== "superuser") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // If the user role is 'user', rewrite the URL to add 'alert=true' to the query params
  if (token.role === "user") {
    const url = req.nextUrl.clone();
    url.searchParams.set("alert", "true");
    return NextResponse.rewrite(url);
  }

  // If none of the conditions are met, continue with the request
  return NextResponse.next();
}

// Apply this middleware to all routes except API routes, static assets, and metadata files
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
