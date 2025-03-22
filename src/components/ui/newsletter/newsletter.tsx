"use client";
import { useState } from "react";
import Image from "next/image";
import { Mail, ShoppingBag, Gift, Sparkles, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Typography from "@/components/typography";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setEmail("");
    }, 1500);
  };

  const benefits = [
    { icon: <Gift className="h-5 w-5" />, text: "Exclusive Deals" },
    { icon: <ShoppingBag className="h-5 w-5" />, text: "Early Access" },
    { icon: <Sparkles className="h-5 w-5" />, text: "Special Offers" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-24">
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-blue-400/5" />
        <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-purple-400/5" />
        <div className="absolute left-1/3 top-1/4 h-32 w-32 rounded-full bg-yellow-300/5" />

        <div className="absolute left-1/4 top-1/2 h-2 w-2 rounded-full bg-blue-500" />
        <div className="absolute left-3/4 top-1/3 h-2 w-2 rounded-full bg-purple-500" />
        <div className="absolute left-2/3 top-2/3 h-2 w-2 rounded-full bg-emerald-500" />
        <div className="absolute left-1/2 top-1/4 h-2 w-2 rounded-full bg-amber-500" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 px-4 text-blue-700"
          >
            Join Our Community
          </Badge>
          <h2 className="mt-4 font-volkhov text-4xl font-bold tracking-tight text-slate-600 sm:text-5xl">
            Get <span>Exclusive</span> Offers
          </h2>
          <Typography
            variant="p-16"
            className="mx-auto mt-4 max-w-2xl text-slate-600"
            alignment={"center"}
          >
            Subscribe to our newsletter and receive special discounts, early
            access to new products, and personalized recommendations tailored to
            your style.
          </Typography>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="overflow-hidden border-none bg-transparent shadow-none">
            <CardContent className="relative flex h-full items-center justify-center p-0">
              <div className="relative flex h-full w-full items-center justify-center">
                <div className="relative h-64 w-64 overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:scale-105 lg:h-80 lg:w-80">
                  <Image
                    src="/imgs/newsletter-1.png"
                    alt="Featured product"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Badge className="mb-2 bg-white/90 text-slate-900">
                      <span className="hover:text-white">New Arrival</span>
                    </Badge>
                    <Typography
                      variant="p-12"
                      className="text-sm font-medium text-white"
                    >
                      Explore our latest collection
                    </Typography>
                  </div>
                </div>

                <div className="absolute -right-8 -top-8 h-40 w-40 overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:scale-105 lg:h-48 lg:w-48">
                  <Image
                    src="/imgs/newsletter-2.png"
                    alt="Special offer"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/40" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <Typography
                      variant="p-12"
                      className="font-medium text-white"
                    >
                      Member exclusives
                    </Typography>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-white/80 backdrop-blur">
            <CardContent className="p-6 pt-6">
              <div className="mb-6">
                <Typography variant="h6" className="font-semibold">
                  Subscribe for Member Benefits
                </Typography>
                <Typography variant="p-14" className="mt-2">
                  Join our community of fashion enthusiasts and be the first to
                  know.
                </Typography>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="h-12 pl-10 pr-4"
                      required
                    />
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  </div>
                  <Typography variant="p-12">
                    We respect your privacy. Unsubscribe anytime.
                  </Typography>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-fullfont-medium h-12 w-full text-white transition-colors"
                >
                  {isLoading ? "Subscribing..." : "Subscribe Now"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>

              <div className="mt-8">
                <Typography
                  variant={"p-14"}
                  className="mb-4 text-sm font-medium text-slate-700"
                >
                  Subscriber Benefits:
                </Typography>
                <div className="grid grid-cols-3 gap-2">
                  {benefits.map((benefit, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex flex-col items-center rounded-lg border border-slate-100 bg-white p-3 text-center shadow-sm transition-all hover:border-blue-100 hover:shadow">
                            <div className="mb-1 rounded-full bg-blue-50 p-2">
                              {benefit.icon}
                            </div>
                            <Typography variant="p-12">
                              {benefit.text}
                            </Typography>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <Typography
                            variant="p-14"
                            className="text-xs text-white"
                          >
                            {benefit.text === "Exclusive Deals"
                              ? "Members-only discounts and bundles"
                              : benefit.text === "Early Access"
                                ? "Shop new collections before anyone else"
                                : "Seasonal promotions and birthday gifts"}
                          </Typography>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
