import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our collection of premium fashion and accessories",
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
