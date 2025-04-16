import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (
    !path.startsWith("/profile") &&
    !path.startsWith("/orders") &&
    !path.startsWith("/checkout") &&
    !path.startsWith("/admin")
  ) {
    return NextResponse.next();
  }

  try {
    const isProduction = process.env.NODE_ENV === "production";
    const productionDomain = "fasco-next-app.vercel.app";

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: isProduction || req.nextUrl.protocol === "https:",
    });

    if (!isProduction) {
      console.log("Auth Debug:", {
        path,
        hasToken: !!token,
        baseUrl: req.nextUrl.origin,
        env: process.env.NODE_ENV,
      });
    }

    if (!token) {
      const baseUrl = isProduction
        ? `https://${productionDomain}`
        : req.nextUrl.origin;
      const loginUrl = new URL("/auth/login", baseUrl);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    if (path.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
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
  matcher: [
    "/profile/:path*",
    "/orders/:path*",
    "/checkout/:path*",
    "/admin/:path*",
  ],
};
