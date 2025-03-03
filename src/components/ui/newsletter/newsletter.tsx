"use client";
import Typography from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50 px-4 py-24">
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-400" />
        <div className="absolute bottom-20 right-20 h-64 w-64 rounded-full bg-purple-400" />
        <div className="absolute left-1/2 top-1/3 h-20 w-20 rounded-full bg-yellow-300" />
      </div>

      <div className="relative z-10 m-auto mt-8 flex max-w-6xl flex-col items-center justify-between gap-12 px-4 lg:flex-row lg:px-0">
        <div
          className="relative h-64 w-full max-w-xs overflow-hidden rounded-2xl shadow-xl lg:h-96"
          style={{
            transform: "perspective(1000px) rotateY(10deg)",
            transition: "transform 0.5s ease-in-out",
          }}
        >
          <Image
            src={"/imgs/newsletter-1.png"}
            alt="Newsletter showcase"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <div className="w-full max-w-md py-8 text-center">
          <div className="mb-8 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-600">
            Stay Updated
          </div>

          <Typography
            variant="h2"
            className="font-poppins text-4xl font-semibold leading-tight text-gray-900"
          >
            Join Our <span className="text-blue-600">Newsletter</span>
          </Typography>

          <Typography variant="p-14" className="mt-4 text-gray-600">
            Get exclusive updates, industry insights, and special offers
            delivered straight to your inbox.
          </Typography>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="h-14 w-full rounded-lg border border-gray-200 bg-white px-5 pr-12 shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
                <div className="absolute right-4 top-4 text-gray-400">
                  <Mail />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="relative h-14 w-full rounded-lg bg-blue-600 font-medium text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-70"
              >
                {isLoading ? "Subscribing..." : "Subscribe Now"}
              </Button>

              <p className="mt-3 text-xs text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          ) : (
            <div className="mt-8 rounded-lg bg-green-50 p-6 text-center">
              <div className="mb-2 text-3xl">🎉</div>
              <h3 className="text-xl font-semibold text-green-700">
                Thank You!
              </h3>
              <p className="mt-2 text-green-600">
                You&apos;ve successfully subscribed to our newsletter.
              </p>
            </div>
          )}
        </div>

        <div
          className="relative h-64 w-full max-w-xs overflow-hidden rounded-2xl shadow-xl lg:h-96"
          style={{
            transform: "perspective(1000px) rotateY(-10deg)",
            transition: "transform 0.5s ease-in-out",
          }}
        >
          <Image
            src={"/imgs/newsletter-2.png"}
            alt="Newsletter benefits"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}
