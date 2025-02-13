"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";
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
  <div className="flex flex-col justify-center gap-4 md:flex-row md:gap-4">
    <motion.div
      className="flex gap-2 overflow-x-auto md:max-h-[600px] md:flex-col md:overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {[1, 2, 3, 4].map((index) => (
        <Skeleton key={index} className="h-20 w-20 flex-shrink-0" />
      ))}
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <Skeleton className="aspect-[3/4] w-full md:w-_438 lg:h-_570" />
    </motion.div>
  </div>
);

const DetailsSkeleton = () => (
  <div className="space-y-4 lg:w-_500">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-8 w-3/4" />

    <div className="flex items-center gap-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-24" />
    </div>

    <Skeleton className="h-6 w-24" />

    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>

    <div className="flex flex-wrap gap-2">
      {[1, 2, 3].map((index) => (
        <Skeleton key={index} className="h-8 w-20 rounded-full" />
      ))}
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-8 w-24" />
    </div>

    <div className="flex items-center gap-4">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-full" />
    </div>

    <div className="flex items-center gap-4">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </div>
);

function Gallery({ images }: GalleryProps) {
  const [mainIndex, setMainIndex] = useState(0);

  const handleThumbnailClick = (index: number) => {
    setMainIndex(index);
  };

  return (
    <div className="flex flex-col justify-center gap-4 md:flex-row md:gap-4">
      <motion.div
        className="flex gap-2 overflow-x-auto md:max-h-[600px] md:flex-col md:overflow-y-auto"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {images.map((src, index) => (
          <motion.button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`relative h-20 w-20 flex-shrink-0 border-2 transition-all ${
              mainIndex === index
                ? "border-primary opacity-100 shadow-md"
                : "border-transparent"
            }`}
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
        <div className="mx-auto flex h-full overflow-hidden md:w-_438 lg:h-_570">
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
                className="object-cover"
                priority
              />
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
  viewersCount,
  tags,
  description,
  category,
  stock,
  rating,
  images,
}: DetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

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
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    setQuantity(quantity - 1);
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

  return (
    <div className="lg:w-_500">
      <Typography variant="p-12" className="text-primary">
        {category.name}
      </Typography>
      <Typography variant="p-12" className="text-primary">
        {brand}
      </Typography>
      <Typography variant="h5" className="text-primary mb-4" font={"primary"}>
        {name}
      </Typography>
      <div className="mb-4 flex items-center gap-2">
        <StarRating average={rating.average} />
        {rating.reviewsCount > 0 && (
          <Typography variant="p-12" className="text-primary">
            ({rating.reviewsCount} reviews)
          </Typography>
        )}
      </div>
      <Typography variant="h6" className="text-primary">
        ${price}
      </Typography>
      <Typography variant="p-12" className="text-primary mt-4">
        {description}
      </Typography>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Typography
            key={index}
            variant="p-12"
            className="text-primary rounded-full bg-gray-200 px-2 py-1"
          >
            {tag}
          </Typography>
        ))}

        <Typography
          variant="p-12"
          className="text-primary rounded-full bg-gray-200 px-2 py-1"
        >
          {category.slug}
        </Typography>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Typography variant="p-12" className="text-primary">
          Stock:
        </Typography>
        <Typography variant="p-12" className="text-primary">
          {stock.quantity}
        </Typography>

        <Typography variant="p-12" className="text-primary">
          Low stock threshold:
        </Typography>
        <Typography variant="p-12" className="text-primary">
          {stock.lowStockThreshold}
        </Typography>

        <Typography variant="p-12" className="text-primary">
          Viewers:
        </Typography>
        <Typography variant="p-12" className="text-primary flex gap-2">
          <span>{viewersCount}</span>
          <span>are viewing this product right now</span>
        </Typography>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            className="rounded-md bg-gray-600 px-4 py-2 text-white"
            onClick={handleDecrement}
          >
            <Minus size={10} />
          </button>
          <div className="flex w-8 items-center justify-center">
            <Typography variant="p-12" className="text-primary">
              {quantity}
            </Typography>
          </div>
          <button
            className="rounded-md bg-gray-600 px-4 py-2 text-white"
            disabled={stock.quantity === 0}
            onClick={handleIncrement}
          >
            <Plus size={10} />
          </button>
        </div>
        <Button size="sm" className="mt-4" onClick={handleAddToCart}>
          Add to cart
        </Button>
      </div>
      <div className="mt-4 flex gap-4">
        <Typography variant="p-12" className="text-primary">
          Share:
        </Typography>
        <button className="text-primary" onClick={handleTwitterShare}>
          <FaTwitter size={20} />
        </button>
        <button className="text-primary" onClick={handleFacebookShare}>
          <FaFacebookF size={20} />
        </button>
      </div>
    </div>
  );
};

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetProduct(id);

  if (isLoading) {
    return (
      <section className="mx-auto mt-10">
        <motion.div
          className="flex flex-col justify-center gap-4 p-4 md:gap-8 lg:flex-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GallerySkeleton />
          <DetailsSkeleton />
        </motion.div>
        <div className="my-40">
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
        <div className="text-red-600">Error loading product</div>
      </motion.div>
    );
  }

  const product = data?.data;

  return (
    <section className="mx-auto mt-10">
      <div className="flex flex-col justify-center gap-4 p-4 md:gap-8 lg:flex-row">
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
      <div className="my-40">
        <Feature />
      </div>
    </section>
  );
}
