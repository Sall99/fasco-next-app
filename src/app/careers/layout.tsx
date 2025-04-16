import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Fasco",
  description:
    "Join our team at Fasco and help shape the future of fashion e-commerce",
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
