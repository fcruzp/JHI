import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/jhi/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://jhugeinternational.com'),
  title: {
    default: "J Huge International | Global Commodity Intermediaries",
    template: "%s | J Huge International",
  },
  description:
    "J Huge International (JHI) - Trusted global commodity intermediaries since 2008. Facilitating trade across 50+ countries in sugar, meat, grains, coffee, edible oils, and dairy.",
  keywords: [
    "JHI",
    "commodities",
    "global trading",
    "commodity intermediaries",
    "sugar",
    "meat",
    "grains",
    "coffee",
    "edible oils",
    "dairy",
    "international trade",
    "FOB",
    "CIF",
    "commodity broker",
  ],
  authors: [{ name: "J Huge International" }],
  creator: "J Huge International",
  publisher: "J Huge International",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/images/logo-dark.png",
    apple: "/images/logo-dark.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jhugeinternational.com",
    siteName: "J Huge International",
    title: "J Huge International | Global Commodity Intermediaries",
    description:
      "Trusted global commodity intermediaries since 2008. Facilitating trade across 50+ countries in sugar, meat, grains, coffee, edible oils, and dairy.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "J Huge International - Global Commodity Trading",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "J Huge International | Global Commodity Intermediaries",
    description:
      "Trusted global commodity intermediaries since 2008. Facilitating trade across 50+ countries.",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://jhugeinternational.com",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: "business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
