"use client";

import {
  deriveProductPricing,
  getInitialSelection,
  normalizeSelectionKeys,
  resolveFrameKeyForSize,
} from "@/lib/product/variants";
import type { ProductDetail, ProductPricingState } from "@/types/product";
import { useCallback, useMemo, useState } from "react";

export type ProductVariantSelectionState = ProductPricingState & {
  sizeKey: string;
  frameKey: string;
  selectSize: (sizeKey: string) => void;
  selectFrame: (frameKey: string) => void;
};

export function useProductVariantSelection(
  product: ProductDetail,
): ProductVariantSelectionState {
  const initialSelection = useMemo(
    () => getInitialSelection(product),
    [product],
  );

  const [sizeKey, setSizeKey] = useState(initialSelection.sizeKey);
  const [frameKey, setFrameKey] = useState(initialSelection.frameKey);

  const normalized = useMemo(
    () => normalizeSelectionKeys(product, sizeKey, frameKey),
    [product, sizeKey, frameKey],
  );

  const pricing = useMemo(
    () =>
      deriveProductPricing(
        product,
        normalized.sizeKey,
        normalized.frameKey,
      ),
    [product, normalized.sizeKey, normalized.frameKey],
  );

  const selectSize = useCallback(
    (nextSizeKey: string) => {
      setSizeKey(nextSizeKey);
      setFrameKey((currentFrameKey) =>
        resolveFrameKeyForSize(product, nextSizeKey, currentFrameKey),
      );
    },
    [product],
  );

  const selectFrame = useCallback((nextFrameKey: string) => {
    setFrameKey(nextFrameKey);
  }, []);

  return {
    ...pricing,
    sizeKey: normalized.sizeKey,
    frameKey: normalized.frameKey,
    selectSize,
    selectFrame,
  };
}
