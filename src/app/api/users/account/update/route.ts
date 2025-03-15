import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authOptions } from "../../../../../../libs/auth-options";
import { prisma } from "../../../../../../libs";

const passwordUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must include uppercase, lowercase, number and special character",
    ),
});

const nameUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        password: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isOAuthUser = !user.password;

    if (isOAuthUser || !body.currentPassword) {
      const validationResult = nameUpdateSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          { message: "Invalid input", errors: validationResult.error.format() },
          { status: 400 },
        );
      }

      const { name } = validationResult.data;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(
        { message: "Profile updated successfully" },
        { status: 200 },
      );
    } else {
      const validationResult = passwordUpdateSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          { message: "Invalid input", errors: validationResult.error.format() },
          { status: 400 },
        );
      }

      const { name, currentPassword, newPassword } = validationResult.data;

      const isPasswordValid =
        user.password && (await bcrypt.compare(currentPassword, user.password));

      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 400 },
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          password: hashedPassword,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(
        { message: "Profile updated successfully" },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
