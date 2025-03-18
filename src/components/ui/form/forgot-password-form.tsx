"use client";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { forgotPasswordSchema } from "@/constants";

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
import { ShoppingBag, Mail, KeyRound, ArrowRight } from "lucide-react";
import { useForgotPassword } from "@/actions";
import { useRouter } from "next/navigation";

type FormData = {
  email: string;
};

export function ForgotPasswordForm() {
  const sendForgotPasswordCode = useForgotPassword;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isRequesting },
  } = useForm<FormData>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: FormData) => {
    await sendForgotPasswordCode(data.email);
    router.push(`/auth/confirm-code?email=${encodeURIComponent(data.email)}`);
  };

  return (
    <Card className="w-full max-w-md border-none shadow-none">
      <CardHeader className="space-y-2 text-center">
        <div className="flex items-center justify-center space-x-2">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <Link href="/" className="text-2xl font-bold tracking-tight">
            FASCO
          </Link>
        </div>
        <CardTitle className="text-2xl font-medium">
          Forgot your password?
        </CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your
          password
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
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="your@email.com"
                className="pl-10"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isRequesting}>
              {isRequesting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-r-transparent"></span>
                  Sending recovery link...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send recovery link
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
        <div className="mt-2 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            Create an account
          </Link>
        </div>
        <div className="text-center text-xs text-muted-foreground">
          By requesting a password reset, you agree to our{" "}
          <Link href="/terms-conditions" className="hover:underline">
            Terms & Conditions
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
