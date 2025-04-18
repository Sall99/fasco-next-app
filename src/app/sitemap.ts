import { MetadataRoute } from "next";
import { prisma } from "../../libs/prisma.db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://fasco-next-app.vercel.app";

  const products = await prisma.product.findMany({
    select: { id: true, updatedAt: true },
  });

  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  const staticPages = [
    "",
    "/shop",
    "/blog",
    "/contact",
    "/about",
    "/faq",
    "/careers",
    "/support-center",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  const productPages = products.map((product) => ({
    url: `${baseUrl}/product/details/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/shop?category=${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}
