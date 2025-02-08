import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPaths = ["/profile", "/orders", "/checkout"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedPath = protectedPaths.some((p) => path.startsWith(p));

  if (isProtectedPath) {
    console.log(isProtectedPath, "isProtectedPath");

    try {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName: "next-auth.session-token",
      });

      if (!token) {
        const loginUrl = new URL("/auth/login", req.url);

        loginUrl.searchParams.set("callbackUrl", path);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error("Error in middleware:", error);

      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", ...protectedPaths.map((path) => `${path}/:path*`)],
};
