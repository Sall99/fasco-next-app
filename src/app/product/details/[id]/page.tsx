"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Heart, Share2 } from "lucide-react";
import { FaTwitter, FaFacebookF } from "react-icons/fa";

import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useGetProduct } from "@/actions";
import { Button, Feature, Skeleton, Typography } from "@/components";
import { StarRating } from "@/components/ui/star-rating";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cart";

interface GalleryProps {
  images: string[];
}

interface DetailsProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  viewersCount: number;
  tags: string[];
  images: string[];
  description: string;
  category: {
    name: string;
    slug: string;
  };
  stock: {
    quantity: number;
    lowStockThreshold: number;
  };
  rating: {
    average: number;
    reviewsCount: number;
  };
}

const GallerySkeleton = () => (
  <div className="flex flex-col justify-center gap-4 md:flex-row md:gap-6">
    <motion.div
      className="flex gap-3 overflow-x-auto md:max-h-[600px] md:flex-col md:overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {[1, 2, 3, 4].map((index) => (
        <Skeleton key={index} className="h-20 w-20 flex-shrink-0 rounded-lg" />
      ))}
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <Skeleton className="aspect-[3/4] w-full rounded-2xl md:w-[500px] lg:h-[600px]" />
    </motion.div>
  </div>
);

const DetailsSkeleton = () => (
  <div className="space-y-5 lg:w-[500px]">
    <Skeleton className="h-4 w-24 rounded-full" />
    <Skeleton className="h-4 w-32 rounded-full" />
    <Skeleton className="h-8 w-3/4 rounded-lg" />

    <div className="flex items-center gap-3">
      <Skeleton className="h-4 w-32 rounded-full" />
      <Skeleton className="h-4 w-24 rounded-full" />
    </div>

    <Skeleton className="h-6 w-24 rounded-lg" />

    <div className="space-y-3">
      <Skeleton className="h-4 w-full rounded-full" />
      <Skeleton className="h-4 w-5/6 rounded-full" />
      <Skeleton className="h-4 w-4/6 rounded-full" />
    </div>

    <div className="flex flex-wrap gap-2">
      {[1, 2, 3].map((index) => (
        <Skeleton key={index} className="h-8 w-20 rounded-full" />
      ))}
    </div>

    <div className="flex flex-wrap items-center gap-3">
      <Skeleton className="h-8 w-32 rounded-lg" />
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>

    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-36 rounded-lg" />
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>

    <div className="flex items-center gap-4">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  </div>
);

