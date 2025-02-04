"use client";
import React from "react";
import clsx from "clsx";
import { VariantProps, cva } from "class-variance-authority";

const typographyVariants = cva(
  ["transition-all", "duration-300", "ease-in-out", "tracking-tight"],
  {
    variants: {
      variant: {
        p: [
          "text-base",
          "md:text-lg",
          "lg:text-xl",
          "font-normal",
          "leading-relaxed",
        ],
        "p-16": ["text-[16px]", "font-normal", "leading-relaxed"],
        "p-14": ["text-[14px]", "font-normal", "leading-relaxed"],
        "p-12": ["text-[12px]", "font-normal", "leading-relaxed"],
        h1: [
          "text-3xl",
          "md:text-4xl",
          "lg:text-5xl",
          "2xl:text-[66px]",
          "font-bold",
          "leading-tight",
        ],
        h2: [
          "text-2xl",
          "md:text-3xl",
          "lg:text-4xl",
          "2xl:text-[54px]",
          "leading-tight",
        ],
        h3: [
          "text-xl",
          "md:text-2xl",
          "lg:text-3xl",
          "2xl:text-[46px]",
          "font-semibold",
          "leading-tight",
        ],
        h4: [
          "text-lg",
          "md:text-xl",
          "lg:text-2xl",
          "2xl:text-[38px]",
          "font-semibold",
          "leading-tight",
        ],
        h5: [
          "text-base",
          "md:text-lg",
          "lg:text-xl",
          "2xl:text-[30px]",
          "font-medium",
          "leading-tight",
        ],
        h6: [
          "text-sm",
          "md:text-base",
          "lg:text-lg",
          "2xl:text-[20px]",
          "font-medium",
          "leading-tight",
        ],
      },
      color: {
        default: "text-primary-600",
        muted: "text-gray-600 dark:text-gray-400",
        primary: "text-blue-600 dark:text-blue-400",
        white: "text-white",
        black: "text-black",
        blue: "text-blue-500",
        red: "text-red-500",
      },
      font: {
        default: "font-poppins",
        primary: "font-volkhov",
        secondary: "font-digitalNumbers",
      },

      alignment: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      variant: "p",
      color: "default",
      alignment: "left",
    },
  },
);

type AllowedElements =
  | keyof JSX.IntrinsicElements
  | React.ComponentType<Record<string, unknown>>;

interface TypographyProps<T extends AllowedElements>
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof typographyVariants> {
  as?: T;
  children: React.ReactNode;
}

export function Typography<T extends AllowedElements = "p">({
  as,
  variant,
  color,
  alignment,
  className,
  children,
  font = "default",
  ...props
}: TypographyProps<T>) {
  const defaultComponentMap = {
    p: "p",
    "p-16": "p",
    "p-14": "p",
    "p-12": "p",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
  };

  const Component = (as ||
    defaultComponentMap[variant || "p"]) as React.ElementType;

  return React.createElement(
    Component,
    {
      className: clsx(
        typographyVariants({
          variant,
          color,
          alignment,
          font,
        }),
        className,
      ),
      ...props,
    },
    children,
  );
}

export default Typography;
