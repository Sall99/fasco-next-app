"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { VscGithubInverted } from "react-icons/vsc";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { signupSchema } from "@/constants";
import { signupAction } from "@/actions";
import { SignupFormData } from "@/types";

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
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, User, Mail, Phone, Lock, ArrowRight } from "lucide-react";

type FormData = {
  fName: string;
  lName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (values: SignupFormData) => {
    setIsLoading(true);
    try {
      await signupAction(values);
      toast.success("Signup successful! Welcome aboard.");
      router.push("/auth/login");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data?.error || "An error occurred");
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
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
          Create an account
        </CardTitle>
        <CardDescription>
          Join us to enjoy personalized shopping experiences
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <FcGoogle size={20} />
            <span>Google</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={() => signIn("github", { callbackUrl: "/" })}
          >
            <VscGithubInverted size={20} />
            <span>GitHub</span>
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fName"
                  {...register("fName")}
                  placeholder="John"
                  className="pl-10"
                />
              </div>
              {errors.fName && (
                <p className="text-xs text-destructive">
                  {errors.fName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lName">Last Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lName"
                  {...register("lName")}
                  placeholder="Doe"
                  className="pl-10"
                />
              </div>
              {errors.lName && (
                <p className="text-xs text-destructive">
                  {errors.lName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                {...register("email")}
                placeholder="your@email.com"
                className="pl-10"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                {...register("phone")}
                placeholder="+1 (555) 000-0000"
                className="pl-10"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
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
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-r-transparent"></span>
                Creating account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Create account
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-2">
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
        <div className="text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link href="/terms-conditions" className="hover:underline">
            Terms & Conditions
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
