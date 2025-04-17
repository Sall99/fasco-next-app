import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoicing | Fasco",
  description: "View and download invoices for your orders",
};

export default function InvoicingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
