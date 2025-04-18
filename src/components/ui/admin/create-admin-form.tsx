"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createAdmin } from "@/actions/admin/create-admin";
import { Input } from "../input";
import { Button } from "../button";
import { toast } from "sonner";
import { createAdminSchema } from "@/constants/yup.validation";

type FormData = {
  name: string;
  email: string;
  password: string;
};

export function CreateAdminForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(createAdminSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await createAdmin(data);
      toast.success("Admin created successfully");
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create admin",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary-600">
          Create New Admin
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Fill in the details to create a new admin account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Enter full name"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md py-2.5 text-sm font-medium text-white transition-colors duration-200"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating...
            </div>
          ) : (
            "Create Admin"
          )}
        </Button>
      </form>
    </div>
  );
}
