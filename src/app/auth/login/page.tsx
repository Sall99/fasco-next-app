import { LoginForm } from "@/components/ui/form/login-form";
import Image from "next/image";
import React from "react";

export default function Login() {
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
          <h2 className="mb-2 text-3xl font-bold">Shop with confidence</h2>
          <p className="max-w-md text-lg">
            Discover the perfect products for your lifestyle with our curated
            collection.
          </p>
        </div>
      </div>
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2 xl:p-12">
        <LoginForm />
      </div>
    </section>
  );
}
