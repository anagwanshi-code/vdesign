import { ProductLinkGrid } from "@/components/catalog/product-link-grid";
import type { ProductShowcaseItem } from "@/types/home";
import Link from "next/link";

type SimilarProductsProps = {
  products: ProductShowcaseItem[];
  collectionTitle?: string;
  collectionSlug?: string;
};

export function SimilarProducts({
  products,
  collectionTitle,
  collectionSlug,
}: SimilarProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="mt-24 border-t border-border pt-16"
      aria-labelledby="similar-products-heading"
    >
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-overline uppercase text-saffron">Explore More</p>
          <h2
            id="similar-products-heading"
            className="mt-3 font-serif text-heading text-text-primary"
          >
            Similar Products
          </h2>
          {collectionTitle ? (
            <p className="mt-2 text-body text-text-muted">
              From the {collectionTitle} collection
            </p>
          ) : null}
        </div>
        {collectionSlug ? (
          <Link
            href={`/collections/${collectionSlug}`}
            className="text-caption uppercase tracking-widest text-text-muted transition-colors duration-base ease-luxury hover:text-peacock"
          >
            View collection
          </Link>
        ) : null}
      </div>

      <ProductLinkGrid products={products} maxColumns={4} />
    </section>
  );
}
