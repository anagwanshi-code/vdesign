import { HeroBlock } from "@/components/blocks/hero-block";
import { ProductShowcase } from "@/components/blocks/product-showcase";
import { ServiceStoryGrid } from "@/components/blocks/service-story-grid";
import { resolveHomePageContent } from "@/lib/data/home";

export default async function HomePage() {
  const { hero, services, products, source } = await resolveHomePageContent();

  return (
    <>
      <HeroBlock hero={hero} />
      <ServiceStoryGrid services={services} />
      <ProductShowcase products={products} dataSource={source} />
    </>
  );
}
