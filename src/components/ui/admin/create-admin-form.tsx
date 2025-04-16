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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="Full Name"
          disabled={isLoading}
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Input
          type="email"
          placeholder="Email"
          disabled={isLoading}
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Input
          type="password"
          placeholder="Password"
          disabled={isLoading}
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Creating..." : "Create Admin"}
      </Button>
    </form>
  );
}
