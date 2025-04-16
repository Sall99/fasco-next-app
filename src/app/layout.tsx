import type { Metadata } from "next";
import { Volkhov, Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Toaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";
import { Header } from "@/components";
import StoreProvider from "@/store/provider";
import { SessionWrapper } from "../../libs";
import { getServerSession } from "next-auth";
import { authOptions } from "../../libs/auth-options";
import { ClientLayout } from "@/utils/client-route";

const DigitalNumbers = localFont({
  src: "./fonts/DigitalNumbers-Regular.ttf",
  variable: "--font-digital-number",
});

const volkhov = Volkhov({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-volkhov",
});

const poppins = Poppins({
  subsets: ["latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  openGraph: {
    title: "Create Next App",
    description: "Generated by create next app",
    url: "https://www.example.com",
    siteName: "Create Next App",
    images: [
      {
        url: "https://www.example.com/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Og Image Alt",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@site_account",
    creator: "@individual_account",
    title: "Create Next App",
    description: "Generated by create next app",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  const user = session?.user
    ? {
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        role: session.user.role ?? "",
      }
    : null;

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Generated by create next app" />
        <meta property="og:title" content="Create Next App" />
        <meta
          property="og:description"
          content="Generated by create next app"
        />
        <meta property="og:url" content="https://www.example.com" />
        <meta property="og:site_name" content="Create Next App" />
        <meta
          property="og:image"
          content="https://www.example.com/og-image.jpg"
        />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@site_account" />
        <meta name="twitter:creator" content="@individual_account" />
        <meta name="twitter:title" content="Create Next App" />
        <meta
          name="twitter:description"
          content="Generated by create next app"
        />
        <meta
          name="twitter:image"
          content="https://www.example.com/twitter-image.jpg"
        />
        <title>Create Next App</title>
      </head>
      <body
        className={`${DigitalNumbers.variable} ${volkhov.variable} ${poppins.variable} base-layout antialiased`}
      >
        <StoreProvider>
          <SessionWrapper>
            <Header user={user} />
            <ClientLayout>
              {children}
              <Toaster />
              <SonnerToaster richColors />
            </ClientLayout>
          </SessionWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
