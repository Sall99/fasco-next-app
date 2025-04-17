import { prisma } from "../../../../../libs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const productId = (await params).id;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      name: true,
      description: true,
    },
  });

  if (!product) {
    return {
      title: "Product Not Found | Fasco",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.name} | Fasco`,
    description: product.description,
  };
}

export default function ProductDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
