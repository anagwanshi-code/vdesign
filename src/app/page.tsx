import { FeaturedCollectionsGrid } from "@/components/blocks/featured-collections-grid";
import { HeroBlock } from "@/components/blocks/hero-block";
import { ProductShowcase } from "@/components/blocks/product-showcase";
import { ServiceStoryGrid } from "@/components/blocks/service-story-grid";
import { resolveHomePageContent } from "@/lib/data/home";

export default async function HomePage() {
  const { hero, services, featuredCollections, products, source } =
    await resolveHomePageContent();

  return (
    <>
      <HeroBlock hero={hero} />
      <ServiceStoryGrid services={services} />
      <FeaturedCollectionsGrid collections={featuredCollections} />
      <ProductShowcase products={products} dataSource={source} />
    </>
  );
}
