import { PremiumCta } from "@/components/blocks/premium-cta";
import { ServicesGrid } from "@/components/blocks/services-grid";
import { TrustBadges } from "@/components/blocks/trust-badges";
import { client } from "@/sanity/lib/client";
import { SERVICES_PAGE_QUERY, SERVICES_QUERY } from "@/sanity/lib/queries";
import type { ServiceDocument } from "@/types/service";
import type { ServicesPageContent } from "@/types/services-page";
import { Play } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
export const revalidate = 30;

export const metadata: Metadata = {
  title: "Services",
  description:
    "V Design premium services—branding, packaging, printing, digital marketing, web design, and business consultancy in Surat.",
};

const DEFAULT_EYEBROW = "OUR SERVICES";
const DEFAULT_HERO_HEADING = "Creative Solutions, Powerful";
const DEFAULT_HERO_HIGHLIGHT = "Results.";
const DEFAULT_HERO_DESCRIPTION =
  "From branding to printing, digital to strategy—we deliver end-to-end creative solutions that elevate your business and leave a lasting impression.";

export default async function ServicesPage() {
  const [services, pageContent] = await Promise.all([
    client.fetch<ServiceDocument[]>(SERVICES_QUERY),
    client.fetch<ServicesPageContent | null>(SERVICES_PAGE_QUERY),
  ]);

  const eyebrow = pageContent?.eyebrow?.trim() || DEFAULT_EYEBROW;
  const heroHeading = pageContent?.heroHeading?.trim() || DEFAULT_HERO_HEADING;
  const heroHighlight =
    pageContent?.heroHighlight?.trim() || DEFAULT_HERO_HIGHLIGHT;
  const heroDescription =
    pageContent?.heroDescription?.trim() || DEFAULT_HERO_DESCRIPTION;
  const heroImageUrl = pageContent?.heroImageUrl?.trim();
  const videoLink = pageContent?.videoLink?.trim();

  return (
    <div className="bg-luxury-surface/30 pt-10 lg:pt-16">
      <section className="relative overflow-hidden bg-luxury-bg pb-12 md:pb-16">
        <div
          className="pointer-events-none absolute -right-20 top-12 h-96 w-96 rounded-full bg-saffron-gold/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-0 top-1/4 h-72 w-72 rounded-full bg-royal-magenta/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
              {eyebrow}
            </p>
            <h1 className="mb-6 font-serif text-5xl leading-tight text-luxury-text md:text-7xl">
              {heroHeading}
              <br />
              <span className="font-dancing bg-gradient-to-r from-saffron-gold to-orange-500 bg-clip-text text-transparent">
                {heroHighlight}
              </span>
            </h1>
            <p className="mb-8 max-w-xl text-lg text-luxury-muted">
              {heroDescription}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/consultation"
                className="inline-flex items-center rounded-full bg-pink-600 bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 text-sm font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Let&apos;s Work Together
              </Link>
              {videoLink ? (
                <a
                  href={videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-8 py-3 text-sm font-medium text-luxury-text transition-colors hover:border-royal-magenta hover:text-royal-magenta"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-royal-magenta/10 text-royal-magenta">
                    <Play className="h-4 w-4 fill-current" strokeWidth={0} />
                  </span>
                  Watch Our Video
                </a>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-8 py-3 text-sm font-medium text-luxury-text transition-colors hover:border-royal-magenta hover:text-royal-magenta"
                  aria-label="Watch our video (add a video link in Sanity)"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-royal-magenta/10 text-royal-magenta">
                    <Play className="h-4 w-4 fill-current" strokeWidth={0} />
                  </span>
                  Watch Our Video
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-saffron-gold/20 via-transparent to-royal-magenta/15 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xl">
              {heroImageUrl ? (
                <Image
                  src={heroImageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  unoptimized={!heroImageUrl.startsWith("http")}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-white to-peacock-blue/25 p-8 text-center">
                  <span className="mb-2 font-serif text-3xl text-luxury-text/40 md:text-4xl">
                    Packaging Composition
                  </span>
                  <span className="max-w-xs text-sm text-luxury-muted">
                    Hero visual placeholder — services &amp; craft showcase
                  </span>
                </div>
              )}
              <Image
                src="/logo.png"
                alt=""
                width={72}
                height={72}
                className="absolute bottom-6 right-6 h-14 w-auto opacity-20"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      <ServicesGrid services={services} />
      <TrustBadges />
      <PremiumCta />
    </div>
  );
}
