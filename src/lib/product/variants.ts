import type {
  ProductCatalogMode,
  ProductDetail,
  ProductDetailVariant,
  ProductOption,
  ProductPricingState,
  SelectedProductVariant,
} from "@/types/product";
import type {
  SanityProduct,
  SanityProductFrame,
  SanityProductSize,
  SanityProductVariant,
} from "@/types/sanity";

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function sizePresetKey(size: SanityProductSize): string {
  return size._id;
}

export function framePresetKey(frame: SanityProductFrame): string {
  return frame._id;
}

export function customLabelKey(label: string): string {
  return `label:${label.trim()}`;
}

export function getVariantSizeKey(variant: SanityProductVariant): string | null {
  if (variant.size?._id) {
    return sizePresetKey(variant.size);
  }

  if (variant.sizeLabel?.trim()) {
    return customLabelKey(variant.sizeLabel);
  }

  return null;
}

export function getVariantFrameKey(variant: SanityProductVariant): string | null {
  if (variant.frame?._id) {
    return framePresetKey(variant.frame);
  }

  if (variant.frameLabel?.trim()) {
    return customLabelKey(variant.frameLabel);
  }

  return null;
}

export function buildSizeOptions(product: SanityProduct): ProductOption[] {
  const options: ProductOption[] = [];
  const seen = new Set<string>();

  const presets = [...(product.availableSizes ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  for (const size of presets) {
    const key = sizePresetKey(size);

    if (seen.has(key)) continue;

    seen.add(key);
    options.push({
      key,
      label: size.dimensionsLabel || size.title,
    });
  }

  for (const label of product.sizeLabels ?? []) {
    const trimmed = label.trim();

    if (!trimmed) continue;

    const key = customLabelKey(trimmed);

    if (seen.has(key)) continue;

    seen.add(key);
    options.push({ key, label: trimmed });
  }

  for (const variant of product.variants ?? []) {
    const key = getVariantSizeKey(variant);

    if (!key || seen.has(key)) continue;

    seen.add(key);
    options.push({
      key,
      label:
        variant.size?.dimensionsLabel ??
        variant.size?.title ??
        variant.sizeLabel ??
        key,
    });
  }

  return options;
}

export function buildFrameOptions(product: SanityProduct): ProductOption[] {
  const options: ProductOption[] = [];
  const seen = new Set<string>();

  const presets = [...(product.availableFrames ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  for (const frame of presets) {
    const key = framePresetKey(frame);

    if (seen.has(key)) continue;

    seen.add(key);
    options.push({
      key,
      label: frame.title,
    });
  }

  for (const label of product.frameLabels ?? []) {
    const trimmed = label.trim();

    if (!trimmed) continue;

    const key = customLabelKey(trimmed);

    if (seen.has(key)) continue;

    seen.add(key);
    options.push({ key, label: trimmed });
  }

  for (const variant of product.variants ?? []) {
    const key = getVariantFrameKey(variant);

    if (!key || seen.has(key)) continue;

    seen.add(key);
    options.push({
      key,
      label: variant.frame?.title ?? variant.frameLabel ?? key,
    });
  }

  return options;
}

export function mapSanityVariantsToDetail(
  variants: SanityProductVariant[] | null | undefined,
): ProductDetailVariant[] {
  if (!variants?.length) {
    return [];
  }

  return variants.flatMap((variant) => {
    const sizeKey = getVariantSizeKey(variant);
    const frameKey = getVariantFrameKey(variant);

    if (!sizeKey || !frameKey || !Number.isFinite(variant.priceInInr)) {
      return [];
    }

    return [
      {
        key: variant._key,
        sizeKey,
        frameKey,
        priceInInr: variant.priceInInr,
        compareAtPriceInInr: variant.compareAtPriceInInr ?? undefined,
        sku: variant.sku ?? undefined,
        inStock: variant.inStock !== false,
      },
    ];
  });
}

export function findVariantBySelection(
  variants: ProductDetailVariant[],
  sizeKey: string,
  frameKey: string,
): ProductDetailVariant | undefined {
  return variants.find(
    (variant) => variant.sizeKey === sizeKey && variant.frameKey === frameKey,
  );
}

export function getLabelForOption(
  options: ProductOption[],
  key: string,
): string {
  return options.find((option) => option.key === key)?.label ?? key;
}

export function getInitialSelection(product: ProductDetail): {
  sizeKey: string;
  frameKey: string;
} {
  const firstSize = product.sizes[0]?.key;
  const firstFrame = product.frames[0]?.key;

  if (!firstSize || !firstFrame) {
    return { sizeKey: "", frameKey: "" };
  }

  const matchingVariant = findVariantBySelection(
    product.variants,
    firstSize,
    firstFrame,
  );

  if (matchingVariant) {
    return { sizeKey: firstSize, frameKey: firstFrame };
  }

  const variantForSize = product.variants.find(
    (variant) => variant.sizeKey === firstSize,
  );

  if (variantForSize) {
    return { sizeKey: firstSize, frameKey: variantForSize.frameKey };
  }

  const firstVariant = product.variants[0];

  if (firstVariant) {
    return { sizeKey: firstVariant.sizeKey, frameKey: firstVariant.frameKey };
  }

  return { sizeKey: firstSize, frameKey: firstFrame };
}

export function resolveFrameKeyForSize(
  product: ProductDetail,
  sizeKey: string,
  preferredFrameKey?: string,
): string {
  if (
    preferredFrameKey &&
    findVariantBySelection(product.variants, sizeKey, preferredFrameKey)
  ) {
    return preferredFrameKey;
  }

  const variant = product.variants.find((entry) => entry.sizeKey === sizeKey);

  return variant?.frameKey ?? product.frames[0]?.key ?? "";
}

export function buildSelectedVariant(
  product: ProductDetail,
  sizeKey: string,
  frameKey: string,
): SelectedProductVariant | null {
  const matched = findVariantBySelection(product.variants, sizeKey, frameKey);

  if (!matched) {
    if (product.variants.length > 0) {
      return null;
    }

    const normalized = normalizeSelectionKeys(product, sizeKey, frameKey);

    return {
      variantKey: `${normalized.sizeKey}__${normalized.frameKey}`,
      sizeKey: normalized.sizeKey,
      frameKey: normalized.frameKey,
      sizeLabel: getLabelForOption(product.sizes, normalized.sizeKey),
      frameLabel: getLabelForOption(product.frames, normalized.frameKey),
      priceInInr: product.priceInInr,
      priceLabel: formatInr(product.priceInInr),
      inStock: true,
    };
  }

  return {
    variantKey: matched.key,
    sizeKey,
    frameKey,
    sizeLabel: getLabelForOption(product.sizes, sizeKey),
    frameLabel: getLabelForOption(product.frames, frameKey),
    priceInInr: matched.priceInInr,
    priceLabel: formatInr(matched.priceInInr),
    compareAtPriceInInr: matched.compareAtPriceInInr,
    sku: matched.sku,
    inStock: matched.inStock,
  };
}

export function isFrameAvailableForSize(
  product: ProductDetail,
  sizeKey: string,
  frameKey: string,
): boolean {
  if (product.variants.length === 0) {
    return true;
  }

  return Boolean(findVariantBySelection(product.variants, sizeKey, frameKey));
}

export function getProductCatalogMode(product: ProductDetail): ProductCatalogMode {
  const hasSizeOptions = product.sizes.length > 0;
  const hasFrameOptions = product.frames.length > 0;

  if (!hasSizeOptions && !hasFrameOptions) {
    return "base-only";
  }

  if (product.variants.length === 0) {
    return "building";
  }

  const expectedCombinations =
    hasSizeOptions && hasFrameOptions
      ? product.sizes.length * product.frames.length
      : Math.max(product.sizes.length, product.frames.length, 1);

  if (product.variants.length < expectedCombinations) {
    return "building";
  }

  return "configurable";
}

export function normalizeSelectionKeys(
  product: ProductDetail,
  sizeKey: string,
  frameKey: string,
): { sizeKey: string; frameKey: string } {
  const normalizedSize =
    sizeKey || product.sizes[0]?.key || product.variants[0]?.sizeKey || "";
  const normalizedFrame =
    frameKey ||
    resolveFrameKeyForSize(product, normalizedSize) ||
    product.frames[0]?.key ||
    product.variants[0]?.frameKey ||
    "";

  return {
    sizeKey: normalizedSize,
    frameKey: normalizedFrame,
  };
}

/**
 * Pure pricing derivation from product data + selector state.
 * Safe to call inside useMemo — no React state updates.
 */
export function deriveProductPricing(
  product: ProductDetail,
  sizeKey: string,
  frameKey: string,
): ProductPricingState {
  const mode = getProductCatalogMode(product);
  const { sizeKey: resolvedSizeKey, frameKey: resolvedFrameKey } =
    normalizeSelectionKeys(product, sizeKey, frameKey);
  const selected = buildSelectedVariant(
    product,
    resolvedSizeKey,
    resolvedFrameKey,
  );
  const hasVariantMatrix = product.variants.length > 0;
  const isCombinationAvailable =
    !hasVariantMatrix ||
    isFrameAvailableForSize(product, resolvedSizeKey, resolvedFrameKey);

  let canPurchase = false;
  let statusMessage: string | undefined;

  if (mode === "base-only") {
    canPurchase = product.priceInInr > 0;
  } else if (mode === "building") {
    if (selected && isCombinationAvailable && selected.inStock) {
      canPurchase = true;
    } else if (!hasVariantMatrix && product.priceInInr > 0) {
      canPurchase = true;
      statusMessage =
        "Size and frame options are live—variant pricing is still being finalized in Studio.";
    } else {
      statusMessage =
        "Pricing for this combination is being finalized. Choose another size or frame, or check back soon.";
      canPurchase = false;
    }
  } else {
    canPurchase = Boolean(
      selected?.inStock && isCombinationAvailable && selected.priceInInr > 0,
    );

    if (!isCombinationAvailable) {
      statusMessage = "This size and frame combination is not available.";
    } else if (selected && !selected.inStock) {
      statusMessage = "Currently out of stock.";
    }
  }

  const baseLabel = formatInr(product.priceInInr);
  const displayPriceLabel =
    selected?.priceLabel ??
    (mode === "building" && hasVariantMatrix ? `From ${baseLabel}` : baseLabel);

  const compareAtLabel =
    selected?.compareAtPriceInInr !== undefined
      ? formatInr(selected.compareAtPriceInInr)
      : undefined;

  return {
    mode,
    selected,
    displayPriceLabel,
    compareAtLabel,
    isCombinationAvailable,
    canPurchase,
    statusMessage,
    showSizeSelector: product.sizes.length > 0,
    showFrameSelector: product.frames.length > 0,
  };
}
