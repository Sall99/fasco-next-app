import { NextResponse } from "next/server";
import { prisma } from "../../../../../libs";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const handleErrorResponse = (error: Error) => {
  return NextResponse.json(
    { error: error.message || "An error occurred" },
    { status: 500 },
  );
};

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
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

    const cookieStore = cookies();
    const viewedProductsCookie = (await cookieStore).get("viewedProducts");
    let viewedProducts: string[] = [];

    if (viewedProductsCookie) {
      try {
        viewedProducts = JSON.parse(viewedProductsCookie.value);
      } catch {
        viewedProducts = [];
      }
    }

    if (!viewedProducts.includes(id)) {
      viewedProducts.push(id);

      const response = NextResponse.json({
        status: 200,
        message: "success",
        data,
      });

      response.cookies.set({
        name: "viewedProducts",
        value: JSON.stringify(viewedProducts),
        expires: Date.now() + 1000 * 60 * 60 * 24,
        path: "/",
      });

      await prisma.product.update({
        where: { id },
        data: {
          viewersCount: {
            increment: 1,
          },
        },
      });

      return response;
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
