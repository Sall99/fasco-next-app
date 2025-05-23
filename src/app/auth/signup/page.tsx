import { SignupForm } from "@/components/ui/form/signup-form";
import Image from "next/image";
import React from "react";

export default function Signup() {
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
          <h2 className="mb-2 text-3xl font-bold">Join our community</h2>
          <p className="max-w-md text-lg">
            Create an account today and enjoy exclusive member benefits,
            personalized recommendations, and more.
          </p>
        </div>
      </div>
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2 xl:p-12">
        <SignupForm />
      </div>
    </section>
  );
}
