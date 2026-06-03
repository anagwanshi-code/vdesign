import { ProductDescriptionExpandable } from "@/components/product/product-description-expandable";
import type { ProductDetail } from "@/types/product";

type ProductDetailsHeaderProps = {
  product: ProductDetail;
  collectionLabel?: string;
};

export function ProductDetailsHeader({
  product,
  collectionLabel = "Signature Edit",
}: ProductDetailsHeaderProps) {
  return (
    <header className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-royal-magenta">
          {collectionLabel}
        </p>
        <h1 className="font-serif text-4xl font-medium leading-[1.08] tracking-tight text-gray-950 md:text-5xl lg:text-[3.25rem]">
          {product.title}
        </h1>
      </div>

      {product.subtitle ? (
        <p className="max-w-prose font-sans text-lg leading-relaxed text-gray-700">
          {product.subtitle}
        </p>
      ) : null}

      {product.description ? (
        <ProductDescriptionExpandable description={product.description} />
      ) : null}
    </header>
  );
}
