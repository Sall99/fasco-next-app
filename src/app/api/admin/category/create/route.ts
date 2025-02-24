import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../../../libs";
import { CreateCategoryInput, CreateCategorySchema } from "@/types";

export async function POST(request: Request) {
  try {
    const body: CreateCategoryInput = await request.json();

    const validatedData = CreateCategorySchema.parse(body);

    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ name: validatedData.name }, { slug: validatedData.slug }],
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name or slug already exists" },
        { status: 409 },
      );
    }

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
