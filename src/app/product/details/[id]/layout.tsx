import { Metadata } from "next";
import { prisma } from "../../../../../libs";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
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
