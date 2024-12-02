import React, { forwardRef, ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { VariantProps, cva } from "class-variance-authority";

const buttonVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "rounded-lg",
    "font-semibold",
    "transition-all",
    "duration-300",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-black",
          "text-white",
          "hover:bg-slate-900",
          "focus:ring-blue-300",
        ],
        outline: [
          "border",
          "border-blue-500",
          "bg-transparent",
          "hover:bg-blue-50",
        ],
        ghost: ["text-blue-500", "hover:bg-blue-50", "bg-transparent"],
        destructive: [
          "bg-red-500",
          "text-white",
          "hover:bg-red-600",
          "focus:ring-red-300",
        ],
      },
      size: {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-base",
        lg: "px-6 py-4 text-lg",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant,
      size,
      className,
      loading,
      fullWidth,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={loading || disabled}
        className={clsx(
          buttonVariants({ variant, size, fullWidth }),
          {
            "cursor-not-allowed opacity-50": loading || disabled,
            "gap-2": leftIcon || rightIcon,
          },
          className,
        )}
        {...props}
      >
        {loading ? (
          <span className="mr-2 animate-spin">⏳</span>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
