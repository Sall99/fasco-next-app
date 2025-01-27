import { NextResponse } from "next/server";
import { prisma } from "../../../../../../libs";
import { handleErrorResponse } from "../../route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const data = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        stock: true,
        rating: true,
      },
    });

    if (!data) {
      return handleErrorResponse(new Error("Product not found"));
    }

    return NextResponse.json({
      status: 200,
      message: "success",
      data,
    });
  } catch (error) {
    return handleErrorResponse(error as Error);
  }
}
