import { NextResponse } from "next/server";
import { prisma } from "../../../../../../libs";
import { handleErrorResponse } from "../../route";

import { NextRequest } from "next/server";

type PageParams = {
  params: {
    id: string;
  };
};

export async function GET(request: NextRequest, { params }: PageParams) {
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
