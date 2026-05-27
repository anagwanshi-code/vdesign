"use client";

import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { ProductVariantProvider } from "@/components/product/product-variant-context";
import type { ProductDetail } from "@/types/product";

type ProductPurchaseSectionProps = {
  product: ProductDetail;
};

/** PDP client boundary: variant selection + dynamic pricing state. */
export function ProductPurchaseSection({ product }: ProductPurchaseSectionProps) {
  return (
    <ProductVariantProvider product={product}>
      <ProductPurchasePanel />
    </ProductVariantProvider>
  );
}
