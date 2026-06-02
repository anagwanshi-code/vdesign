import { ProductDetailsHeader } from "@/components/product/product-details-header";
import { ProductPurchaseSection } from "@/components/product/product-purchase-section";
import { ProductSpecifications } from "@/components/product/product-specifications";
import type { ProductDetail } from "@/types/product";

type ProductDetailsProps = {
  product: ProductDetail;
  collectionLabel?: string;
};

/**
 * Luxury PDP content column — editorial header, purchase panel, and specs.
 */
export function ProductDetails({
  product,
  collectionLabel,
}: ProductDetailsProps) {
  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <ProductDetailsHeader
        product={product}
        collectionLabel={collectionLabel ?? product.collection?.title}
      />
      <ProductPurchaseSection key={product.id} product={product} />
      <ProductSpecifications specifications={product.specifications} />
    </div>
  );
}

export { ProductDetailsHeader } from "@/components/product/product-details-header";
