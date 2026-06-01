import PortfolioGrid from "@/components/blocks/portfolio-grid";
import { SplitPageHero } from "@/components/blocks/split-page-hero";
import { client } from "@/sanity/lib/client";
import { ALL_PORTFOLIO_QUERY, PORTFOLIO_PAGE_QUERY } from "@/sanity/lib/queries";
import type { PageHeroContent } from "@/types/page-hero";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore V Design selected works in luxury packaging, premium printing, and brand identity.",
};

const DEFAULT_TITLE = "Selected Works & Masterpieces";
const DEFAULT_DESCRIPTION =
  "Explore our latest projects in luxury packaging, premium printing, and brand identity.";

function renderPortfolioTitle(title: string) {
  if (title.includes("&")) {
    const [before, ...rest] = title.split("&");
    const highlight = rest.join("&").trim() || "Masterpieces";
    return (
      <>
        {before?.trim()} &amp;
        <br />
        <span className="font-dancing bg-gradient-to-r from-royal-magenta to-orange-500 bg-clip-text text-transparent">
          {highlight}
        </span>
      </>
    );
  }
  return title;
}

export default async function PortfolioPage() {
  const [projects, pageContent] = await Promise.all([
    client.fetch(ALL_PORTFOLIO_QUERY),
    client
      .withConfig({ useCdn: false })
      .fetch<PageHeroContent | null>(PORTFOLIO_PAGE_QUERY),
  ]);

  const title = pageContent?.title?.trim() || DEFAULT_TITLE;
  const description =
    pageContent?.shortDescription?.trim() || DEFAULT_DESCRIPTION;
  const heroImageUrl = pageContent?.heroImageUrl?.trim() || null;

  return (
    <div className="bg-luxury-bg pt-10 lg:pt-16">
      <SplitPageHero
        eyebrow="OUR PORTFOLIO"
        title={renderPortfolioTitle(title)}
        description={description}
        heroImageUrl={heroImageUrl}
        actions={
          <>
            <Link
              href="#portfolio-grid"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 text-sm font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              View All Projects
            </Link>
            <Link
              href="/consultation"
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-8 py-3 text-sm font-medium text-luxury-text transition-colors hover:border-royal-magenta hover:text-royal-magenta"
            >
              Start Your Project
            </Link>
          </>
        }
      />

      <div id="portfolio-grid" className="scroll-mt-32">
        <PortfolioGrid projects={projects ?? []} />
      </div>
    </div>
  );
}
