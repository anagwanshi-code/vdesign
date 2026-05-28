import { AppChrome } from "@/components/layout/app-chrome";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "@/styles/globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "V Design Surat",
    template: "%s | V Design Surat",
  },
  description:
    "Premium packaging design, luxury ecommerce, and creative agency services rooted in modern Indian artistic excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-surface font-sans text-text-primary selection:bg-saffron/30 selection:text-text-primary">
        <AppChrome footer={<Footer />}>{children}</AppChrome>
      </body>
    </html>
  );
}
