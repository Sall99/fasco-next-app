"use client";
import React from "react";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import { Input, Typography, Button } from "@/components";
import { resetPasswordSchema } from "@/constants";
import { useRouter } from "next/navigation";

type InputType = "email" | "password";
type FormData = {
  password: string;
  confirmPassword: string;
};

const formFields: Array<{
  name: keyof FormData;
  label: string;
  placeholder: string;
  type: InputType;
  multiline: boolean;
}> = [
  {
    name: "password",
    label: "Password",
    placeholder: "Password",
    type: "password",
    multiline: false,
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Confirm Password",
    type: "password",
    multiline: false,
  },
];

export function ResetPasswordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const saveSettings = async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve("Success");
        router.push("/auth/confirm-code");
      }, 1000);
    });
  };

  const onSubmit = async (data: FormData) => {
    console.log(data);
    toast.promise(saveSettings(), {
      loading: "Sending confirmation code...",
      success: <b>Code sent successfully!</b>,
      error: <b>Failed to send code. Try again!</b>,
    });
  };

  return (
    <div className="w-full">
      <Typography variant="h2" font="primary">
        FASCO
      </Typography>

      <div className="mt-20">
        <Typography variant="h5" font="primary" className="mb-7">
          Enter Your New Password
        </Typography>
      </div>

      <div className="flex min-h-[50vh] flex-col justify-between">
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-10">
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
            <Button fullWidth className="mb-5">
              <Typography color="white" variant="p-16" font="default">
                Submit
              </Typography>
            </Button>
          </form>
          <Typography variant="p-12" alignment="center" className="mt-5">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-500 underline">
              Login
            </Link>
          </Typography>
        </div>
        <Typography variant="p-12" alignment="right" className="mt-10 lg:mt-0">
          <Link href="/terms-conditions">FASCO Terms & Codnitions</Link>
        </Typography>
      </div>
    </div>
  );
}
