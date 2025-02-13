"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Tabs, Typography, Button } from "@/components";
import { useProducts, useProductsByCategory } from "@/actions/products";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const ProductSkeleton = () => (
  <div className="group relative m-auto w-[386px] overflow-hidden rounded-lg bg-white p-4">
    <Skeleton className="h-[444px] w-full rounded-md" />
    <div className="mt-3 flex items-center justify-between">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-24" />
    </div>
    <Skeleton className="mt-2 h-4 w-32" />
    <Skeleton className="mt-5 h-4 w-40" />
    <div className="mt-5 flex items-center justify-between">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-4 w-28" />
    </div>
  </div>
);

const LoadingGrid = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
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
      <section className="m-auto mt-10 flex max-w-7xl flex-col lg:mt-24">
        <div className="m-auto max-w-_756">
          <Skeleton className="mx-auto h-8 w-64" />
          <Skeleton className="mx-auto mt-5 h-16 w-full max-w-lg" />
        </div>
        <div className="mt-8">
          <div className="mb-6 flex justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-32" />
            ))}
          </div>
          <LoadingGrid />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="m-auto mt-10 max-w-7xl text-center text-red-600"
      >
        Error loading products
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="m-auto mt-10 flex max-w-7xl flex-col lg:mt-24"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="m-auto max-w-_756"
      >
        <Typography variant="h2" font="primary" alignment="center">
          New Arrivals
        </Typography>
        <Typography variant="p-16" alignment="center" className="mt-5">
          Explore the latest trends in fashion with our new collection of
          dresses, sweaters, and accessories. Find your perfect outfit today!
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs categories={allCategories} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          onClick={handleViewMore}
          className="m-auto mt-5 transition-transform hover:scale-105"
        >
          View More
        </Button>
      </motion.div>
    </motion.section>
  );
};
