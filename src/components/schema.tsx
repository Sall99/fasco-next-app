import { Product } from "@prisma/client";

interface OrganizationSchemaProps {
  url: string;
}

interface ProductSchemaProps {
  product: Product & {
    category: { name: string };
    rating: { average: number; reviewsCount: number };
    stock: { quantity: number };
  };
}

export const OrganizationSchema = ({ url }: OrganizationSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fasco",
    url: url,
    logo: `${url}/logo.png`,
    sameAs: [
      "https://www.facebook.com/fasco",
      "https://www.instagram.com/fasco",
      "https://twitter.com/fasco",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const ProductSchema = ({ product }: ProductSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images[0],
    sku: product.id,
    mpn: product.id,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: product.category.name,
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/details/${product.id}`,
      priceCurrency: "USD",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock.quantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.average,
      reviewCount: product.rating.reviewsCount,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
