import { NextResponse } from "next/server";
import { prisma } from "../../../../../../libs";
import { NextRequest } from "next/server";

const handleErrorResponse = (error: Error) => {
  return NextResponse.json(
    { error: error.message || "An error occurred" },
    { status: 500 },
  );
};

export async function GET(
  request: NextRequest,
  context: { params: { id: string } },
) {
  const { id } = context.params;
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
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
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
