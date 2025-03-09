import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../libs/auth-options";
import { prisma } from "../../../../libs";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to view vote status" },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    const url = new URL(req.url);
    const reviewIdsParam = url.searchParams.get("reviewIds");

    if (!reviewIdsParam) {
      return NextResponse.json(
        { error: "reviewIds parameter is required" },
        { status: 400 },
      );
    }

    const reviewIds = reviewIdsParam.split(",");

    const votes = await prisma.helpfulVote.findMany({
      where: {
        userId,
        reviewId: {
          in: reviewIds,
        },
      },
      select: {
        reviewId: true,
        isHelpful: true,
      },
    });

    return NextResponse.json({
      votes,
    });
  } catch (error) {
    console.error("Error getting vote statuses:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
