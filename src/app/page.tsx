import { CreativeProcess } from "@/components/blocks/creative-process";
import { FounderStory } from "@/components/blocks/founder-story";
import { InsightsSection } from "@/components/blocks/insights-section";
import { PremiumCta } from "@/components/blocks/premium-cta";
import { HeroBlock } from "@/components/blocks/hero-block";
import { IndustrySolutions } from "@/components/blocks/industry-solutions";
import { PortfolioSection } from "@/components/blocks/portfolio-section";
import { ProductShowcase } from "@/components/blocks/product-showcase";
import { ServicesSection } from "@/components/blocks/services-section";
import { TrustStrip } from "@/components/blocks/trust-strip";
import { WhyChooseUs } from "@/components/blocks/why-choose-us";
import { resolveHomePageContent } from "@/lib/data/home";
import { client } from "@/sanity/lib/client";
import {
  FOUNDER_QUERY,
  HOME_FEATURED_PRODUCTS_QUERY,
  PORTFOLIO_QUERY,
  INDUSTRIES_QUERY,
  LATEST_POSTS_QUERY,
  SERVICES_QUERY,
} from "@/sanity/lib/queries";
import type { IndustryDocument } from "@/types/industry";
import type { PortfolioCardProject } from "@/types/portfolio";
import type { ServiceDocument } from "@/types/service";

export default async function HomePage() {
  const [
    { hero, brandLogosTitle, brandLogoUrls, homeStats },
    featuredProducts,
    portfolioProjects,
    founder,
    latestPosts,
    services,
    industries,
  ] = await Promise.all([
    resolveHomePageContent(),
    client.fetch(HOME_FEATURED_PRODUCTS_QUERY),
    client.fetch<PortfolioCardProject[]>(PORTFOLIO_QUERY),
    client.fetch(FOUNDER_QUERY),
    client.fetch(LATEST_POSTS_QUERY),
    client.fetch<ServiceDocument[]>(SERVICES_QUERY),
    client.fetch<IndustryDocument[]>(INDUSTRIES_QUERY),
  ]);

  const homepageServices = (services ?? []).slice(0, 6);
  const homepageIndustries = (industries ?? []).slice(0, 8);

  return (
    <>
      <div className="flex w-full flex-col">
        <HeroBlock hero={hero} compact />
        <TrustStrip
          brandLogosTitle={brandLogosTitle}
          brandLogoUrls={brandLogoUrls}
          homeStats={homeStats}
          compact
          className="shrink-0 border-t border-zinc-100"
        />
      </div>
      <ServicesSection services={homepageServices} />
      <ProductShowcase products={featuredProducts ?? []} />
      <PortfolioSection projects={portfolioProjects ?? []} />
      <WhyChooseUs />
      <IndustrySolutions industries={homepageIndustries} />
      <CreativeProcess />
      <FounderStory founder={founder} />
      <InsightsSection posts={latestPosts ?? []} />
      <PremiumCta
        title="Ready to Start Your Project?"
        description="Tell us about your brand, packaging, or print goals—we'll respond with clarity, craft, and a plan tailored to you."
        href="/contact"
        buttonLabel="Get in Touch →"
      />
    </>
  );
}
