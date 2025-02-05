import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../libs";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const { fName, lName, email, password, phone } = await req.json();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: `${fName.trim()} ${lName.trim()}`,
        email,
        password: hashedPassword,
        emailVerified: new Date(),
        phoneNumber: phone,
      },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
