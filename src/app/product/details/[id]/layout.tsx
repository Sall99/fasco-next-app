import { Metadata } from "next";
import { prisma } from "../../../../../libs/prisma.db";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      stock: true,
      rating: true,
    },
  });

  if (!product) {
    return {
      title: "Product Not Found | Fasco",
      description: "The requested product could not be found.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://fasco.com";
  const stockQuantity = product.stock?.quantity ?? 0;

  return {
    title: `${product.name} | ${product.brand} | Fasco`,
    description: product.description,
    keywords: [
      ...product.tags,
      product.brand,
      product.category.name,
      "fashion",
      "luxury",
      "premium",
    ],
    openGraph: {
      title: `${product.name} by ${product.brand}`,
      description: product.description,
      images: product.images.map((image, index) => ({
        url: image,
        width: 800,
        height: 600,
        alt: `${product.name} - Image ${index + 1}`,
      })),
      type: "website",
      siteName: "Fasco",
      locale: "en_US",
    },
    other: {
      "product:price:amount": product.price.toString(),
      "product:price:currency": "USD",
      "product:availability": stockQuantity > 0 ? "in stock" : "out of stock",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${product.brand}`,
      description: product.description,
      images: [product.images[0]],
    },
    alternates: {
      canonical: `${baseUrl}/product/details/${params.id}`,
    },
  };
}

export default function ProductDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
