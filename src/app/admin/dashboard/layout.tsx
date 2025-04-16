import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Fasco",
  description: "Admin dashboard for managing products, orders, and customers",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
