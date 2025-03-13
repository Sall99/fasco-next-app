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
        { error: "You must be logged in to update an address" },
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
        { error: "Not authorized to update this address" },
        { status: 403 },
      );
    }

    const { street, city, state, zipCode, country, isDefault } =
      await req.json();

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        street,
        city,
        state,
        zipCode,
        country,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 },
    );
  }
}
