"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

import { Button, Typography } from "@/components";
import { featuresData } from "@/constants/data";

export function FeatureData() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.section
      className="m-auto mt-20 max-w-7xl px-4 md:px-0"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.ul
        className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
        variants={containerVariants}
      >
        {featuresData.map(({ image, title, description, w, h }, key) => (
          <motion.li
            key={key}
            variants={logoVariants}
            whileHover="hover"
            className="flex items-center justify-center gap-4"
          >
            <div
              className="relative"
              style={{ width: `${w}px`, height: `${h}px` }}
            >
              <Image
                src={`/imgs/${image}`}
                alt={`Logo ${key + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
                priority
              />
            </div>

            <div>
              <Typography variant="h6" color="black">
                {title}
              </Typography>
              <Typography variant="p-12" color="black">
                {description}
              </Typography>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  );
}

export function Feature() {
  return (
    <section>
      <div className="m-auto my-24 flex items-center justify-between">
        <div className="h-_570 w-1/2">
          <div className="relative h-_570 w-full">
            <Image
              src="/imgs/features.png"
              alt="features"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
        <div
          className="flex h-_570 w-1/2 flex-col justify-center bg-primary-160 py-16 pl-10 pr-4 md:pl-16 lg:pl-28 lg:pr-16"
          style={{
            clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
        >
          <Typography variant="p-12" color="black" className="mb-4 opacity-60">
            Women Collection
          </Typography>
          <Typography
            variant="h2"
            font="primary"
            color="black"
            className="opacity-60"
          >
            Peaky Blinders
          </Typography>

          <Typography
            variant="p-12"
            color="black"
            className="my-4 underline opacity-60"
          >
            Description
          </Typography>
          <Typography
            variant="p-12"
            color="black"
            className="mb-4 max-w-_570 opacity-60"
          >
            Bag made from iconic gloss fabric, whose lacquered effect brings out
            the radiance and modern style of the garments colours. Offering an
            exquisite, modern edge, this accessory pairs with any look and is
            easy to wear thanks to the adjustable strap.
          </Typography>

          <div className="flex items-center gap-5">
            <Typography variant="p-12" color="black" className="opacity-60">
              Size:
            </Typography>
            <Button size="sm">M</Button>
          </div>

          <Typography variant="h4" color="black" className="my-4">
            1000$
          </Typography>

          <Button size="sm" className="lg:w-1/4">
            <Typography variant="p-12" color="white">
              Buy Now
            </Typography>
          </Button>
        </div>
      </div>
      <FeatureData />
    </section>
  );
}
