import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../../libs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "recent";
    const productId = (await params).productId;

    const skip = (page - 1) * limit;

    const reviews = await prisma.review.findMany({
      where: {
        rating: {
          productId: productId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: { helpfulVotes: true },
        },
      },
      orderBy:
        sort === "helpful" ? { helpfulCount: "desc" } : { createdAt: "desc" },
      skip,
      take: limit,
    });

    const totalReviews = await prisma.review.count({
      where: {
        rating: {
          productId: productId,
        },
      },
    });

    return NextResponse.json(
      {
        reviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch reviews",
      },
      { status: 500 },
    );
  }
}
