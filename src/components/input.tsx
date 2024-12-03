"use client";
import React, {
  forwardRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import clsx from "clsx";
import { VariantProps, cva } from "class-variance-authority";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

export type InputType =
  | "text"
  | "email"
  | "password"
  | "tel"
  | "number"
  | "search";

const inputVariants = cva(
  [
    "w-full",
    "font-poppins",
    "py-3",
    "border",
    "transition-all",
    "duration-300",
    "focus:outline-none",
    "tracking-wide",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-0 border-b-2 border-gray-200",
          "focus:border-b-blue-500",
          "focus:ring-blue-200",
        ],
        error: [
          "border-red-500",
          "focus:border-red-600",
          "focus:ring-red-200",
          "text-red-600",
        ],
        success: [
          "border-green-500",
          "focus:border-green-600",
          "focus:ring-green-200",
          "text-green-600",
        ],
      },
      size: {
        sm: "text-sm py-2",
        md: "text-base py-3",
        lg: "text-lg py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  multiline?: false;
  register?: UseFormRegisterReturn;
}

interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: FieldError | string;
  multiline: true;
  register?: UseFormRegisterReturn;
}

type BaseInputProps = InputProps | TextareaProps;

const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  BaseInputProps
>((props, ref) => {
  const {
    label,
    error,
    className,
    variant,
    size,
    register,
    multiline,
    ...restProps
  } = props;

  const combinedRef = ref as React.Ref<HTMLInputElement | HTMLTextAreaElement>;

  return (
    <div className="mb-4 w-full">
      {label && (
        <label
          htmlFor={props.id}
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}

      {multiline ? (
        <textarea
          ref={combinedRef as React.Ref<HTMLTextAreaElement>}
          className={clsx(
            inputVariants({ variant, size }),
            "resize-none",
            {
              "border-red-500": error,
              "mb-1": error,
            },
            className,
          )}
          {...register}
          {...(restProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={combinedRef as React.Ref<HTMLInputElement>}
          className={clsx(
            inputVariants({ variant, size }),
            {
              "border-red-500": error,
              "mb-1": error,
            },
            className,
          )}
          {...register}
          {...(restProps as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && (
        <p className="mt-1 font-poppins text-xs text-red-500">
          {typeof error === "string" ? error : error.message}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