function Gallery({ images }: GalleryProps) {
  const [mainIndex, setMainIndex] = useState(0);

  const handleThumbnailClick = (index: number) => {
    setMainIndex(index);
  };

  return (
    <div className="flex flex-col justify-center gap-6 md:flex-row">
      <motion.div
        className="flex gap-3 overflow-x-auto md:max-h-[600px] md:flex-col md:overflow-y-auto"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {images.map((src, index) => (
          <motion.button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
              mainIndex === index
                ? "border-primary shadow-lg"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1,
              ease: "easeOut",
            }}
          >
            <Image
              src={src}
              alt={`Product thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="group mx-auto flex h-full overflow-hidden rounded-2xl bg-gray-50 md:w-[500px] lg:h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={mainIndex}
              className="relative aspect-[3/4] w-full flex-shrink-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            >
              <Image
                src={images[mainIndex]}
                alt="Product main image"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <motion.div
                className="absolute right-4 top-4 rounded-full bg-white p-2 shadow-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart size={20} className="text-gray-500 hover:text-red-500" />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

const Details = ({
  id,
  name,
  brand,
  price,
  tags,
  description,
  category,
  stock,
  rating,
  images,
}: DetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: id,
        name,
        price,
        quantity,
        image: images[0],
      }),
    );
  };

  const handleIncrement = () => {
    if (quantity < stock.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${name}&url=${window.location.href}`,
      "_blank",
    );
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
      "_blank",
    );
  };

  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  const isLowStock =
    stock.quantity <= stock.lowStockThreshold && stock.quantity > 0;

  return (
    <div className="lg:w-[500px]">
      <div className="mb-1 flex items-center gap-2">
        <Typography
          variant="p-12"
          className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary"
        >
          {category.name}
        </Typography>
        <Typography
          variant="p-12"
          className="rounded-full bg-gray-100 px-3 py-1 text-gray-600"
        >
          {brand}
        </Typography>
      </div>

      <Typography variant="h5" className="mb-4 font-bold text-primary">
        {name}
      </Typography>

      <div className="mb-6 flex items-center gap-3">
        <StarRating average={rating.average} />
        {rating.reviewsCount > 0 && (
          <Typography variant="p-12" className="text-gray-600">
            <span className="font-semibold">{rating.reviewsCount}</span> reviews
          </Typography>
        )}
        {/* <div className="text-gray-400">•</div>
        <Typography
          variant="p-12"
          className="flex items-center gap-1 text-emerald-600"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>{viewersCount} viewing now</span>
        </Typography> */}
      </div>

      <Typography variant="h5" className="mb-6 font-bold text-primary">
        ${price.toFixed(2)}
      </Typography>

      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <Typography variant="p-14" className="leading-relaxed text-gray-700">
          {description}
        </Typography>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Typography
            key={index}
            variant="p-12"
            className="rounded-full bg-gray-100 px-3 py-1 text-gray-600 transition-colors hover:bg-gray-200"
          >
            {tag}
          </Typography>
        ))}

        <Typography
          variant="p-12"
          className="rounded-full bg-primary/10 px-3 py-1 text-primary/80"
        >
          {category.slug}
        </Typography>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {stock.quantity > 0 ? (
            <div
              className={`flex items-center gap-2 ${isLowStock ? "text-amber-500" : "text-emerald-600"}`}
            >
              <div
                className={`h-3 w-3 rounded-full ${isLowStock ? "bg-amber-500" : "bg-emerald-500"}`}
              ></div>
              <Typography variant="p-12" className="font-medium">
                {isLowStock ? "Low Stock" : "In Stock"}
              </Typography>
              <Typography variant="p-12" className="text-gray-600">
                ({stock.quantity} available)
              </Typography>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-500">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <Typography variant="p-12" className="font-medium">
                Out of Stock
              </Typography>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
            <motion.button
              className="flex h-12 w-12 items-center justify-center border-r border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
              whileTap={{ scale: 0.95 }}
              onClick={handleDecrement}
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </motion.button>
            <div className="flex h-12 w-12 items-center justify-center bg-white">
              <Typography variant="p-12" className="font-medium text-primary">
                {quantity}
              </Typography>
            </div>
            <motion.button
              className="flex h-12 w-12 items-center justify-center border-l border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
              whileTap={{ scale: 0.95 }}
              onClick={handleIncrement}
              disabled={stock.quantity === 0 || quantity >= stock.quantity}
            >
              <Plus size={16} />
            </motion.button>
          </div>

          <motion.div className="w-full" whileTap={{ scale: 0.98 }}>
            <Button
              size="md"
              className="w-full"
              onClick={handleAddToCart}
              disabled={stock.quantity === 0}
            >
              {stock.quantity === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Typography variant="p-12" className="text-gray-600">
          Share:
        </Typography>

        <div className="relative">
          <motion.button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleShareOptions}
          >
            <Share2 size={18} />
          </motion.button>

          <AnimatePresence>
            {showShareOptions && (
              <motion.div
                className="absolute -right-2 top-12 z-10 flex rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <motion.button
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#1DA1F2] hover:bg-gray-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleTwitterShare}
                >
                  <FaTwitter size={18} />
                </motion.button>
                <motion.button
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#4267B2] hover:bg-gray-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleFacebookShare}
                >
                  <FaFacebookF size={18} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetProduct(id);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12">
        <motion.div
          className="flex flex-col justify-center gap-8 lg:flex-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GallerySkeleton />
          <DetailsSkeleton />
        </motion.div>
        <div className="my-24">
          <Feature />
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
        <div className="rounded-lg bg-red-50 p-8 text-center shadow-lg">
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
            Error Loading Product
          </h3>
          <p className="text-red-600">
            We couldn&apos;t load the product information. Please try again
            later.
          </p>
        </div>
      </motion.div>
    );
  }

  const product = data?.data;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col justify-center gap-12 lg:flex-row">
        <Gallery images={product?.images} />
        <Details
          id={product?.id}
          name={product?.name}
          brand={product?.brand}
          price={product?.price}
          viewersCount={product?.viewersCount}
          tags={product?.tags}
          description={product?.description}
          category={product?.category}
          stock={product?.stock}
          rating={product?.rating}
          images={product?.images}
        />
      </div>
      <div className="my-24">
        <Feature />
      </div>
    </section>
  );
}
