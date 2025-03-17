"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { VscGithubInverted } from "react-icons/vsc";
import toast from "react-hot-toast";
import { loginSchema } from "@/constants";

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
import { ShoppingBag, Lock, Mail, ArrowRight } from "lucide-react";

type FormData = {
  email: string;
  password: string;
};

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
  });
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (result?.error) {
        console.error(result.error);
        toast.error("Invalid email or password");
      } else {
        router.push("/");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg border-none font-poppins shadow-none">
      <CardHeader className="space-y-2 text-center">
        <div className="flex items-center justify-center space-x-2">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <Link href="/" className="text-2xl font-bold tracking-tight">
            FASCO
          </Link>
        </div>
        <CardTitle className="text-2xl font-medium">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account to continue shopping
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
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-r-transparent"></span>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign in
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-2">
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            Create an account
          </Link>
        </div>
        <div className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/terms-conditions" className="hover:underline">
            Terms & Conditions
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
