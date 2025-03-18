import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, confirmationCode } = await req.json();

    if (!email || !confirmationCode) {
      return NextResponse.json(
        { error: "Email and confirmation code are required" },
        { status: 400 },
      );
    }

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: confirmationCode,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired confirmation code" },
        { status: 400 },
      );
    }

    const resetSessionToken = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    await prisma.verificationToken.update({
      where: { id: verificationToken.id },
      data: {
        token: resetSessionToken,
      },
    });

    return NextResponse.json(
      {
        message: "Code verified successfully",
        resetToken: resetSessionToken,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Code verification error:", error);

    return NextResponse.json(
      { error: "An error occurred while verifying the code." },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
