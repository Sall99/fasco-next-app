"use client";
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Tabs, Typography, Button } from "@/components";
import { useProducts, useProductsByCategory } from "@/actions/products";

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
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading products</div>;
  }

  const allCategories = [
    ...categories,
    { name: "All Products", data: allProducts },
  ];

  const handleViewMore = () => {
    router.push("/shop");
  };

  return (
    <section className="m-auto mt-10 flex max-w-7xl flex-col lg:mt-24">
      <div className="m-auto max-w-_756">
        <Typography variant="h2" font="primary" alignment="center">
          New Arrivals
        </Typography>
        <Typography variant="p-16" alignment="center" className="mt-5">
          Explore the latest trends in fashion with our new collection of
          dresses, sweaters, and accessories. Find your perfect outfit today!
        </Typography>
      </div>

      <Tabs categories={allCategories} />
      <Button onClick={handleViewMore} className="m-auto mt-5">
        View More
      </Button>
    </section>
  );
};
