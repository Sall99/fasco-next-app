"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Typography } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Message sent successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="m-auto mt-20 max-w-7xl px-4">
      <div className="mb-12 text-center">
        <Typography variant="h4" className="mb-4">
          Contact Us
        </Typography>
        <Typography variant="p-14" className="text-muted-foreground">
          Have questions? We&apos;d love to hear from you. Send us a message and
          we&apos;ll respond as soon as possible.
        </Typography>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we&apos;ll get back to you within 24
                hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Input placeholder="First Name" name="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Input placeholder="Last Name" name="lastName" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input placeholder="Subject" name="subject" required />
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Your Message"
                    name="message"
                    required
                    className="min-h-[150px]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Find us at our office or reach out through our contact channels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <Typography variant="p-14" className="font-medium">
                    Office Address
                  </Typography>
                  <Typography variant="p-14" className="text-muted-foreground">
                    123 Fashion Street
                    <br />
                    New York, NY 10001
                    <br />
                    United States
                  </Typography>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <Typography variant="p-14" className="font-medium">
                    Phone Number
                  </Typography>
                  <Typography variant="p-14" className="text-muted-foreground">
                    +1 (555) 123-4567
                  </Typography>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <Typography variant="p-14" className="font-medium">
                    Email Address
                  </Typography>
                  <Typography variant="p-14" className="text-muted-foreground">
                    support@fasco.com
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>
                Our support team is available during these hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Typography variant="p-14">Monday - Friday</Typography>
                  <Typography variant="p-14" className="text-muted-foreground">
                    9:00 AM - 6:00 PM EST
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="p-14">Saturday</Typography>
                  <Typography variant="p-14" className="text-muted-foreground">
                    10:00 AM - 4:00 PM EST
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="p-14">Sunday</Typography>
                  <Typography variant="p-14" className="text-muted-foreground">
                    Closed
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
