import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../../libs";

export async function POST(req: NextRequest) {
  try {
    const { email, resetToken, password } = await req.json();

    if (!email || !resetToken || !password) {
      return NextResponse.json(
        { error: "Email, reset token, and password are required" },
        { status: 400 },
      );
    }

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: resetToken,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return NextResponse.json(
      { message: "Password reset successfully", success: true },
      { status: 200 },
    );
  } catch (error) {
    console.error("Password reset error:", error);

    return NextResponse.json(
      { error: "An error occurred while resetting your password." },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
