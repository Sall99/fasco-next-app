import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "../../../../../../libs/auth-options";
import { prisma } from "../../../../../../libs";

const helpfulVoteSchema = z.object({
  isHelpful: z.boolean().default(true),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to vote on reviews" },
        { status: 401 },
      );
    }

    const reviewId = (await params).reviewId;
    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { isHelpful } = helpfulVoteSchema.parse(body);

    const userId = session.user.id;

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.userId === userId) {
      return NextResponse.json(
        { error: "You cannot vote on your own review" },
        { status: 403 },
      );
    }

    const existingVote = await prisma.helpfulVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });

    const result = await prisma.$transaction(async (tx) => {
      if (existingVote) {
        if (existingVote.isHelpful !== isHelpful) {
          await tx.review.update({
            where: { id: reviewId },
            data: {
              helpfulCount: isHelpful ? { increment: 1 } : { decrement: 1 },
            },
          });
        }

        return tx.helpfulVote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            isHelpful,
          },
        });
      } else {
        if (isHelpful) {
          await tx.review.update({
            where: { id: reviewId },
            data: {
              helpfulCount: { increment: 1 },
            },
          });
        }

        return tx.helpfulVote.create({
          data: {
            reviewId,
            userId,
            isHelpful,
          },
        });
      }
    });

    return NextResponse.json({
      message: `Successfully ${isHelpful ? "marked" : "unmarked"} review as helpful`,
      vote: result,
    });
  } catch (error) {
    console.error("Error handling helpful vote:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
