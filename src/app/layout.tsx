import { AppChrome } from "@/components/layout/app-chrome";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { resolveShippingConfig } from "@/lib/checkout/shipping";
import { resolveAnnouncements } from "@/lib/data/announcements";
import { getAnnouncementMessages, getSiteSettings } from "@/lib/sanity/queries";
import { Toaster } from "sonner";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Dancing_Script, Inter } from "next/font/google";
import "@/styles/globals.css";

const SITE_TITLE = "V Design | Premium Print & Packaging Studio";
const SITE_DESCRIPTION =
  "Bespoke print and luxury packaging solutions crafted in Surat. Discover our signature editions, archival materials, and white-glove fulfillment.";

function getMetadataBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return vercel.startsWith("http")
      ? vercel.replace(/\/$/, "")
      : `https://${vercel}`;
  }

  return "https://vdesign-surat.vercel.app";
}

const metadataBase = new URL(getMetadataBaseUrl());

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
  metadataBase,
  title: {
    default: SITE_TITLE,
    template: "%s | V Design",
  },
  description: SITE_DESCRIPTION,
  applicationName: "V Design",
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: metadataBase,
    siteName: "V Design",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAFAFA",
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
  const shippingConfig = resolveShippingConfig(await getSiteSettings());

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
            shippingConfig={shippingConfig}
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
