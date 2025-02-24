import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "../../../../../../libs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    console.log(request, "=====================================s");
    const body: { id: string } = await request.json();

    const productId = body.id;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        stock: true,
        rating: {
          include: {
            reviews: true,
          },
        },
        OrderItem: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.OrderItem && product.OrderItem.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete product that has associated orders",
          orderIds: product.OrderItem.map((item) => item.orderId),
        },
        { status: 400 },
      );
    }

    const images = product.images as string[];
    await Promise.all(
      images.map(async (imageUrl) => {
        try {
          const publicId = imageUrl.split("/").slice(-1)[0].split(".")[0];
          await cloudinary.uploader.destroy(`fasco/${publicId}`);
        } catch (error) {
          console.error("Error deleting image from Cloudinary:", error);
        }
      }),
    );

    await prisma.$transaction(async (tx) => {
      if (product.rating) {
        await tx.review.deleteMany({
          where: { ratingId: product.rating.id },
        });

        await tx.rating.delete({
          where: { productId },
        });
      }

      if (product.stock) {
        await tx.stock.delete({
          where: { productId },
        });
      }

      await tx.product.delete({
        where: { id: productId },
      });
    });

    return NextResponse.json(
      {
        message: "Product deleted successfully",
        deletedProductId: productId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting product:", error);

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
