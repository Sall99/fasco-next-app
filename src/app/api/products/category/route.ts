import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../libs";

export async function GET(req: NextRequest) {
  const count = validateCount(req.nextUrl.searchParams.get("count"));
  const category = req.nextUrl.searchParams.get("category");

  if (!category || count === null) {
    return NextResponse.json(
      { error: "Invalid category or count parameter" },
      { status: 400 },
    );
  }

  try {
    const products = await prisma.product.findMany({
      take: count,
      where: {
        category: {
          name: category,
        },
      },
      include: {
        category: true,
        stock: true,
        rating: true,
      },
    });

    return NextResponse.json(
      {
        message: "success",
        length: products.length,
        products,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

function validateCount(count: string | null): number | null {
  const parsedCount = parseInt(count || "", 10);
  return isNaN(parsedCount) ? null : parsedCount;
}
