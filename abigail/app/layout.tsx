import { Playfair_Display, Inter } from "next/font/google";
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

export const metadata = {
  title: "Abigail | The Hungarian Oracle - Authentic Gypsy Card Readings",
  description: "Certified Hungarian Gypsy Card readings by Abigail. Ancient wisdom from the heart of Eastern Europe.",
  keywords: "Hungarian oracle, gypsy cards, tarot reading, authentic card reading, Hungarian tradition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Abigail | The Hungarian Oracle</title>
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-charcoal text-bone-white`}
      >
        {children}
      </body>
    </html>
  );
}


