import { PremiumCta } from "@/components/blocks/premium-cta";
import { ResourcesArticles } from "@/components/blocks/resources-articles";
import { ResourcesCategories } from "@/components/blocks/resources-categories";
import { ResourcesDownloads } from "@/components/blocks/resources-downloads";
import { ResourcesSearch } from "@/components/blocks/resources-search";
import { client } from "@/sanity/lib/client";
import {
  DOWNLOADS_QUERY,
  RESOURCES_PAGE_QUERY,
  RESOURCES_POSTS_QUERY,
} from "@/sanity/lib/queries";
import type {
  DownloadResource,
  ResourcePost,
  ResourcesPageContent,
} from "@/types/resources";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "V Design resources hub—articles, packaging guides, branding tips, and downloadable checklists for premium print and design.",
};

const DEFAULT_HERO_TITLE = "Knowledge That Inspires.";
const DEFAULT_HERO_HIGHLIGHT = "Creativity";
const DEFAULT_HERO_SUFFIX = " That Delivers.";
const DEFAULT_HERO_DESCRIPTION =
  "Explore guides, inspiration, and expert insights on branding, packaging, and premium print—curated for growing brands.";

export default async function ResourcesPage() {
  const [pageContent, posts, downloads] = await Promise.all([
    client.fetch<ResourcesPageContent | null>(RESOURCES_PAGE_QUERY),
    client.fetch<ResourcePost[]>(RESOURCES_POSTS_QUERY),
    client.fetch<DownloadResource[]>(DOWNLOADS_QUERY),
  ]);

  const heroTitle = pageContent?.heroTitle?.trim() || DEFAULT_HERO_TITLE;
  const heroHighlight =
    pageContent?.heroHighlight?.trim() || DEFAULT_HERO_HIGHLIGHT;
  const heroSuffix = pageContent?.heroSuffix?.trim() || DEFAULT_HERO_SUFFIX;
  const heroDescription =
    pageContent?.heroDescription?.trim() || DEFAULT_HERO_DESCRIPTION;
  const heroImageUrl = pageContent?.heroImageUrl?.trim();

  return (
    <div className="bg-white pt-32">
      <section className="relative overflow-hidden bg-luxury-bg pb-16 md:pb-20">
        <div
          className="pointer-events-none absolute -right-16 top-12 h-80 w-80 rounded-full bg-royal-magenta/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-0 top-1/3 h-64 w-64 rounded-full bg-saffron-gold/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
              RESOURCES HUB
            </p>
            <h1 className="mb-6 font-serif text-5xl leading-tight text-luxury-text md:text-7xl">
              {heroTitle}{" "}
              <br />
              <span className="bg-gradient-to-r from-royal-magenta to-orange-500 bg-clip-text text-transparent">
                {heroHighlight}
              </span>
              {heroSuffix}
            </h1>
            <p className="mb-8 max-w-xl text-lg text-luxury-muted">
              {heroDescription}
            </p>
            <ResourcesSearch />
          </div>

          <div className="relative">
            <div
              className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-royal-magenta/15 via-transparent to-peacock-blue/20 blur-2xl"
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
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-royal-magenta/20 via-zinc-50 to-orange-100/80 p-8 text-center">
                  <span className="mb-2 font-serif text-3xl text-luxury-text/35 md:text-4xl">
                    Branding Composition
                  </span>
                  <span className="max-w-xs text-sm text-luxury-muted">
                    Hero visual placeholder — resources &amp; insights
                  </span>
                </div>
              )}
              <Image
                src="/logo.png"
                alt=""
                width={64}
                height={64}
                className="absolute bottom-6 right-6 h-14 w-auto opacity-20"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      <ResourcesCategories />

      <div className="flex flex-col gap-20 lg:gap-24">
        <ResourcesArticles posts={posts} />
        <ResourcesDownloads downloads={downloads} />
      </div>

      <PremiumCta />
    </div>
  );
}
