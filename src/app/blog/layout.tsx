import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Fasco",
  description: "Read the latest news, updates, and stories from Fasco.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
