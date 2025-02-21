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

export async function POST(request: NextRequest) {
  try {
    const body: CreateProductRequestInterface = await request.json();

    if (!body.name || !body.brand || !body.price || !body.description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const uploadedImages = await Promise.all(
      body.images.map(async (base64Image) => {
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
    );

    const productSlug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    let category;
    if (body.category.id) {
      category = await prisma.category.findUnique({
        where: { id: body.category.id },
      });
    }

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

    const product = await prisma.product.create({
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
          create: {
            quantity: body.stock.quantity ?? undefined,
            lowStockThreshold: body.stock.lowStockThreshold ?? undefined,
          },
        },
        rating: {
          create: {
            average: 0,
            reviewsCount: 0,
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
        message: "Product created successfully",
        product,
        categoryCreated: !body.category.id || !category,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
