import { Products } from "@/constants/data";
import { prisma } from "../../../../../libs";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    await prisma.$transaction([
      prisma.review.deleteMany({}),
      prisma.rating.deleteMany({}),
      prisma.stock.deleteMany({}),
      prisma.product.deleteMany({}),
      prisma.category.deleteMany({}),
    ]);

    const categories = new Set(Products.map((product) => product.category));
    const categoryMap = new Map();

    for (const categoryName of categories) {
      const category = await prisma.category.create({
        data: {
          name: categoryName,
          slug: slugify(categoryName, { lower: true }),
        },
      });
      categoryMap.set(categoryName, category.id);
    }

    for (const product of Products) {
      const sanitizedImages = product.images.filter(
        (url): url is string => typeof url === "string",
      );

      await prisma.product.create({
        data: {
          name: product.name,
          slug: slugify(product.name, { lower: true }),
          brand: product.brand,
          price: product.price,
          viewersCount: 0,
          categoryId: categoryMap.get(product.category),
          stock: {
            create: {
              quantity: product.stock?.quantity ?? 0,
              lowStockThreshold: product.stock?.lowStockThreshold ?? 5,
            },
          },
          rating: {
            create: {
              average: 0,
              reviewsCount: 0,
            },
          },
          isAlmostSoldOut: false,
          tags: product.tags ?? [],
          images: sanitizedImages,
          description: product.description,
        },
      });
    }

    return NextResponse.json({
      message: "Data imported successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error importing data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
