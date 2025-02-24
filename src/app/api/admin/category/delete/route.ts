import { NextResponse } from "next/server";
import { prisma } from "../../../../../../libs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || !body.id) {
      return NextResponse.json(
        { error: "Missing category ID" },
        { status: 400 },
      );
    }

    const id = body.id;

    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    await prisma.$transaction(async (tx) => {
      for (const product of category.products) {
        const rating = await tx.rating.findUnique({
          where: { productId: product.id },
        });

        if (rating) {
          await tx.review.deleteMany({
            where: { ratingId: rating.id },
          });

          await tx.rating.delete({
            where: { productId: product.id },
          });
        }

        const stock = await tx.stock.findUnique({
          where: { productId: product.id },
        });

        if (stock) {
          await tx.stock.delete({
            where: { productId: product.id },
          });
        }

        await tx.orderItem.deleteMany({
          where: { productId: product.id },
        });
      }

      await tx.product.deleteMany({
        where: { categoryId: id },
      });

      await tx.category.delete({
        where: { id },
      });
    });

    return NextResponse.json(
      { message: "Category and all related products deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
