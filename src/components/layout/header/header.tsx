"use client";

import { usePathname } from "next/navigation";
import React, { useMemo } from "react";
import { motion } from "framer-motion";

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

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      color: "var(--primary-600)",
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.header
      className="mt-20"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <div className="m-auto flex max-w-7xl items-center justify-between">
        <motion.div variants={linkVariants} whileHover={{ scale: 1.1 }}>
          <Link href="/">
            <Typography variant="h2" font="primary">
              FASCO
            </Typography>
          </Link>
        </motion.div>

        <div className="flex items-center gap-5">
          <motion.ul
            className="flex items-center gap-5"
            variants={headerVariants}
          >
            {Links.map(({ title, path }, key) => (
              <motion.li key={key} variants={linkVariants} whileHover="hover">
                <Link
                  href={path}
                  className="text-gray-700 transition-colors hover:text-primary-600"
                >
                  {title}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
          <motion.div
            variants={linkVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/auth/signup">
              <Button>Sign up</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};
