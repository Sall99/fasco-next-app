"use client";
import Image from "next/image";
import React from "react";

import { Button, Typography } from "@/components";

export function Feature() {
  return (
    <section className="m-auto my-24 flex items-center justify-between">
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
          exquisite, modern edge, this accessory pairs with any look and is easy
          to wear thanks to the adjustable strap.
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
    </section>
  );
}
