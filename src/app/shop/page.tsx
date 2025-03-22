"use client";
import React, { useEffect, useRef, useState } from "react";
import { useProducts } from "@/actions";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, ChevronRight, Filter, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { ProductType } from "@/types";
import { Product } from "@/components";

const ProductSkeleton = ({ size = "md" }) => (
  <Card className="h-full border-none shadow-sm">
    <div className="relative">
      <Skeleton className="aspect-square w-full rounded-t-lg" />
    </div>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-20 rounded" />
        <Skeleton className="h-4 w-10 rounded" />
      </div>
      <Skeleton className="mt-2 h-6 w-full rounded" />
      <div className="mt-2 flex items-baseline gap-2">
        <Skeleton className="h-6 w-16 rounded" />
        <Skeleton className="h-4 w-12 rounded" />
      </div>
      {size === "md" && <Skeleton className="mt-2 h-10 w-full rounded" />}
    </CardContent>
  </Card>
);

const LoadingProductList = () => (
  <motion.div className="w-full">
    <div className="mb-6 flex items-center justify-between">
      <Skeleton className="h-8 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32 rounded" />
        <Skeleton className="h-10 w-10 rounded" />
        <Skeleton className="h-10 w-10 rounded" />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array(8)
        .fill(0)
        .map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
    </div>
  </motion.div>
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

const PriceRangeFilter = () => {
  const [range, setRange] = useState([0, 1000]);

  return (
    <div className="space-y-3">
      <div className="mb-4">
        <Slider
          defaultValue={[0, 1000]}
          max={1000}
          step={10}
          value={range}
          onValueChange={setRange}
          className="py-4"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">${range[0]}</span>
        <span className="text-sm font-medium">${range[1]}</span>
      </div>
    </div>
  );
};

const FilterSidebar = () => {
  const categories = [
    { id: "women's-fashion", label: "Women's Fashion" },
    { id: "men's-fashion", label: "Men's Fashion" },
    { id: "women-accessories", label: "Women Accessories" },
    { id: "men-accessories", label: "Men Accessories" },
  ];

  const brands = [
    { id: "Al Karam", label: "Al Karam" },
    { id: "Adidas", label: "Adidas" },
    { id: "Dokotoo", label: "Dokotoo" },
    { id: "Exlura", label: "Exlura" },
    { id: "Donna Karan", label: "Donna Karan" },
  ];

  const ratings = [5, 4, 3, 2, 1];

  return (
    <Card className="sticky top-24 h-fit">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Filters</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Accordion
          type="multiple"
          defaultValue={["price", "categories", "brands", "ratings"]}
        >
          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <PriceRangeFilter />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox id={`category-${category.id}`} />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="brands">
            <AccordionTrigger>Brands</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <Badge
                    key={brand.id}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10 hover:text-primary"
                  >
                    {brand.label}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ratings">
            <AccordionTrigger>Ratings</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {ratings.map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox id={`rating-${rating}`} />
                    <label
                      htmlFor={`rating-${rating}`}
                      className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {Array(rating)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-amber-500 text-amber-500"
                          />
                        ))}
                      {Array(5 - rating)
                        .fill(0)
                        .map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-gray-300" />
                        ))}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Button className="w-full">Apply Filters</Button>
        <Button variant="outline" className="w-full">
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
};

const MobileFilters = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Narrow down products to find exactly what you&apos;re looking for.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 h-[calc(100vh-180px)] overflow-y-auto pr-4">
          <Accordion
            type="multiple"
            defaultValue={["price", "categories", "brands", "ratings"]}
          >
            <AccordionItem value="price">
              <AccordionTrigger>Price Range</AccordionTrigger>
              <AccordionContent>
                <PriceRangeFilter />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="categories">
              <AccordionTrigger>Categories</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {[
                    "Electronics",
                    "Clothing",
                    "Home & Garden",
                    "Beauty",
                    "Sports",
                    "Toys",
                  ].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox id={`mobile-category-${category}`} />
                      <label
                        htmlFor={`mobile-category-${category}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="brands">
              <AccordionTrigger>Brands</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2">
                  {["Apple", "Samsung", "Nike", "Adidas", "Sony"].map(
                    (brand) => (
                      <Badge
                        key={brand}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 hover:text-primary"
                      >
                        {brand}
                      </Badge>
                    ),
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ratings">
              <AccordionTrigger>Ratings</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox id={`mobile-rating-${rating}`} />
                      <label
                        htmlFor={`mobile-rating-${rating}`}
                        className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {Array(rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-amber-500 text-amber-500"
                            />
                          ))}
                        {Array(5 - rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-gray-300" />
                          ))}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <SheetFooter className="mt-4">
          <SheetClose asChild>
            <Button className="w-full">Apply Filters</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

function ProductList({
  products,
  title = "All Products",
  size = "md",
}: {
  products: ProductType[];
  title?: string;
  size?: "md" | "sm";
}) {
  const [display, setDisplay] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");

  return (
    <motion.div
      className="w-full"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">{title}</h2>
          <Badge variant="outline">{products.length} products</Badge>
        </div>

        <div className="flex items-center gap-3">
          <MobileFilters />

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden items-center rounded-md border p-1 md:flex">
            <Button
              variant={display === "grid" ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setDisplay("grid")}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={display === "list" ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setDisplay("list")}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={display}
          className={cn(
            display === "grid" && "grid gap-6",
            display === "grid" &&
              size === "md" &&
              "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3",
            display === "grid" &&
              size === "sm" &&
              "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3",
            display === "list" && "flex flex-col gap-4",
          )}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0 }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className={cn(display === "list" && "w-full")}
            >
              <Product
                product={product}
                size={size}
                className={display === "list" ? "flex max-w-none gap-4" : ""}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {products.length === 0 && (
        <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="text-3xl">😢</div>
          <h3 className="mt-2 text-lg font-medium">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters or search terms
          </p>
          <Button variant="outline" className="mt-4">
            Reset Filters
          </Button>
        </div>
      )}
    </motion.div>
  );
}

const Navigation = () => {
  return (
    <div className="mb-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="text-gray-500 hover:text-gray-900"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <span className="font-medium">Shop</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default function ShopPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
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
      <section className="container mx-auto mb-14 mt-10 min-h-screen px-4 lg:px-6">
        <Skeleton className="mb-8 h-10 w-64" />
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="hidden lg:block">
            <Skeleton className="h-[600px] w-full rounded-lg" />
          </div>
          <div className="lg:col-span-3">
            <LoadingProductList />
          </div>
        </div>
        <div className="mt-8 flex items-center justify-center">
          <Skeleton className="h-10 w-64 rounded-lg" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <motion.div
        className="container mx-auto flex h-96 flex-col items-center justify-center px-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-5xl">😕</div>
        <h2 className="mt-4 text-2xl font-bold text-gray-800">
          Something went wrong
        </h2>
        <p className="mt-2 text-gray-600">
          We couldn&apos;t load the products. Please try again later.
        </p>
        <Button className="mt-6" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </motion.div>
    );
  }

  const productsData = products;
  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <section className="container mx-auto mb-14 mt-10 min-h-screen px-4 lg:px-6">
      <Navigation />

      <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="hidden lg:block">
          <FilterSidebar />
        </div>

        <div className="lg:col-span-3">
          <ProductList products={productsData} />

          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && setCurrentPage(currentPage - 1)
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={currentPage === pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages &&
                      setCurrentPage(currentPage + 1)
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </section>
  );
}
