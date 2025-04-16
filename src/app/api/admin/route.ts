import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../libs/auth-options";
import { prisma } from "../../../../libs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Only admins can create other admins" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

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

    const newAdmin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "ADMIN",
        emailVerified: new Date(),
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...adminWithoutPassword } = newAdmin;

    return NextResponse.json(adminWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
