import { AboutHeroHeading } from "@/components/blocks/about-hero-heading";
import { AboutJourney } from "@/components/blocks/about-journey";
import { AboutStudio } from "@/components/blocks/about-studio";
import { AboutValues } from "@/components/blocks/about-values";
import { FounderStory } from "@/components/blocks/founder-story";
import { PremiumCta } from "@/components/blocks/premium-cta";
import { client } from "@/sanity/lib/client";
import { ABOUT_PAGE_QUERY, FOUNDER_QUERY } from "@/sanity/lib/queries";
import { Play } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover V Design—our journey, values, studio, and the team crafting premium branding, packaging, and print in Surat.",
};

const DEFAULT_HERO_TITLE = "Crafting Brands.";
const DEFAULT_HERO_LINE = "Creating";
const DEFAULT_HERO_HIGHLIGHT = "Impact.";
const DEFAULT_HERO_DESCRIPTION =
  "For nearly two decades, V Design has transformed businesses through premium branding, luxury packaging, and print excellence—rooted in Surat and trusted across India.";

export default async function AboutPage() {
  const [founder, about] = await Promise.all([
    client.fetch(FOUNDER_QUERY),
    client.fetch(ABOUT_PAGE_QUERY),
  ]);

  const heroDescription =
    about?.heroDescription?.trim() || DEFAULT_HERO_DESCRIPTION;
  const heroImageUrl = about?.heroImageUrl;
  const cmsHeroTitle = about?.heroTitle?.trim();
  const cmsHeroHighlight = about?.heroHighlight?.trim();

  return (
    <>
      <section className="relative overflow-hidden bg-luxury-bg pb-16 pt-32 md:pb-24 md:pt-40">
        <div
          className="pointer-events-none absolute -right-24 top-20 h-96 w-96 rounded-full bg-royal-magenta/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-0 top-1/3 h-80 w-80 rounded-full bg-peacock-blue/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-1/4 top-10 h-64 w-64 opacity-30"
          aria-hidden="true"
        >
          <div className="h-full w-full rounded-full border border-royal-magenta/20 bg-[radial-gradient(circle_at_center,rgba(217,30,99,0.08)_0%,transparent_70%)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
              ABOUT US
            </p>
            <h1 className="mb-6 font-serif text-5xl leading-tight text-luxury-text md:text-7xl">
              <AboutHeroHeading
                title={cmsHeroTitle}
                highlight={cmsHeroHighlight}
                defaultTitle={DEFAULT_HERO_TITLE}
                defaultLine={DEFAULT_HERO_LINE}
                defaultHighlight={DEFAULT_HERO_HIGHLIGHT}
              />
            </h1>
            <p className="mb-8 max-w-xl text-lg text-luxury-muted">
              {heroDescription}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/consultation"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 text-sm font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Let&apos;s Work Together
              </Link>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-8 py-3 text-sm font-medium text-luxury-text transition-colors hover:border-royal-magenta hover:text-royal-magenta"
                aria-label="Watch our story (coming soon)"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-royal-magenta/10 text-royal-magenta">
                  <Play className="h-4 w-4 fill-current" strokeWidth={0} />
                </span>
                Watch Our Story
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-peacock-blue/15 via-transparent to-royal-magenta/15 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xl">
              {heroImageUrl ? (
                <Image
                  src={heroImageUrl}
                  alt="V Design studio and brand showcase"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  unoptimized={!heroImageUrl.startsWith("http")}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-peacock-blue/25 via-zinc-50 to-royal-magenta/20 p-8 text-center">
                  <span className="mb-2 font-serif text-3xl text-peacock-blue/80 md:text-4xl">
                    Peacock &amp; Packaging
                  </span>
                  <span className="max-w-xs text-sm text-luxury-muted">
                    Hero visual placeholder — premium brand &amp; print showcase
                  </span>
                </div>
              )}
              <Image
                src="/logo.png"
                alt=""
                width={80}
                height={80}
                className="absolute bottom-6 right-6 h-16 w-auto opacity-20"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      <AboutJourney
        title={about?.journeyTitle}
        timeline={about?.journeyTimeline}
      />
      <AboutValues
        title={about?.valuesTitle}
        valuesList={about?.valuesList}
      />
      <FounderStory founder={founder} />
      <AboutStudio
        heading={about?.studioHeading}
        description={about?.studioDescription}
        imageUrls={about?.studioImageUrls}
      />
      <PremiumCta />
    </>
  );
}
