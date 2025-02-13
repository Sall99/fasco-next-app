"use client";
import React, { useCallback } from "react";
import { FcGoogle } from "react-icons/fc";
import { VscGithubInverted } from "react-icons/vsc";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn } from "next-auth/react";

import { Input, Typography, Button } from "@/components";
import { loginSchema } from "@/constants";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type InputType = "email" | "password";
type FormData = {
  email: string;
  password: string;
};

const formFields: Array<{
  name: keyof FormData;
  label: string;
  placeholder: string;
  type: InputType;
  multiline: boolean;
}> = [
  {
    name: "email",
    label: "Email",
    placeholder: "Email Address",
    type: "email",
    multiline: false,
  },

  {
    name: "password",
    label: "Password",
    placeholder: "Password",
    type: "password",
    multiline: false,
  },
];

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

  const onSubmit: SubmitHandler<FormData> = useCallback(
    async (values) => {
      setLoading(true);
      try {
        const result = await signIn("credentials", {
          ...values,
          redirect: false,
        });

        if (result?.error) {
          console.error(result.error);
          toast.error("An error occurred. Please try again later.");
        }

        if (result) {
          router.push("/");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again later.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [router],
  );
  return (
    <div className="w-full">
      <Link href="/">
        <Typography variant="h2" font="primary">
          FASCO
        </Typography>
      </Link>

      <div className="mt-6">
        <Typography variant="h5" font="primary" className="mb-7">
          Sign In To FASCO
        </Typography>

        <div className="mb-5 flex flex-col gap-5 xl:flex-row">
          <Button
            variant="outline"
            fullWidth
            leftIcon={<FcGoogle size={20} />}
            onClick={() => {
              signIn("google", {
                callbackUrl: "/",
              });
            }}
          >
            <Typography variant="p-16" font="default">
              Sign up with Google
            </Typography>
          </Button>
          <Button
            variant="outline"
            fullWidth
            leftIcon={<VscGithubInverted size={20} />}
            onClick={() => {
              signIn("github", {
                callbackUrl: "/",
              });
            }}
          >
            <Typography variant="p-16" font="default">
              Sign up with Github
            </Typography>
          </Button>
        </div>
        <div className="m-auto mb-5 w-14">
          <div className="or-container">
            <span className="line"></span>
            <span className="or-text font-poppins">OR</span>
            <span className="line"></span>
          </div>
        </div>
      </div>

      <div className="flex min-h-[50vh] flex-col justify-between">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            {formFields.map(({ name, type, placeholder }, key) => (
              <Input
                key={key}
                id={name}
                {...register(name)}
                name={name}
                type={type}
                placeholder={placeholder}
                error={errors[name]?.message}
              />
            ))}
          </div>

          <div className="mt-10 px-10">
            <Button fullWidth className="mb-5" loading={loading}>
              <Typography color="white" variant="p-16" font="default">
                Log in
              </Typography>
            </Button>
            <Link href="/auth/signup">
              <Button variant="outline" fullWidth className="mb-2">
                <Typography color="blue" variant="p-16" font="default">
                  Register Now
                </Typography>
              </Button>
            </Link>
            <Link href="/auth/forgot-password">
              <Typography variant="p-12" color="blue" alignment={"right"}>
                Forgot password ?
              </Typography>
            </Link>
          </div>
        </form>

        <Typography variant="p-12" alignment="right" className="mt-10 lg:mt-0">
          <Link href="/terms-conditions">FASCO Terms & Codnitions</Link>
        </Typography>
      </div>
    </div>
  );
}
