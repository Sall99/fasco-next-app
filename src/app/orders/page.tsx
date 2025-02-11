"use client";
import React from "react";
import Image from "next/image";
import { Typography } from "@/components";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type Order = {
  id: number;
  date: string;
  total: number;
  status: string;
  products: Product[];
};

const Orders = () => {
  const orders: Order[] = [
    {
      id: 1,
      date: "2023-01-15",
      total: 8500.99,
      status: "Delivered",
      products: [
        {
          productId: "676470e3f9d82c95c6d79392",
          name: "Bomber jacket in cashmere",
          price: 8500.99,
          quantity: 1,
          image:
            "https://res.cloudinary.com/dx6jhjxpt/image/upload/v1734110527/fasco/PI001182U38087_1985_4_frdwxp.webp",
        },
        {
          productId: "676470e3f9d82c95c6d79392",
          name: "Bomber jacket in cashmere",
          price: 8500.99,
          quantity: 1,
          image:
            "https://res.cloudinary.com/dx6jhjxpt/image/upload/v1734110527/fasco/PI001182U38087_1985_4_frdwxp.webp",
        },
        {
          productId: "676470e3f9d82c95c6d79392",
          name: "Bomber jacket in cashmere",
          price: 8500.99,
          quantity: 1,
          image:
            "https://res.cloudinary.com/dx6jhjxpt/image/upload/v1734110527/fasco/PI001182U38087_1985_4_frdwxp.webp",
        },
      ],
    },
  ];

  return (
    <div className="m-auto mt-20 max-w-7xl space-y-4">
      <Typography variant="h6">Order History</Typography>
      {orders.map((order) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full rounded-lg bg-white p-10 shadow"
        >
          <div className="flex justify-between border-b pb-2">
            <div>
              <Typography variant="p-14" className="font-semibold">
                Order #{order.id}
              </Typography>
              <Typography variant="p-12" className="text-gray-500">
                {new Date(order.date).toLocaleDateString()}
              </Typography>
            </div>
            <div className="text-right">
              <Typography variant="p-14" className="font-semibold">
                ${order.total.toFixed(2)}
              </Typography>
              <Typography
                variant="p-12"
                className={`font-medium ${
                  order.status === "Delivered"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {order.status}
              </Typography>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <AnimatePresence initial={false}>
              {order.products.map((product, index) => (
                <motion.div
                  key={`${product.productId}-${index}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-4"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <Typography variant="p-14" className="font-medium">
                      {product.name}
                    </Typography>
                    <Typography variant="p-12" className="text-gray-500">
                      Qty: {product.quantity}
                    </Typography>
                    <Typography variant="p-14" className="mt-1">
                      ${product.price.toFixed(2)}
                    </Typography>
                  </div>
                  <button className="h-fit self-start rounded-md border border-black px-4 py-2 text-sm hover:bg-gray-100">
                    Buy again
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Orders;
