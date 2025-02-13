"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Feature, Product, Skeleton, Typography } from "@/components";
import { ChevronRight, X } from "lucide-react";
import { useProducts } from "@/actions";
import { ProductType } from "@/types";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

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

const FiltersSkeleton = () => (
  <div className="space-y-6">
    {["Prices", "Categories", "Brands"].map((section) => (
      <div key={section} className="mb-6">
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-8 w-full" />
          ))}
        </div>
      </div>
    ))}
  </div>
);
const LoadingProductList = () => (
  <motion.div
    className="w-full"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    <div className="mb-6 flex items-center justify-between">
      <Skeleton className="h-8 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-10 rounded" />
        <Skeleton className="h-10 w-10 rounded" />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {[1, 2, 3, 4].map((item) => (
        <motion.div
          key={item}
          variants={itemVariants}
          className="flex justify-center"
        >
          <ProductSkeleton />
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const LoadingNavigation = () => (
  <div className="mb-8 py-4">
    <div className="flex items-center justify-center gap-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

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

const MobileFilters = () => {
  const [isOpen, setIsOpen] = useState(false);

  const drawerVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-50 lg:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full rounded-lg bg-black p-4 text-white shadow-lg"
        >
          Open Filters
        </button>
      </div>

      <div className="hidden lg:block lg:w-1/4">
        <FilterContent />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 h-[90vh] rounded-t-3xl bg-white p-6"
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex items-center justify-between pb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="h-full overflow-y-auto pb-20">
                <FilterContent />
              </div>

              <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-lg bg-black p-4 text-white"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
const FilterContent = () => {
  const priceRanges = ["$0 - $50", "$50 - $100", "$100 - $200", "$200+"];
  const categories = ["Electronics", "Clothing", "Books", "Home & Garden"];
  const brands = ["Apple", "Samsung", "Nike", "Adidas"];

  return (
    <div className="space-y-6">
      <motion.div
        className="mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h3 className="mb-2 text-lg font-semibold">Prices</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <motion.label
              key={range}
              className="flex items-center space-x-2"
              variants={itemVariants}
            >
              <input type="checkbox" className="cursor-pointer rounded" />
              <span>{range}</span>
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
        <h3 className="mb-2 text-lg font-semibold">Categories</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <motion.li
              key={category}
              className="flex cursor-pointer items-center space-x-2"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <span className="rounded-full bg-gray-200 px-2 py-1">
                {category}
              </span>
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
        <h3 className="mb-2 text-lg font-semibold">Brands</h3>
        <ul className="space-y-2">
          {brands.map((brand) => (
            <motion.li
              key={brand}
              className="flex cursor-pointer items-center space-x-2"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <span className="rounded-full bg-gray-200 px-2 py-1">
                {brand}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

interface ProductListProps {
  products: ProductType[];
}

const ProductList = ({ products }: ProductListProps) => {
  const [display, setDisplay] = useState("grid");

  return (
    <motion.div
      className="w-full"
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 26;
  const prevPageRef = useRef(currentPage);
  const { products, isLoading, isError, total, isValidating } = useProducts(
    currentPage,
    itemsPerPage,
  );

  useEffect(() => {
    if (prevPageRef.current !== currentPage && !isValidating) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      prevPageRef.current = currentPage;
    }
  }, [isValidating, currentPage]);

  if (isLoading) {
    return (
      <section className="container mx-auto mb-14 mt-10 min-h-screen px-4 lg:px-0">
        <LoadingNavigation />
        <div className="mb-20 flex flex-col gap-8 lg:flex-row">
          <div className="hidden lg:block lg:w-1/4">
            <FiltersSkeleton />
          </div>
          <LoadingProductList />
        </div>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Skeleton className="h-10 w-24 rounded" />
          <Skeleton className="h-10 w-32 rounded" />
          <Skeleton className="h-10 w-24 rounded" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-red-600">Error loading products</div>
      </motion.div>
    );
  }

  const productsData = products;
  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <section className="container mx-auto mb-14 mt-10 min-h-screen px-4 lg:px-0">
      <Navigation />
      <div className="mb-20 flex flex-col gap-8 lg:flex-row">
        <MobileFilters />
        <div className="w-full">
          <ProductList products={productsData} />

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="rounded bg-gray-200 px-2 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Typography variant="p-12">Previous</Typography>
            </button>
            <Typography variant="p-12">
              Page {currentPage} of {totalPages}
            </Typography>
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              className="rounded bg-gray-200 px-2 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Typography variant="p-12">Next</Typography>
            </button>
          </div>
        </div>
      </div>
      <Feature />
    </section>
  );
}
