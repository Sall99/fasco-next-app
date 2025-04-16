import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Skip middleware for non-protected paths s
  if (
    !path.startsWith("/profile") &&
    !path.startsWith("/orders") &&
    !path.startsWith("/checkout")
  ) {
    return NextResponse.next();
  }

  try {
    const isProduction = process.env.NODE_ENV === "production";
    const productionDomain = "fasco-next-app.vercel.app";

    // Get the token and enforce strict verification
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: isProduction || req.nextUrl.protocol === "https:",
    });

    // Debug log (only in development)
    if (!isProduction) {
      console.log("Auth Debug:", {
        path,
        hasToken: !!token,
        baseUrl: req.nextUrl.origin,
        env: process.env.NODE_ENV,
      });
    }

    if (!token) {
      // Store the full URL to return to after login
      const baseUrl = isProduction
        ? `https://${productionDomain}`
        : req.nextUrl.origin;
      const loginUrl = new URL("/auth/login", baseUrl);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Middleware auth error:", error);
    }

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? `https://fasco-next-app.vercel.app`
        : req.nextUrl.origin;
    const loginUrl = new URL("/auth/login", baseUrl);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/profile/:path*", "/orders/:path*", "/checkout/:path*"],
};
