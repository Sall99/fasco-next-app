"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import {
  Mail,
  PhoneCall,
  MessageCircle,
  ShoppingBag,
  CreditCard,
  User,
  Package,
} from "lucide-react";
import { motion } from "framer-motion";

const commonTopics = [
  {
    icon: <ShoppingBag className="h-5 w-5" />,
    title: "Orders",
    description: "Track, cancel, or return your orders",
    href: "/orders",
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    title: "Payments",
    description: "Payment methods, refunds, and billing",
    href: "#payments",
  },
  {
    icon: <Package className="h-5 w-5" />,
    title: "Shipping",
    description: "Delivery times, tracking, and shipping options",
    href: "#shipping",
  },
  {
    icon: <User className="h-5 w-5" />,
    title: "Account",
    description: "Manage your account settings",
    href: "/profile",
  },
];

const faqs = [
  {
    question: "How can I track my order?",
    answer:
      "You can track your order by visiting the Orders page in your account. There you'll find detailed tracking information for all your purchases.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and local payment methods. All payments are processed securely.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Shipping times vary by location. Standard shipping typically takes 3-5 business days, while express shipping takes 1-2 business days.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for most items. Products must be unused and in their original packaging. Visit our returns page for more details.",
  },
  {
    question: "How do I change my account information?",
    answer:
      "You can update your account information by going to your Profile page and clicking on the Account tab.",
  },
];

const contactMethods = [
  {
    icon: <Mail className="h-5 w-5" />,
    title: "Email Support",
    description: "Get help via email",
    action: "Send Email",
    href: "mailto:support@fasco.com",
  },
  {
    icon: <PhoneCall className="h-5 w-5" />,
    title: "Phone Support",
    description: "Talk to our support team",
    action: "Call Now",
    href: "tel:+1234567890",
  },
  {
    icon: <MessageCircle className="h-5 w-5" />,
    title: "Live Chat",
    description: "Chat with us in real-time",
    action: "Start Chat",
    href: "#chat",
  },
];

export default function SupportCenterPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <Typography variant="h2" className="mb-4">
          How can we help you?
        </Typography>
        <Typography variant="p-16" className="text-gray-600">
          Find answers to common questions or contact our support team
        </Typography>
      </motion.div>

      {/* Common Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <Typography variant="h4" className="mb-6">
          Common Topics
        </Typography>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {commonTopics.map((topic, index) => (
            <Card key={index} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {topic.icon}
                </div>
                <CardTitle>{topic.title}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="link" className="p-0" asChild>
                  <a href={topic.href}>Learn more →</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* FAQs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <Typography variant="h4" className="mb-6">
          Frequently Asked Questions
        </Typography>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                <Typography variant="p-14" className="text-gray-600">
                  {faq.answer}
                </Typography>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      {/* Contact Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Typography variant="h4" className="mb-6">
          Contact Us
        </Typography>
        <div className="grid gap-6 md:grid-cols-3">
          {contactMethods.map((method, index) => (
            <Card key={index} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {method.icon}
                </div>
                <CardTitle>{method.title}</CardTitle>
                <CardDescription>{method.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <a href={method.href}>{method.action}</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
