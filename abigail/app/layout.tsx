import { Playfair_Display, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://abigail.dbcdatastudio.com';

export const metadata = {
  title: "Abigail | The Hungarian Oracle - Authentic Gypsy Card Readings",
  description: "Certified Hungarian Gypsy Card readings by Abigail. Ancient wisdom from the heart of Eastern Europe.",
  keywords: "Hungarian oracle, gypsy cards, tarot reading, authentic card reading, Hungarian tradition",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Abigail | The Hungarian Oracle",
    description: "Certified Hungarian Gypsy Card readings. Ancient wisdom from the heart of Eastern Europe.",
    url: BASE_URL,
    siteName: "Abigail | The Hungarian Oracle",
    images: [
      {
        url: `${BASE_URL}/favicon.png`,
        width: 512,
        height: 512,
        alt: "Abigail | The Hungarian Oracle",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Abigail | The Hungarian Oracle",
    description: "Certified Hungarian Gypsy Card readings. Ancient wisdom from the heart of Eastern Europe.",
    images: [`${BASE_URL}/favicon.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-charcoal text-bone-white`}
      >
        {children}
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
