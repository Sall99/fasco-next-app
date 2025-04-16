import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Center | Fasco",
  description: "Get help with your orders, products, and account",
};

export default function SupportCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
