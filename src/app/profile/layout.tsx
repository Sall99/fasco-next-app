import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile | Fasco",
  description: "Manage your account settings, orders, and addresses",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
