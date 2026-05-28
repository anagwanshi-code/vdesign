import { AboutStudioSection } from "@/components/blocks/about-studio-section";
import { FeaturedCollectionsGrid } from "@/components/blocks/featured-collections-grid";
import { HeroBlock } from "@/components/blocks/hero-block";
import { ProductShowcase } from "@/components/blocks/product-showcase";
import { ServiceStoryGrid } from "@/components/blocks/service-story-grid";
import { SignaturePiecesGrid } from "@/components/blocks/signature-pieces-grid";
import { resolveHomePageContent } from "@/lib/data/home";

export default async function HomePage() {
  const {
    hero,
    services,
    featuredCollections,
    featuredProducts,
    aboutStudio,
    products,
    source,
  } = await resolveHomePageContent();

  return (
    <>
      <HeroBlock hero={hero} />
      <ServiceStoryGrid services={services} />
      <FeaturedCollectionsGrid collections={featuredCollections} />
      <SignaturePiecesGrid products={featuredProducts} />
      <AboutStudioSection content={aboutStudio} />
      <ProductShowcase products={products} dataSource={source} />
    </>
  );
}
