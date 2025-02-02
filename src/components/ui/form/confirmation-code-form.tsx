"use client";
import React from "react";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import { Input, Typography, Button } from "@/components";
import { confirmationCodeSchema } from "@/constants";
import { useRouter } from "next/navigation";

type InputType = "number";
type FormData = {
  confirmationCode: number;
};

const formFields: Array<{
  name: keyof FormData;
  label: string;
  placeholder: string;
  type: InputType;
  multiline: boolean;
}> = [
  {
    name: "confirmationCode",
    label: "Enter The Confirmation Code",
    placeholder: "Confirmation Code",
    type: "number",
    multiline: false,
  },
];

export function ConfirmCodeForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(confirmationCodeSchema),
  });

  const saveSettings = async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve("Success");
        router.push("/auth/reset-password");
      }, 1000);
    });
  };

  const onSubmit = async (data: FormData) => {
    console.log(data);
    toast.promise(saveSettings(), {
      loading: "Verifying confirmation code...",
      success: <b>Verified!</b>,
      error: <b>Failed to verify the code. Try again!</b>,
    });
  };

  return (
    <div className="w-full">
      <Link href="/">
        <Typography variant="h2" font="primary">
          FASCO
        </Typography>
      </Link>

      <div className="mt-20">
        <Typography variant="h5" font="primary" className="mb-7">
          Enter The Confirmation Code
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
                Send confirmation code
              </Typography>
            </Button>
          </form>
          <Typography variant="p-12" alignment="center" className="mt-5">
            Didn’t receive Confirmation Code?{" "}
            <Link
              href="/auth/forgot-password"
              className="text-blue-500 underline"
            >
              Resend Now
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
