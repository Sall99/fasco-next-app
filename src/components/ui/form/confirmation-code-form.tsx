"use client";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmationCodeSchema } from "@/constants";

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
import { ShoppingBag, KeyRound, ArrowRight } from "lucide-react";
import { useConfirmCode } from "@/actions";

type FormData = {
  confirmationCode: string;
};

export function ConfirmCodeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const requestConfirmCode = useConfirmCode;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(confirmationCodeSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (!email) {
      toast.error("Email is required");
      return;
    }
    const response = await requestConfirmCode(email, data.confirmationCode);

    if (response?.resetToken) {
      router.push(
        `/auth/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(response.resetToken)}`,
      );
    }
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
          Enter Confirmation Code
        </CardTitle>
        <CardDescription>
          Please enter the confirmation code sent to your email address
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
            <Label htmlFor="confirmationCode">Confirmation Code</Label>
            <Input
              id="confirmationCode"
              type="text"
              inputMode="numeric"
              {...register("confirmationCode")}
              placeholder="Enter your confirmation code"
              className="text-center text-lg tracking-wider"
            />
            {errors.confirmationCode && (
              <p className="text-sm text-destructive">
                {errors.confirmationCode.message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-r-transparent"></span>
                  Verifying code...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Verify and continue
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-2">
        <div className="text-center text-sm">
          Didn&apos;t receive a code?{" "}
          <Link
            href="/auth/forgot-password"
            className="text-primary hover:underline"
          >
            Resend now
          </Link>
        </div>
        <div className="text-center text-xs text-muted-foreground">
          By verifying your account, you agree to our{" "}
          <Link href="/terms-conditions" className="hover:underline">
            Terms & Conditions
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
