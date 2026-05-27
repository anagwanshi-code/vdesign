import { ProductLinkGrid } from "@/components/catalog/product-link-grid";
import type { ProductShowcaseItem } from "@/types/home";

type ProductShowcaseProps = {
  products: ProductShowcaseItem[];
  dataSource?: "sanity" | "mock";
};

export function ProductShowcase({ products }: ProductShowcaseProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="bg-background px-6 py-32 md:px-12 lg:px-24">
      <div className="mx-auto mb-16 max-w-7xl text-center">
        <h3 className="mb-4 font-serif text-4xl text-foreground md:text-6xl">
          Curated Collection
        </h3>
        <p className="font-sans text-muted">
          Handcrafted luxury available for purchase.
        </p>
      </div>

      <div className="mx-auto max-w-[1440px]">
        <ProductLinkGrid products={products} maxColumns={4} />
      </div>
    </section>
  );
}
