"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Typography, Button } from "@/components";
import { useProducts, useProductsByCategory } from "@/actions/products";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs } from "@/components/ui/tab-s";
import { ArrowRight } from "lucide-react";

const staggerChildren = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const ProductSkeleton = () => (
  <motion.div
    variants={fadeInUp}
    className="group relative h-full w-full overflow-hidden rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md"
  >
    <Skeleton className="aspect-[4/5] w-full rounded-lg" />
    <div className="mt-4 flex items-center justify-between">
      <Skeleton className="h-6 w-48 rounded-md" />
      <Skeleton className="h-4 w-24 rounded-md" />
    </div>
    <Skeleton className="mt-3 h-4 w-32 rounded-md" />
    <Skeleton className="mt-4 h-4 w-40 rounded-md" />
    <div className="mt-5 flex items-center justify-between">
      <Skeleton className="h-6 w-24 rounded-md" />
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  </motion.div>
);

const LoadingGrid = () => (
  <motion.div
    variants={staggerChildren}
    initial="hidden"
    animate="show"
    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
  >
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <ProductSkeleton key={i} />
    ))}
  </motion.div>
);

export const NewArrivals = () => {
  const router = useRouter();

  const {
    products: allProducts,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useProducts(27, 10);

  const menFashion = useProductsByCategory("Men's Fashion", 9);
  const womenFashion = useProductsByCategory("Women's Fashion", 9);
  const womenAccessories = useProductsByCategory("Women Accessories", 9);
  const menAccessories = useProductsByCategory("Men Accessories", 9);

  const categories = useMemo(
    () => [
      {
        name: "Men's Fashion",
        data: menFashion.products,
        isLoading: menFashion.isLoading,
        isError: menFashion.isError,
      },
      {
        name: "Women's Fashion",
        data: womenFashion.products,
        isLoading: womenFashion.isLoading,
        isError: womenFashion.isError,
      },
      {
        name: "Women Accessories",
        data: womenAccessories.products,
        isLoading: womenAccessories.isLoading,
        isError: womenAccessories.isError,
      },
      {
        name: "Men Accessories",
        data: menAccessories.products,
        isLoading: menAccessories.isLoading,
        isError: menAccessories.isError,
      },
    ],
    [menFashion, womenFashion, womenAccessories, menAccessories],
  );

  const isLoading =
    isLoadingAll || categories.some((category) => category.isLoading);
  const isError = isErrorAll || categories.some((category) => category.isError);

  if (isLoading) {
    return (
      <section className="mx-auto mt-16 flex max-w-7xl flex-col px-4 lg:mt-32">
        <div className="mx-auto max-w-2xl text-center">
          <Skeleton className="mx-auto h-10 w-64 rounded-lg" />
          <Skeleton className="mx-auto mt-6 h-20 w-full max-w-xl rounded-lg" />
        </div>
        <div className="mt-12">
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-36 rounded-full" />
            ))}
          </div>
          <LoadingGrid />
        </div>
        <div className="mt-12 flex justify-center">
          <Skeleton className="h-12 w-40 rounded-full" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-16 max-w-md rounded-xl bg-red-50 p-8 text-center shadow-lg lg:mt-32"
      >
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-medium text-red-800">
          Error Loading Products
        </h3>
        <p className="text-red-600">
          We couldn&apos;t load the products. Please try again later.
        </p>
      </motion.div>
    );
  }

  const allCategories = [
    ...categories,
    { name: "All Products", data: allProducts },
  ];

  const handleViewMore = () => {
    router.push("/shop");
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto mt-16 flex max-w-7xl flex-col px-4 lg:mt-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-2xl text-center"
      >
        <div className="mb-3 flex justify-center">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5">
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-primary"></span>
            <Typography variant="p-12" className="font-medium text-primary">
              Our Latest Collection
            </Typography>
          </div>
        </div>
        <Typography
          variant="h2"
          font="primary"
          alignment="center"
          className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
        >
          New Arrivals
        </Typography>
        <Typography
          variant="p-16"
          alignment="center"
          className="mt-6 text-gray-600"
        >
          Explore the latest trends in fashion with our new collection of
          dresses, sweaters, and accessories. Find your perfect outfit today!
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-12"
      >
        <Tabs categories={allCategories} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-12 flex justify-center"
      >
        <Button
          onClick={handleViewMore}
          className="group flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          View More
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        </Button>
      </motion.div>
    </motion.section>
  );
};
