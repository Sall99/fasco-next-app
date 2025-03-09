import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../../libs/auth-options";
import { prisma } from "../../../../../../libs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to view vote status" },
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

    return NextResponse.json({
      hasVoted: !!vote,
      isHelpful: vote?.isHelpful || false,
    });
  } catch (error) {
    console.error("Error getting vote status:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
