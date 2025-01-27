"use client";
import { Button } from "@/components/button";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const imageSlide = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const imageSlideRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export function Newsletter() {
  return (
    <section className="px-4 py-20">
      <div className="m-auto mt-24 flex max-w-7xl flex-col items-center justify-between px-4 lg:flex-row lg:px-0">
        <motion.div
          className="relative h-_500 w-_337 overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={imageSlide}
        >
          <Image
            src={"/imgs/newsletter-1.png"}
            alt="Newsletter"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            priority
          />
        </motion.div>

        <motion.div
          className="py-10 text-center lg:py-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <motion.h2 className="text-3xl font-bold" variants={fadeIn}>
            Subscribe to Our Newsletter
          </motion.h2>

          <motion.p className="mt-4 text-base" variants={fadeIn}>
            Subscribe to our newsletter to get the latest updates and special
            offers.
          </motion.p>

          <motion.form
            className="mt-10 flex flex-col items-center justify-center gap-5"
            variants={fadeIn}
          >
            <motion.input
              type="email"
              placeholder="Enter your email"
              className="h-12 w-80 rounded-md border border-gray-300 px-5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="default" size="sm">
                Subscribe
              </Button>
            </motion.div>
          </motion.form>
        </motion.div>

        <motion.div
          className="relative h-_500 w-_337 overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={imageSlideRight}
        >
          <Image
            src={"/imgs/newsletter-2.png"}
            alt="Newsletter"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
