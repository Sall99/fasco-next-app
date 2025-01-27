"use client";
import { useGetProduct } from "@/actions";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useState } from "react";

interface GalleryProps {
  images: string[];
}

function Gallery({ images }: GalleryProps) {
  const [mainIndex, setMainIndex] = useState(0);

  const handleThumbnailClick = (index: number) => {
    setMainIndex(index);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-4">
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
        className="relative flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex w-_438">
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

export default function Page() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useGetProduct(id);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-white">
        <div className="text-primary mt-4">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-white">
        <div className="text-primary mt-4">Error loading product</div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col-reverse gap-4 p-4 md:flex-row">
      <Gallery images={data?.data.images || []} />
    </div>
  );
}
