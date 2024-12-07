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
      className="m-auto mt-10 flex max-w-7xl items-center justify-center px-6 lg:mt-24 lg:justify-between"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="hidden h-_756 w-_392 items-end bg-gray-200 lg:flex"
        variants={imageVariants}
      >
        <div className="relative h-_570 w-full">
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
        className="flex w-full flex-col justify-between gap-10 sm:w-_427 lg:mx-6 lg:h-_756"
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
          className="flex w-full flex-col items-center justify-center lg:h-_383"
          variants={containerVariants}
        >
          <motion.h2
            className="font-poppins text-5xl font-medium uppercase leading-none text-primary-600 lg:text-[91px]"
            variants={textVariants}
          >
            Ultimate
          </motion.h2>
          <motion.h2
            className="outline-text text-7xl font-bold uppercase leading-none text-transparent lg:text-[187px]"
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
        className="hidden h-_756 w-_392 items-end bg-gray-200 lg:flex"
        variants={imageVariants}
      >
        <div className="relative h-_570 w-_249">
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
