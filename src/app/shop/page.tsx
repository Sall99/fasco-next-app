"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Product, Typography } from "@/components";
import { ChevronRight } from "lucide-react";
import { useProducts } from "@/actions";
import { ProductType } from "@/types";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

const priceRanges = [
  "$0-$50",
  "$50-$100",
  "$100-$550",
  "$550-$1000",
  "$1000-$2000",
];

const categories = [
  "All",
  "Women's Fashion",
  "Men's Fashion",
  "Women Accessories",
  "Men Accessories",
];

const brands = ["Al Karam", "Donna Karan", "Prettygarden", "Bomber", "Dokotoo"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export const Filters = () => {
  return (
    <motion.div
      className="lg:w-1/4"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        <div>
          <Typography variant="h6" className="mb-2">
            Filters
          </Typography>

          <motion.div
            className="mb-6 mt-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Typography variant="h6" className="mb-2">
              Prices
            </Typography>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <motion.label
                  key={range}
                  className="flex items-center space-x-2"
                  variants={itemVariants}
                >
                  <input type="checkbox" className="cursor-pointer rounded" />
                  <Typography variant="p-12">{range}</Typography>
                </motion.label>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Typography variant="h6" className="mb-2">
              Categories
            </Typography>
            <ul className="space-y-2">
              {categories.map((category) => (
                <motion.li
                  key={category}
                  className="flex cursor-pointer items-center space-x-2"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <Typography
                    variant="p-12"
                    className="text-primary rounded-full bg-gray-200 px-2 py-1"
                  >
                    {category}
                  </Typography>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Typography variant="h6" className="mb-2">
              Brands
            </Typography>
            <ul className="space-y-2">
              {brands.map((brand) => (
                <motion.li
                  key={brand}
                  className="flex cursor-pointer items-center space-x-2"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <Typography
                    variant="p-12"
                    className="text-primary rounded-full bg-gray-200 px-2 py-1"
                  >
                    {brand}
                  </Typography>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

interface ProductListProps {
  products: ProductType[];
}

const ProductList = ({ products }: ProductListProps) => {
  const [display, setDisplay] = useState("grid");

  return (
    <motion.div
      className="lg:w-3/4"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <Typography variant="h6">All Products</Typography>
        <div className="flex gap-2">
          <motion.button
            className="rounded p-2 hover:bg-gray-100"
            onClick={() => setDisplay("grid")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11 0h7v7h-7v-7zm0-11h7v7h-7V3z"
              />
            </svg>
          </motion.button>
          <motion.button
            className="rounded p-2 hover:bg-gray-100"
            onClick={() => setDisplay("list")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.ul
          key={display}
          className={clsx(
            display === "grid" &&
              "grid grid-cols-1 justify-center gap-6 md:grid-cols-2",
            display === "list" && "flex flex-col gap-6",
          )}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0 }}
        >
          {products.map((product: ProductType) => (
            <motion.li
              key={product.id}
              className="flex justify-center"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={`/product/details/${product.id}`}>
                <Product product={product} />
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </motion.div>
  );
};

const Navigation = () => {
  return (
    <motion.nav
      className="mb-8 py-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">
          <Typography variant="p-12">Home</Typography>
        </Link>
        <span>
          <ChevronRight />
        </span>
        <span className="text-gray-700">
          <Typography variant="h6">Shop</Typography>
        </span>
      </div>
    </motion.nav>
  );
};

export default function ShopPage() {
  const { products, isLoading, isError } = useProducts(26);

  if (isLoading) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-primary mt-4">Loading...</div>
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-primary mt-4">Error loading product</div>
      </motion.div>
    );
  }
  const productsData = products.products;

  return (
    <div className="container mx-auto mb-14 mt-10 px-4 lg:px-0">
      <Navigation />
      <div className="flex flex-col gap-8 lg:flex-row">
        <Filters />
        <ProductList products={productsData} />
      </div>
    </div>
  );
}
