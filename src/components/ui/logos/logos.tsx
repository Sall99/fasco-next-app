"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const logos = [
  { src: "chanel.png", w: 196, h: 33 },
  { src: "louis-v.png", w: 196, h: 25 },
  { src: "prada.png", w: 196, h: 32 },
  { src: "c-k.png", w: 196, h: 33 },
  { src: "denim.png", w: 196, h: 27 },
];

export function Logos() {
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
      className="m-auto mt-24 max-w-7xl px-4 md:px-0"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.ul
        className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
        variants={containerVariants}
      >
        {logos.map(({ src, w, h }, key) => (
          <motion.li
            key={key}
            variants={logoVariants}
            whileHover="hover"
            className="flex items-center justify-center"
          >
            <div
              className="relative"
              style={{ width: `${w}px`, height: `${h}px` }}
            >
              <Image
                src={`/imgs/${src}`}
                alt={`Logo ${key + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
                priority
              />
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  );
}
