import { IndustriesGrid } from "@/components/blocks/industries-grid";
import { PremiumCta } from "@/components/blocks/premium-cta";
import { SplitPageHero } from "@/components/blocks/split-page-hero";
import { WhyChooseUs } from "@/components/blocks/why-choose-us";
import { client } from "@/sanity/lib/client";
import { INDUSTRIES_PAGE_QUERY, INDUSTRIES_QUERY } from "@/sanity/lib/queries";
import type { IndustryDocument } from "@/types/industry";
import type { PageHeroContent } from "@/types/page-hero";
import { Download } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Industry-specific branding and packaging by V Design—pharma, jewelry, wedding, fashion, corporate, and more.",
};

const DEFAULT_TITLE = "Creative Solutions for Every Industry.";
const DEFAULT_DESCRIPTION =
  "We understand that every industry is unique. That's why we create customized branding, packaging, and print solutions tailored to your sector's standards and ambitions.";

function renderIndustriesTitle(title: string) {
  const match = title.match(/^(.+?)\s+(Industry\.?)$/i);
  if (match) {
    return (
      <>
        {match[1]}
        <br />
        <span className="font-dancing bg-gradient-to-r from-saffron-gold to-orange-500 bg-clip-text text-transparent">
          {match[2]}
        </span>
      </>
    );
  }
  return title;
}

export default async function IndustriesPage() {
  const [industries, pageContent] = await Promise.all([
    client.fetch<IndustryDocument[]>(INDUSTRIES_QUERY),
    client
      .withConfig({ useCdn: false })
      .fetch<PageHeroContent | null>(INDUSTRIES_PAGE_QUERY),
  ]);

  const title = pageContent?.title?.trim() || DEFAULT_TITLE;
  const description =
    pageContent?.shortDescription?.trim() || DEFAULT_DESCRIPTION;
  const heroImageUrl = pageContent?.heroImageUrl?.trim() || null;

  return (
    <div className="bg-white pt-10 lg:pt-16">
      <SplitPageHero
        eyebrow="INDUSTRIES WE SERVE"
        title={renderIndustriesTitle(title)}
        description={description}
        heroImageUrl={heroImageUrl}
        actions={
          <>
            <Link
              href="/consultation"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 text-sm font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Let&apos;s Work Together
            </Link>
            <Link
              href="/consultation"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-8 py-3 text-sm font-medium text-luxury-text transition-colors hover:border-royal-magenta hover:text-royal-magenta"
            >
              <Download className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              Download Brochure
            </Link>
          </>
        }
      />

      <IndustriesGrid industries={industries} />
      <WhyChooseUs variant="industries" />
      <PremiumCta
        title="Every Industry Has a Story."
        description="Let's craft packaging and branding that speaks yours—with precision, passion, and premium craft."
      />
    </div>
  );
}
