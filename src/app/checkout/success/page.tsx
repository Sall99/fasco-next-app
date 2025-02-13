"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Typography, Button } from "@/components";

const CheckoutSuccessPage = () => {
  return (
    <div className="mt-20 flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          <Typography variant="h4" className="text-gray-900">
            Payment Successful!
          </Typography>

          <Typography variant="p-16" className="text-gray-600">
            Thank you for your purchase. We&apos;ll send you a confirmation
            email with your order details shortly.
          </Typography>

          <div className="mt-8 w-full space-y-4">
            <Link href="/orders" className="block w-full">
              <Button className="w-full">View Order</Button>
            </Link>

            <Link href="/shop" className="block w-full">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <div className="space-y-2">
            <Typography variant="p-14" className="text-gray-600">
              Need Help?
            </Typography>
            <Typography variant="p-14" className="text-gray-600">
              Contact our support team at{" "}
              <a
                href="mailto:support@yourstore.com"
                className="text-blue-600 hover:text-blue-700"
              >
                support@yourstore.com
              </a>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
