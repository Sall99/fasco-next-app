import { Metadata } from "next";
import { prisma } from "../../../libs/prisma.db";

export async function generateMetadata(): Promise<Metadata> {
  const productsCount = await prisma.product.count();
  const categoriesCount = await prisma.category.count();

  return {
    title: "Shop Premium Fashion & Accessories | Fasco",
    description: `Explore our collection of ${productsCount}+ premium fashion items across ${categoriesCount} categories. Find luxury clothing, bags, shoes, and accessories from top designer brands.`,
    openGraph: {
      title: "Shop Premium Fashion & Accessories | Fasco",
      description: `Discover ${productsCount}+ premium fashion items and accessories. Shop the latest trends from top designer brands.`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/imgs/hero-img-1.png`,
          width: 1200,
          height: 630,
          alt: "Fasco Fashion Collection",
        },
      ],
    },
  };
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
