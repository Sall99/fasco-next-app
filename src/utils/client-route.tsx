"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith("/auth");

  return (
    <>
      {children}
      {!isAuthRoute && <Footer />}
    </>
  );
};
