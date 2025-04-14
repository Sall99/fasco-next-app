import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../libs";
import { Prisma } from "@prisma/client";

function validatePageParam(value: string | null): number {
  if (!value || isNaN(parseInt(value))) return 1;
  return Math.max(1, parseInt(value));
}

function validateLimitParam(value: string | null): number {
  if (!value || isNaN(parseInt(value))) return 26;
  return Math.max(1, parseInt(value));
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = validatePageParam(searchParams.get("page"));
    const limit = validateLimitParam(searchParams.get("limit"));
    const query = searchParams.get("query") || "";
    const brand = searchParams.getAll("brand");
    const category = searchParams.getAll("category");
    const rating = searchParams.getAll("rating").map(Number);
    const sortBy = searchParams.get("sortBy") || "featured";
    const minPrice = Number(searchParams.get("minPrice")) || undefined;
    const maxPrice = Number(searchParams.get("maxPrice")) || undefined;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    };

    if (brand.length > 0) {
      where.brand = { in: brand };
    }

    if (category.length > 0) {
      where.category = { slug: { in: category } };
    }

    if (rating.length > 0) {
      where.rating = {
        average: { in: rating },
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    switch (sortBy) {
      case "price-asc":
        orderBy.price = "asc";
        break;
      case "price-desc":
        orderBy.price = "desc";
        break;
      case "newest":
        orderBy.createdAt = "desc";
        break;
      case "rating":
        orderBy.rating = { average: "desc" };
        break;
      default:
        orderBy.viewersCount = "desc";
    }

    const total = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: true,
        stock: true,
        rating: true,
      },
    });

    return NextResponse.json({
      message: "success",
      total,
      currentPage: page,
      limit,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    );
  }
}
