"use client";
import Typography from "@/components/typography";
import Link from "next/link";
import React from "react";

const links = [
  { name: "Support Center", url: "/support-center" },
  { name: "Invoicing", url: "/invoicing" },
  { name: "Contract", url: "/contract" },
  { name: "Careers", url: "/careers" },
  { name: "Blog", url: "/blog" },
  { name: "FAQs", url: "/faqs" },
];

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 py-8">
      <div className="m-auto flex w-full flex-col items-center justify-between px-4 sm:flex-row lg:max-w-_876">
        <Link href="/">
          <Typography variant="h2" font="primary">
            FASCO
          </Typography>
        </Link>
        <div className="flex flex-wrap gap-4">
          {links.map((link, index) => (
            <Link key={index} href={link.url}>
              <Typography variant="p-12" color="muted" alignment="center">
                {link.name}
              </Typography>
            </Link>
          ))}
        </div>
      </div>

      <div className="m-auto mt-8 flex w-full items-center justify-center px-4 md:w-_752 lg:max-w-_876">
        <Typography variant="p-12" color="muted" alignment="center">
          &copy; {new Date().getFullYear()} FASCO. All rights reserved.
        </Typography>
      </div>
    </footer>
  );
};
