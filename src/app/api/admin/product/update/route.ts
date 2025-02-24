import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "../../../../../../libs";
import { CreateProductRequestInterface } from "@/types";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type CategoryType = {
  id: string;
  name: string;
  slug: string;
};

export async function POST(request: NextRequest) {
  try {
    const body: CreateProductRequestInterface & { id: string } =
      await request.json();
    const productId = body.id;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    if (!body.name || !body.brand || !body.price || !body.description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const existingImages = existingProduct.images as string[];
    const newImages = body.images.filter(
      (img) => !existingImages.includes(img),
    );

    const uploadedImages = await Promise.all([
      ...existingImages,
      ...(await Promise.all(
        newImages.map(async (base64Image) => {
          try {
            const result = await cloudinary.uploader.upload(base64Image, {
              folder: "fasco",
            });
            return result.secure_url;
          } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            throw new Error("Failed to upload image");
          }
        }),
      )),
    ]);

    const productSlug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    let category: CategoryType | null = existingProduct.category;

    if (body.category.id !== existingProduct.category.id) {
      category = await prisma.category.findUnique({
        where: { id: body.category.id },
      });

      if (!category) {
        const categorySlug = body.category.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        category = await prisma.category.create({
          data: {
            name: body.category.name,
            slug: categorySlug,
          },
        });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: body.name,
        slug: productSlug,
        brand: body.brand,
        price: body.price,
        description: body.description,
        tags: body.tags,
        images: uploadedImages,
        categoryId: category.id,
        stock: {
          update: {
            quantity: body.stock.quantity ?? undefined,
            lowStockThreshold: body.stock.lowStockThreshold ?? undefined,
          },
        },
      },
      include: {
        category: true,
        stock: true,
        rating: true,
      },
    });

    return NextResponse.json(
      {
        message: "Product updated successfully",
        product: updatedProduct,
        categoryUpdated: category.id !== existingProduct.category.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}
