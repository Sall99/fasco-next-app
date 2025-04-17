import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders | Fasco",
  description: "View your order history",
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
