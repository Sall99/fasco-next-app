"use client";

import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";

import { Button, Typography } from "@/components";
import Link from "next/link";

const Links = [
  { title: "Home", path: "/" },
  { title: "Shop", path: "/shop" },
  { title: "Log in", path: "/auth/login" },
];

export const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.header
      className="relative mt-10 px-6 lg:mt-20"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <div className="m-auto flex max-w-7xl items-center justify-between px-4 lg:px-0">
        <motion.div variants={linkVariants} whileHover={{ scale: 1.1 }}>
          <Link href="/">
            <Typography variant="h2" font="primary">
              FASCO
            </Typography>
          </Link>
        </motion.div>

        <div className="hidden items-center gap-5 lg:flex">
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

        <div className="lg:hidden">
          <motion.button
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.9 }}
            className="relative z-50"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
              className="fixed left-0 top-0 z-40 h-screen w-full bg-white px-6 pt-20 lg:hidden"
            >
              <div className="flex flex-col gap-6">
                {Links.map(({ title, path }, key) => (
                  <motion.div
                    key={key}
                    variants={linkVariants}
                    onClick={toggleMobileMenu}
                  >
                    <Link
                      href={path}
                      className="block py-2 text-xl text-gray-700 transition-colors hover:text-primary-600"
                    >
                      {title}
                    </Link>
                  </motion.div>
                ))}
                <motion.div variants={linkVariants} onClick={toggleMobileMenu}>
                  <Link href="/auth/signup">
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
