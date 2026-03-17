import type { Metadata } from "next";
import { Syne, Inter } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Buta Solutions — Software Agency",
  description:
    "Buta Solutions is a software agency rooted in Gracanica, Serbia. We build venture-grade mobile apps, web platforms, and digital solutions for startups and businesses worldwide.",
  openGraph: {
    title: "Buta Solutions — Software Agency",
    description:
      "We build applications that drive growth. Venture building, product development, and digital solutions from Gracanica to the world.",
    type: "website",
    locale: "en_US",
    siteName: "Buta Solutions",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buta Solutions — Software Agency",
    description:
      "We build applications that drive growth. Venture building, product development, and digital solutions from Gracanica to the world.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable}`}>
      <body className="bg-background text-text-primary font-inter antialiased">
        {children}
      </body>
    </html>
  );
}
