import { ForgotPasswordForm } from "@/components/ui/form/forgot-password-form";
import Image from "next/image";
import React from "react";

export default function ForgotPassword() {
  return (
    <section className="flex min-h-screen">
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/imgs/auth-img.jpg"
          alt="Auth illustration"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      <div className="mb-20 flex w-full items-center justify-center px-5 pt-20 lg:mb-0 lg:w-1/2 xl:px-20 2xl:px-24">
        <ForgotPasswordForm />
      </div>
    </section>
  );
}
