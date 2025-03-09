import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../../libs/auth-options";
import { prisma } from "../../../../../../libs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to remove a vote" },
        { status: 401 },
      );
    }

    const reviewId = (await params).reviewId;
    const userId = session.user.id;

    const vote = await prisma.helpfulVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });

    if (!vote) {
      return NextResponse.json({ error: "Vote not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      if (vote.isHelpful) {
        await tx.review.update({
          where: { id: reviewId },
          data: {
            helpfulCount: { decrement: 1 },
          },
        });
      }

      await tx.helpfulVote.delete({
        where: {
          id: vote.id,
        },
      });
    });

    return NextResponse.json({
      message: "Vote removed successfully",
    });
  } catch (error) {
    console.error("Error removing vote:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
