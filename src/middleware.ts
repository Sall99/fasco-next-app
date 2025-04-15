import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Skip middleware for non-protected paths
  if (
    !path.startsWith("/profile") &&
    !path.startsWith("/orders") &&
    !path.startsWith("/checkout")
  ) {
    return NextResponse.next();
  }

  try {
    // Get the token and enforce strict verification
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie:
        process.env.NEXTAUTH_URL?.startsWith("https://") ??
        !!process.env.VERCEL_URL,
    });

    // Debug log
    console.log("Auth Debug:", {
      path,
      hasToken: !!token,
      baseUrl: req.nextUrl.origin,
      vercelUrl: process.env.VERCEL_URL,
    });

    if (!token) {
      // Store the full URL to return to after login
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware auth error:", error);
    // On error, redirect to login for security
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/profile/:path*", "/orders/:path*", "/checkout/:path*"],
};
