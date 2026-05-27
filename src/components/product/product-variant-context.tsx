"use client";

import { useProductVariantSelection } from "@/hooks/use-product-variant-selection";
import type { ProductDetail } from "@/types/product";
import type { ProductVariantSelectionState } from "@/hooks/use-product-variant-selection";
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

type ProductVariantContextValue = ProductVariantSelectionState & {
  product: ProductDetail;
  unitPriceInInr: number;
  compareAtPriceInInr?: number;
};

const ProductVariantContext = createContext<ProductVariantContextValue | null>(
  null,
);

type ProductVariantProviderProps = {
  product: ProductDetail;
  children: ReactNode;
};

export function ProductVariantProvider({
  product,
  children,
}: ProductVariantProviderProps) {
  const selection = useProductVariantSelection(product);

  const value = useMemo<ProductVariantContextValue>(
    () => ({
      ...selection,
      product,
      unitPriceInInr: selection.selected?.priceInInr ?? product.priceInInr,
      compareAtPriceInInr: selection.selected?.compareAtPriceInInr,
    }),
    [selection, product],
  );

  return (
    <ProductVariantContext.Provider value={value}>
      {children}
    </ProductVariantContext.Provider>
  );
}

export function useProductVariant(): ProductVariantContextValue {
  const context = useContext(ProductVariantContext);

  if (!context) {
    throw new Error(
      "useProductVariant must be used within ProductVariantProvider",
    );
  }

  return context;
}
