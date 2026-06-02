import { AboutHeroHeading } from "@/components/blocks/about-hero-heading";
import { AboutJourney } from "@/components/blocks/about-journey";
import { AboutStudio } from "@/components/blocks/about-studio";
import { AboutValues } from "@/components/blocks/about-values";
import { FounderStory, type FounderData } from "@/components/blocks/founder-story";
import { PremiumCta } from "@/components/blocks/premium-cta";
import { sanityFetch } from "@/lib/sanity/client";
import { ABOUT_PAGE_QUERY, FOUNDER_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import type { AboutJourneyStatItem, AboutPageContent } from "@/types/about";
import { Play } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
export const revalidate = 30;

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover V Design—our journey, values, studio, and the team crafting premium branding, packaging, and print in Surat.",
};

const DEFAULT_HERO_TITLE = "Crafting Brands.";
const DEFAULT_HERO_HIGHLIGHT = "Impact.";
const DEFAULT_HERO_DESCRIPTION =
  "For nearly two decades, V Design has transformed businesses through premium branding, luxury packaging, and print excellence—rooted in Surat and trusted across India.";
const DEFAULT_JOURNEY_TITLE = "A Journey of Passion & Creativity";
const DEFAULT_JOURNEY_STATS: AboutJourneyStatItem[] = [
  { value: "5000+", label: "Projects" },
  { value: "18+", label: "Years" },
  { value: "100+", label: "Partners" },
  { value: "25+", label: "Awards" },
];
const DEFAULT_VALUES_TITLE = "The Principles That Define Us";
const DEFAULT_STUDIO_HEADING = "Where Ideas Come to Life";
const DEFAULT_STUDIO_DESCRIPTION =
  "Our studio is a perfect blend of creativity, technology, and craftsmanship—where brands are shaped, packaging is perfected, and every detail reflects the care your business deserves.";

export default async function AboutPage() {
  const [founder, about] = await Promise.all([
    client.fetch<FounderData | null>(FOUNDER_QUERY),
    sanityFetch<AboutPageContent>(ABOUT_PAGE_QUERY),
  ]);

  const heroTitle = about?.heroTitle?.trim() || DEFAULT_HERO_TITLE;
  const heroHighlight = about?.heroHighlight?.trim() || DEFAULT_HERO_HIGHLIGHT;
  const heroDescription =
    about?.heroDescription?.trim() || DEFAULT_HERO_DESCRIPTION;
  const heroImageUrl = about?.heroImageUrl?.trim() || null;

  const journeyTitle = about?.journeyTitle?.trim() || DEFAULT_JOURNEY_TITLE;
  const journeyTimeline =
    about?.journeyTimeline?.filter(
      (item) => item.year?.trim() || item.description?.trim(),
    ) ?? [];

  const cmsJourneyStats =
    about?.journeyStats?.filter(
      (item) => item.value?.trim() || item.label?.trim(),
    ) ?? [];
  const journeyStats =
    cmsJourneyStats.length > 0 ? cmsJourneyStats : DEFAULT_JOURNEY_STATS;

  const valuesTitle = about?.valuesTitle?.trim() || DEFAULT_VALUES_TITLE;
  const valuesList =
    about?.valuesList?.filter(
      (item) => item.title?.trim() || item.description?.trim(),
    ) ?? [];

  const studioHeading = about?.studioHeading?.trim() || DEFAULT_STUDIO_HEADING;
  const studioDescription =
    about?.studioDescription?.trim() || DEFAULT_STUDIO_DESCRIPTION;
  const studioImageUrls =
    about?.studioImageUrls?.filter((url): url is string =>
      Boolean(url?.trim()),
    ) ?? [];

  return (
    <>
      <section className="relative overflow-hidden bg-luxury-bg pb-16 pt-10 md:pb-24 lg:pt-16">
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
                title={heroTitle}
                highlight={heroHighlight}
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
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-peacock-blue/25 via-zinc-50 to-royal-magenta/20 p-8 text-center">
                  <span className="mb-2 font-serif text-3xl text-peacock-blue/80 md:text-4xl">
                    Peacock &amp; Packaging
                  </span>
                  <span className="max-w-xs text-sm text-luxury-muted">
                    Upload a hero image in About Page Content (Sanity Studio).
                  </span>
                </div>
              )}
              {!heroImageUrl ? (
                <Image
                  src="/logo.png"
                  alt=""
                  width={80}
                  height={80}
                  className="absolute bottom-6 right-6 h-16 w-auto opacity-20"
                  aria-hidden="true"
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <AboutJourney
        title={journeyTitle}
        timeline={journeyTimeline}
        journeyStats={journeyStats}
      />
      <AboutValues title={valuesTitle} valuesList={valuesList} />
      <FounderStory founder={founder} />
      <AboutStudio
        heading={studioHeading}
        description={studioDescription}
        imageUrls={studioImageUrls}
      />
      <PremiumCta />
    </>
  );
}
