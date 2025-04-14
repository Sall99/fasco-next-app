import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../libs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const categoryId = searchParams.get("category");
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;
    const brand = searchParams.get("brand");
    const sortBy = searchParams.get("sortBy") || "featured";
    const skip = (page - 1) * limit;

    const where: {
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
        tags?: { hasSome: string[] };
      }>;
      categoryId?: string;
      brand?: { in: string[]; mode: "insensitive" };
      price?: { gte?: number; lte?: number };
    } = {};

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { hasSome: query.split(" ") } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (brand) {
      const brands = Array.isArray(brand) ? brand : [brand];
      where.brand = {
        in: brands,
        mode: "insensitive",
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};

      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }

      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    let orderBy: Record<string, "asc" | "desc" | { average: "asc" | "desc" }> =
      {};
    switch (sortBy) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "rating":
        orderBy = { rating: { average: "desc" } };
        break;
      case "featured":
      default:
        orderBy = { viewersCount: "desc" };
    }

    const total = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        rating: true,
        stock: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    return NextResponse.json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 },
    );
  }
}
