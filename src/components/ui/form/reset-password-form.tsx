"use client";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordSchema } from "@/constants";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag, Lock, KeyRound, ArrowRight } from "lucide-react";
import { useResetPassword } from "@/actions";

type FormData = {
  password: string;
  confirmPassword: string;
};

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const resetToken = searchParams.get("token");
  const requestResetPassword = useResetPassword;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (!email || !resetToken) {
      const missingField = !email ? "Email" : "Reset token";
      toast.error(`${missingField} is required`);
      return;
    }

    const response = await requestResetPassword(
      email,
      resetToken,
      data.password,
    );

    if (response?.success) {
      router.push("/auth/login");
    }
  };

  return (
    <Card className="w-full max-w-lg border-none shadow-none">
      <CardHeader className="space-y-2 text-center">
        <div className="flex items-center justify-center space-x-2">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <Link href="/" className="text-2xl font-bold tracking-tight">
            FASCO
          </Link>
        </div>
        <CardTitle className="text-2xl font-medium">
          Reset your password
        </CardTitle>
        <CardDescription>
          Enter your new password below to regain access to your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="pl-10"
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="••••••••"
                className="pl-10"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-r-transparent"></span>
                  Updating password...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Reset password
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-2">
        <div className="text-center text-sm">
          Remember your password?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
        <div className="text-center text-xs text-muted-foreground">
          By updating your password, you agree to our{" "}
          <Link href="/terms-conditions" className="hover:underline">
            Terms & Conditions
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
