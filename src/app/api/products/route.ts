import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../libs";

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
    const page = validatePageParam(req.nextUrl.searchParams.get("page"));
    const limit = validateLimitParam(req.nextUrl.searchParams.get("limit"));
    const skip = (page - 1) * limit;

    const total = await prisma.product.count();

    const products = await prisma.product.findMany({
      skip,
      take: limit,
      include: {
        category: true,
        stock: true,
        rating: true,
      },
      orderBy: {
        createdAt: "desc",
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
