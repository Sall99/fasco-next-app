import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../../../libs/auth-options";
import { prisma } from "../../../../../../../libs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const id = (await params).id;

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to delete an address" },
        { status: 401 },
      );
    }

    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user || address.userId !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this address" },
        { status: 403 },
      );
    }

    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 },
    );
  }
}
