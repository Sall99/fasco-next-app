"use client";

import React from "react";
import { Typography } from "@/components";
import {
  formatOrderAmount,
  formatOrderDate,
  getOrderStatusColor,
  Order,
  OrderItem,
  useOrders,
} from "@/actions";
import Image from "next/image";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const Orders = () => {
  const [page, setPage] = React.useState(1);
  const { data, error, isLoading } = useOrders({
    page,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  if (isLoading)
    return (
      <div className="m-auto mt-20 max-w-7xl space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4 rounded-lg border p-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
            <div className="flex gap-4">
              <Skeleton className="h-24 w-24 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="m-auto mt-20 max-w-7xl rounded-lg bg-red-50 p-4 text-center text-red-600"
      >
        Error loading orders
      </motion.div>
    );

  if (!data) return null;

  return (
    <div className="m-auto mt-20 max-w-7xl space-y-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <Typography variant="h6">Order History</Typography>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {data?.orders.map((order: Order) => (
          <motion.div
            key={order.id}
            variants={item}
            whileHover={{ scale: 1.01 }}
            className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Order #{order.id}</h3>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`rounded-full px-3 py-1 text-sm font-medium ${getOrderStatusColor(order.status)}`}
              >
                {order.status}
              </motion.span>
            </div>

            <div className="mt-3 text-sm text-gray-600">
              <p className="font-medium">
                Total: {formatOrderAmount(order.totalAmount, order.currency)}
              </p>
              <p>Ordered on {formatOrderDate(order.createdAt)}</p>
            </div>

            <div className="mt-4 divide-y">
              {order.OrderItem.map((item: OrderItem) => (
                <motion.div
                  key={item.id}
                  whileHover={{ x: 4 }}
                  className="flex items-center space-x-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      width={100}
                      height={100}
                      className="rounded-lg object-cover transition-all hover:ring-2 hover:ring-blue-400"
                      alt={item.product.name}
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} ×{" "}
                      {formatOrderAmount(item.price, order.currency)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex items-center justify-between"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg bg-gray-100 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
          >
            Previous
          </motion.button>

          <span className="text-sm text-gray-600">
            Page {page} of {data.pagination.pages}
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage((p) => p + 1)}
            disabled={page === data.pagination.pages}
            className="rounded-lg bg-gray-100 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Orders;
