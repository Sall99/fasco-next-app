"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Typography, Button } from "@/components";

export const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.section
      className="m-auto mt-24 flex max-w-7xl justify-between"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="flex h-_756 w-_392 items-end bg-gray-200"
        variants={imageVariants}
      >
        <div className="h-_570 relative w-full">
          <Image
            src="/imgs/hero-il-1.png"
            alt="Auth illustration"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </motion.div>

      <motion.div
        className="flex h-_756 w-_427 flex-col justify-between"
        variants={containerVariants}
      >
        <motion.div
          className="h-_150 w-full overflow-hidden rounded-md bg-gray-200"
          variants={imageVariants}
        >
          <div className="relative h-full w-full">
            <Image
              src="/imgs/hero-img-1.png"
              alt="Auth illustration"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          className="flex h-_383 w-full flex-col items-center justify-center"
          variants={containerVariants}
        >
          <motion.h2
            className="font-poppins text-[91px] font-medium uppercase leading-none text-primary-600"
            variants={textVariants}
          >
            Ultimate
          </motion.h2>
          <motion.h2
            className="outline-text text-[187px] font-bold uppercase leading-none text-transparent"
            variants={textVariants}
          >
            Sale
          </motion.h2>
          <motion.div variants={textVariants}>
            <Typography variant="h6" className="uppercase" alignment="center">
              New collection
            </Typography>
          </motion.div>
          <motion.div
            variants={textVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="mt-5 uppercase">Shop now</Button>
          </motion.div>
        </motion.div>

        <motion.div className="h-_150 w-full" variants={imageVariants}>
          <div className="relative h-full w-full">
            <Image
              src="/imgs/hero-img-2.png"
              alt="Auth illustration"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex h-_756 w-_392 items-end bg-gray-200"
        variants={imageVariants}
      >
        <div className="h-_570 w-_249 relative">
          <Image
            src="/imgs/hero-il-2.png"
            alt="Auth illustration"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </motion.div>
    </motion.section>
  );
};
