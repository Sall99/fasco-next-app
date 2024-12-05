"use client";

import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

import { Button, Typography } from "@/components";
import Link from "next/link";

const Links = [
  { title: "Home", path: "/" },
  { title: "Shop", path: "/shop" },
  { title: "Log in", path: "/auth/login" },
];

export const Header = () => {
  const pathname = usePathname();

  const shouldRenderHeader = useMemo(() => {
    const authRoutes = new Set([
      "/auth/reset-password",
      "/auth/confirm-code",
      "/auth/forgot-password",
      "/auth/login",
      "/auth/signup",
    ]);
    return !authRoutes.has(pathname);
  }, [pathname]);

  if (!shouldRenderHeader) return null;

  return (
    <header className="mt-20">
      <div className="m-auto flex max-w-7xl items-center justify-between">
        <Typography variant="h2" font="primary">
          FASCO
        </Typography>

        <div className="flex items-center gap-5">
          <ul className="flex items-center gap-5">
            {Links.map(({ title, path }, key) => (
              <li key={key}>
                <Link href={path}>{title}</Link>
              </li>
            ))}
          </ul>
          <Button>Sign up</Button>
        </div>
      </div>
    </header>
  );
};
