import { AppChrome } from "@/components/layout/app-chrome";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { resolveAnnouncements } from "@/lib/data/announcements";
import { getAnnouncementMessages } from "@/lib/sanity/queries";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Cormorant_Garamond, Dancing_Script, Inter } from "next/font/google";
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

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
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

/** Revalidate global layout data (announcements, footer settings) every 30s. */
export const revalidate = 30;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const announcementMessages = resolveAnnouncements(
    await getAnnouncementMessages(),
  );

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-screen flex-col bg-[#FAFAFA] font-sans text-zinc-600 selection:bg-brand-pink/20 selection:text-zinc-900">
        <div className="site-luxury-canvas" aria-hidden="true" />
        <div className="relative z-[1] flex min-h-screen flex-1 flex-col">
          <AppChrome
            footer={<Footer />}
            announcementMessages={announcementMessages}
          >
            {children}
          </AppChrome>
          <Toaster
            position="top-center"
            closeButton
            toastOptions={{
              className:
                "bg-zinc-900 text-white border border-zinc-800 shadow-2xl rounded-lg font-sans",
            }}
          />
          <ScrollToTop />
        </div>
      </body>
    </html>
  );
}
