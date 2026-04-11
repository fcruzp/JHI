import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/jhi/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "J Huge International | Global Commodity Intermediaries",
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
  ],
  authors: [{ name: "J Huge International" }],
  icons: {
    icon: "/images/logo-dark.png",
  },
  openGraph: {
    title: "J Huge International | Global Commodity Intermediaries",
    description:
      "Trusted global commodity intermediaries since 2008. Facilitating trade across 50+ countries.",
    type: "website",
  },
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
