"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductType } from "@/types";
import { Typography } from "@/components";
import { StarRating } from "../star-rating";
import { formatReviewCount } from "@/utils";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slices/cart";
import {
  addToWishlist,
  removeFromWishlist,
  selectWishlistItems,
} from "@/store/slices/wishlist";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import Link from "next/link";

export type ProductSize = "sm" | "md";

interface ProductProps {
  product: ProductType;
  size?: ProductSize;
  className?: string;
}

export function Product({ product, size = "md", className }: ProductProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const dispatch = useDispatch();
  const primaryImage = product.images[0];
  const hoverImage =
    product.images.length > 1 ? product.images[1] : primaryImage;
  const productId = product.id;
  const wishlistItems = useSelector(selectWishlistItems);

  useEffect(() => {
    const inWishlist = wishlistItems.some(
      (item) => item.productId === productId,
    );
    setIsInWishlist(inWishlist);
  }, [wishlistItems, productId]);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0],
      }),
    );
    toast.success("Added to cart");
  };

  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(productId));
      toast.success("Removed from wishlist");
    } else {
      const productData = {
        productId,
        name: product.name,
        price: product.price,
        image: product.images[0],
        addedAt: Date.now(),
      };
      dispatch(addToWishlist(productData));
      toast.success("Added to wishlist");
    }
  };

  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-lg bg-white transition-transform duration-200",
        size === "sm" ? "w-full max-w-[240px] p-2" : "w-full max-w-[386px] p-4",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={clsx(
          "absolute right-2 z-10 flex flex-col gap-2 opacity-0 transition-opacity duration-200",
          size === "sm" ? "top-2" : "top-4",
          "group-hover:opacity-100",
        )}
      >
        <motion.button
          className="rounded-full bg-white p-2 shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Add to wishlist"
          onClick={toggleWishlist}
        >
          <Heart
            size={20}
            className={
              isInWishlist
                ? "fill-red-500 text-red-500"
                : "text-gray-500 hover:text-red-500"
            }
          />
        </motion.button>
        <motion.button
          className="rounded-full bg-white p-2 shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Quick view"
        >
          <svg
            className="h-4 w-4 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </motion.button>
      </div>

      <div
        className={clsx(
          "relative overflow-hidden rounded-md",
          size === "sm" ? "h-[240px]" : "h-[444px]",
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isHovered ? "hover-image" : "primary-image"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Link href={`/product/details/${product.id}`}>
              <Image
                src={isHovered ? hoverImage : primaryImage}
                alt={product.name}
                fill
                sizes={
                  size === "sm"
                    ? "(max-width: 768px) 100vw, 33vw"
                    : "(max-width: 768px) 100vw, 50vw"
                }
                className="object-cover object-top hover:cursor-pointer"
                priority={size === "md"}
              />
            </Link>
          </motion.div>
        </AnimatePresence>

        <div
          className={clsx(
            "absolute inset-x-0 bottom-0 translate-y-full opacity-0 transition-all duration-300",
            "group-hover:translate-y-0 group-hover:opacity-100",
          )}
        >
          <motion.button
            className="flex w-full items-center justify-center bg-black py-2 text-sm font-medium text-white"
            whileHover={{ backgroundColor: "#333" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
          >
            Add to Cart
          </motion.button>
        </div>
      </div>

      <div
        className={clsx(
          "mt-3 flex flex-col justify-between",
          size === "sm" ? "h-[110px]" : "h-[130px]",
        )}
      >
        <div>
          <div className="flex items-center justify-between">
            <Typography
              variant={size === "sm" ? "p-14" : "h6"}
              className="line-clamp-1 font-medium"
            >
              {product.name}
            </Typography>
          </div>

          <Typography variant="p-12" className="text-gray-500">
            {product.brand}
          </Typography>
        </div>

        <div className="flex flex-col gap-1">
          <div className="h-6">
            {product.rating ? (
              <div className="flex items-center gap-2">
                <StarRating average={product.rating.average} />
                <Typography variant="p-12" className="text-gray-500">
                  ({formatReviewCount(product.rating.reviewsCount)})
                </Typography>
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Typography
                variant={size === "sm" ? "p-14" : "h6"}
                className="font-semibold"
              >
                ${formatReviewCount(product.price)}
              </Typography>
            </div>

            {product.isAlmostSoldOut && (
              <Typography variant="p-12" className="font-medium text-red-500">
                Almost Sold Out
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
