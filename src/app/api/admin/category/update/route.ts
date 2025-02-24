import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../../../libs";
import { UpdateCategoryInput, UpdateCategorySchema } from "@/types";

export async function POST(request: Request) {
  try {
    const body: UpdateCategoryInput & { id: string } = await request.json();

    const validatedData = UpdateCategorySchema.parse(body);
    const id = body.id;

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    if (validatedData.name || validatedData.slug) {
      const conflictingCategory = await prisma.category.findFirst({
        where: {
          OR: [
            validatedData.name ? { name: validatedData.name } : {},
            validatedData.slug ? { slug: validatedData.slug } : {},
          ],
          NOT: { id },
        },
      });

      if (conflictingCategory) {
        return NextResponse.json(
          { error: "Category with this name or slug already exists" },
          { status: 409 },
        );
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
      },
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
