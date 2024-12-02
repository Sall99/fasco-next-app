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
      screens: {
        sm: "640px",

        md: "768px",

        lg: "1024px",

        xl: "1280px",

        "2xl": "1600px",
      },
      colors: {
        primary: {
          200: "var(--color-primary-200)",
          600: "var(--color-primary-600)",
        },
      },

      spacing: {
        _949: "949px",
        _1077: "1077px",
      },
    },
  },
  plugins: [],
} satisfies Config;
