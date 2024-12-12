"use client";
import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductType } from "@/types";
import { Typography } from "@/components";
import { StarRating } from "../star-rating";
import { formatReviewCount } from "@/utils";

interface ProductProps {
  product: ProductType;
}

export function Product({ product }: ProductProps) {
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = product.images[0];
  const hoverImage =
    product.images.length > 1 ? product.images[1] : primaryImage;

  return (
    <div
      className="group relative m-auto h-[438px] w-[386px] overflow-hidden rounded-lg bg-white p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[244px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={isHovered ? "hover-image" : "primary-image"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 overflow-hidden rounded-md"
          >
            <Image
              src={isHovered ? hoverImage : primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top hover:cursor-pointer"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Typography variant="h6">{product.name}</Typography>
        <StarRating average={product.rating.average} />
      </div>
      <Typography variant="p-12" className="font-semibold text-gray-400">
        {product.brand}
      </Typography>
      <Typography variant="p-12" className="mt-5">
        {formatReviewCount(product.rating.reviewsCount)} Customer Reviews
      </Typography>

      <div className="mt-5 flex items-center justify-between">
        <Typography variant="h6">
          {formatReviewCount(product.price)} $
        </Typography>

        {product.isAlmostSoldOut && (
          <Typography variant="p-12" color="red">
            Almost Sold Out
          </Typography>
        )}
      </div>
    </div>
  );
}
