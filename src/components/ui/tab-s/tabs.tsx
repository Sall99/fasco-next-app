"use client";

import { ProductType } from "@/types";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Product } from "../product";
import { motion } from "framer-motion";

interface TabsProps {
  categories: {
    name: string;
    data: {
      products: ProductType[];
    };
  }[];
  size?: "sm" | "md";
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export function Tabs({ categories, size = "md" }: TabsProps) {
  return (
    <div className="container mx-auto px-4 pt-24">
      <TabGroup>
        <TabList className="mb-6 flex space-x-4 overflow-x-auto lg:justify-center">
          {categories.map(({ name }) => (
            <Tab
              key={name}
              className="scroll-ml-6 scroll-smooth whitespace-nowrap rounded-md bg-primary-100 px-4 py-2 font-poppins text-sm transition-colors duration-200 focus:outline-none data-[hover]:bg-white/5 data-[selected]:bg-black data-[selected]:text-white"
            >
              {name}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {categories.map(({ name, data }) => (
            <TabPanel key={name} className="rounded-xl bg-white/5 p-3">
              {data.products && (
                <motion.ul
                  className={
                    size === "sm"
                      ? "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                      : "grid grid-cols-1 justify-center gap-6 md:grid-cols-2 lg:grid-cols-3"
                  }
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {data.products.map((product) => (
                    <motion.li
                      key={product.id}
                      className="flex justify-center"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Product product={product} size={size} />
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
}
