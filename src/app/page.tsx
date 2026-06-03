import { CreativeProcess } from "@/components/blocks/creative-process";
import { FounderStory, type FounderData } from "@/components/blocks/founder-story";
import { InsightsSection, type InsightPost } from "@/components/blocks/insights-section";
import { PremiumCta } from "@/components/blocks/premium-cta";
import { HeroBlock } from "@/components/blocks/hero-block";
import { IndustrySolutions } from "@/components/blocks/industry-solutions";
import { PortfolioSection } from "@/components/blocks/portfolio-section";
import { ProductShowcase, type HomeFeaturedProduct } from "@/components/blocks/product-showcase";
import { ServicesSection } from "@/components/blocks/services-section";
import { TrustStrip } from "@/components/blocks/trust-strip";
import { WhyChooseUs } from "@/components/blocks/why-choose-us";
import { TestimonialSlider } from "@/components/home/testimonial-slider";
import { resolveHomePageContent } from "@/lib/data/home";
import { client } from "@/sanity/lib/client";
import {
  FOUNDER_QUERY,
  TESTIMONIALS_QUERY,
  HOME_FEATURED_PRODUCTS_QUERY,
  PORTFOLIO_QUERY,
  INDUSTRIES_QUERY,
  LATEST_POSTS_QUERY,
  SERVICES_QUERY,
} from "@/sanity/lib/queries";
import type { IndustryDocument } from "@/types/industry";
import type { PortfolioCardProject } from "@/types/portfolio";
import type { ServiceDocument } from "@/types/service";
import type { TestimonialDocument } from "@/types/testimonial";
export const revalidate = 30;

export default async function HomePage() {
  const [
    { hero, brandLogosTitle, brandLogoUrls, homeStats },
    featuredProducts,
    portfolioProjects,
    founder,
    latestPosts,
    services,
    industries,
    testimonials,
  ] = await Promise.all([
    resolveHomePageContent(),
    client.fetch<HomeFeaturedProduct[]>(HOME_FEATURED_PRODUCTS_QUERY),
    client.fetch<PortfolioCardProject[]>(PORTFOLIO_QUERY),
    client.fetch<FounderData | null>(FOUNDER_QUERY),
    client.fetch<InsightPost[]>(LATEST_POSTS_QUERY),
    client.fetch<ServiceDocument[]>(SERVICES_QUERY),
    client.fetch<IndustryDocument[]>(INDUSTRIES_QUERY),
    client.fetch<TestimonialDocument[]>(TESTIMONIALS_QUERY),
  ]);

  const homepageServices = (services ?? []).slice(0, 6);
  const homepageIndustries = (industries ?? []).slice(0, 8);

  return (
    <>
      <div className="flex w-full min-w-0 max-w-full flex-col overflow-hidden">
        <HeroBlock
          hero={{
            ...hero,
            ctaPrimary: {
              label: "Shop The Collection",
              href: "/shop",
            },
          }}
          homeStats={homeStats}
          compact
        />
        <TrustStrip
          brandLogosTitle={brandLogosTitle}
          brandLogoUrls={brandLogoUrls}
          compact
          className="shrink-0 border-t border-zinc-100"
        />
      </div>
      <TestimonialSlider testimonials={testimonials ?? []} />
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
