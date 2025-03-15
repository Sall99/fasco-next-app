import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../../libs/auth-options";
import { prisma } from "../../../../../libs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isOAuthUser = user.accounts.some(
      (account) =>
        account.provider === "google" || account.provider === "github",
    );

    return NextResponse.json({ isOAuthUser });
  } catch (error) {
    console.error("Error getting auth type:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
