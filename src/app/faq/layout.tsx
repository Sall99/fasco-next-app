import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Fasco",
  description: "Frequently asked questions about shopping at Fasco",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
