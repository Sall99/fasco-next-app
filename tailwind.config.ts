import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        digitalNumbers: ["var(--font-digital-number)"],
        volkhov: ["var(--font-volkhov)"],
        poppins: ["var(--font-poppins)"],
      },
      colors: {
        primary: {
          600: "var(--color-primary-600)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
