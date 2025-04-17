"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const FAQs = [
  {
    category: "Shopping & Orders",
    questions: [
      {
        q: "How do I place an order?",
        a: "To place an order, browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping information and payment details to complete your purchase.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay for secure online payments.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order ships, you'll receive a tracking number via email. You can also view your order status in your account dashboard under 'Orders'.",
      },
      {
        q: "Can I modify or cancel my order?",
        a: "Orders can be modified or cancelled within 1 hour of placement. Please contact our customer service team for assistance.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "What are your shipping options?",
        a: "We offer standard shipping (5-7 business days), express shipping (2-3 business days), and next-day delivery for select locations.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.",
      },
      {
        q: "Is shipping free?",
        a: "We offer free standard shipping on orders over $100 within the continental US.",
      },
      {
        q: "How long will it take to receive my order?",
        a: "Delivery times vary based on your location and chosen shipping method. Standard shipping typically takes 5-7 business days.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 30 days of purchase. Items must be unused and in original packaging with tags attached.",
      },
      {
        q: "How do I initiate a return?",
        a: "Log into your account, go to 'Orders', select the item you wish to return, and follow the return instructions. You'll receive a return shipping label via email.",
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds are processed within 3-5 business days after we receive your return. The amount will be credited to your original payment method.",
      },
      {
        q: "Do you offer exchanges?",
        a: "Yes, we offer exchanges for different sizes or colors within 30 days of purchase, subject to availability.",
      },
    ],
  },
  {
    category: "Product Information",
    questions: [
      {
        q: "How can I find my size?",
        a: "Each product page includes a detailed size guide. Measure yourself and compare with our size charts for the best fit.",
      },
      {
        q: "Are your products authentic?",
        a: "Yes, all our products are 100% authentic and sourced directly from authorized manufacturers and distributors.",
      },
      {
        q: "What if an item is out of stock?",
        a: "You can sign up for email notifications on the product page to be alerted when the item is back in stock.",
      },
      {
        q: "Do you offer product warranties?",
        a: "Product warranties vary by manufacturer. Specific warranty information is listed on individual product pages.",
      },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredFAQs, setFilteredFAQs] = React.useState(FAQs);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredFAQs(FAQs);
      return;
    }

    const filtered = FAQs.map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(query.toLowerCase()) ||
          q.a.toLowerCase().includes(query.toLowerCase()),
      ),
    })).filter((category) => category.questions.length > 0);

    setFilteredFAQs(filtered);
  };

  return (
    <div className="mx-auto mt-20 max-w-4xl px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <Typography variant="h4" className="mb-4">
          Frequently Asked Questions
        </Typography>
        <Typography variant="p-14" className="text-muted-foreground">
          Find answers to common questions about our products, services, and
          policies
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className="relative mx-auto max-w-lg">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search FAQ..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        {filteredFAQs.map((section, index) => (
          <div key={section.category}>
            <Typography
              variant="h6"
              className={cn("mb-4", index !== 0 && "mt-8")}
            >
              {section.category}
            </Typography>
            <Accordion type="single" collapsible className="w-full">
              {section.questions.map((item, qIndex) => (
                <AccordionItem key={qIndex} value={`item-${index}-${qIndex}`}>
                  <AccordionTrigger className="text-base">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent>
                    <Typography
                      variant="p-14"
                      className="text-muted-foreground"
                    >
                      {item.a}
                    </Typography>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        {filteredFAQs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <Typography variant="p-14" className="text-muted-foreground">
              No FAQ matches your search. Try different keywords or browse all
              categories above.
            </Typography>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
