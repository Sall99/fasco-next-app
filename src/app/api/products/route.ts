import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../libs";

function validateCount(count: string | null): number | null {
  if (!count || isNaN(parseInt(count))) {
    return null;
  }
  return parseInt(count);
}

export function handleErrorResponse(error: Error) {
  return NextResponse.json(
    { error: error.message || "An error occurred" },
    { status: 500 },
  );
}

export async function GET(req: NextRequest) {
  const count = validateCount(req.nextUrl.searchParams.get("count"));

  if (count === null) {
    return NextResponse.json(
      { error: "Invalid count parameter" },
      { status: 400 },
    );
  }

  try {
    const products = await prisma.product.findMany({
      take: count,
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
  } catch (error) {
    return handleErrorResponse(error as Error);
  }
}
