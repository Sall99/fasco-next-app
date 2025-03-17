import React from "react";
import Image from "next/image";
import { ConfirmCodeForm } from "@/components/ui/form/confirmation-code-form";

export default function ConfirmCode() {
  return (
    <section className="flex min-h-screen bg-gray-50">
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-black/50" />
        <Image
          src="/imgs/auth-img.jpg"
          alt="E-commerce showcase"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        <div className="absolute bottom-8 left-8 z-20 text-white">
          <h2 className="mb-2 text-3xl font-bold">Verify your identity</h2>
          <p className="max-w-md text-lg">
            We&apos;ve sent you a confirmation code to verify your identity and
            help you recover your account.
          </p>
        </div>
      </div>
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2 xl:p-12">
        <ConfirmCodeForm />
      </div>
    </section>
  );
}
