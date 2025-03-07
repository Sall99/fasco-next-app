import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../../../libs";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../../../libs/auth-options";
import { calculateProductRatingAverage } from "@/utils";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const productId = (await params).productId;
    if (!session) {
      return NextResponse.json(
        {
          error: "Authentication required",
        },
        { status: 401 },
      );
    }
    const body = await req.json();

    const { score, comment, title, pros, cons } = body;
    if (!score || score < 1 || score > 5) {
      return NextResponse.json(
        {
          error: "Invalid rating",
        },
        { status: 400 },
      );
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        rating: {
          productId: productId,
        },
        userId: session.user.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        {
          error: "You have already reviewed this product",
        },
        { status: 400 },
      );
    }

    const verifiedPurchase = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        OrderItem: {
          some: {
            product: {
              id: productId,
            },
          },
        },
      },
    });

    console.log("verifiedPurchase", verifiedPurchase);

    if (!verifiedPurchase) {
      return NextResponse.json(
        {
          error: "You must have purchased this product to review it",
        },
        { status: 400 },
      );
    }

    const existingRating = await prisma.rating.findFirst({
      where: {
        productId: productId,
      },
    });
    console.log("existingRating", existingRating);
    const ratingId = existingRating
      ? existingRating.id
      : (
          await prisma.rating.create({
            data: {
              productId: productId,
              average: score,
              reviewsCount: 1,
            },
          })
        ).id;
    console.log("ratingId", ratingId);

    const review = await prisma.review.create({
      data: {
        ratingId,
        userId: session.user.id,
        score,
        comment,
        title,
        pros: pros || [],
        cons: cons || [],
        verifiedPurchase: !!verifiedPurchase,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    console.log("review", review);

    await prisma.rating.update({
      where: { id: ratingId },
      data: {
        reviewsCount: { increment: 1 },
        average: {
          set: await calculateProductRatingAverage(productId),
        },
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      {
        error: "Failed to create review",
      },
      { status: 500 },
    );
  }
}
