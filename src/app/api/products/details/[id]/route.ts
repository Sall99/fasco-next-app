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
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        stock: true,
        rating: true,
      },
    });

    if (!product) {
      return handleErrorResponse(new Error("Product not found"));
    }

    return NextResponse.json({
      status: 200,
      message: "success",
      product,
    });
  } catch (error) {
    return handleErrorResponse(error as Error);
  }
}
