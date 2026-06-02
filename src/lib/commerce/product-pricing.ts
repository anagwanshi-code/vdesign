import type { PremiumAddonOption, VolumeDiscountTier } from "@/types/product";

export function getApplicableVolumeDiscountPercent(
  quantity: number,
  tiers: VolumeDiscountTier[],
): number {
  if (!tiers.length || quantity < 1) {
    return 0;
  }

  const applicable = tiers
    .filter(
      (tier) =>
        Number.isFinite(tier.minQuantity) &&
        Number.isFinite(tier.discountPercentage) &&
        quantity >= tier.minQuantity,
    )
    .sort((a, b) => b.minQuantity - a.minQuantity);

  return applicable[0]?.discountPercentage ?? 0;
}

export type ProductLinePricing = {
  baseUnitPrice: number;
  discountPercent: number;
  discountedUnitPrice: number;
  addonUnitTotal: number;
  finalUnitPrice: number;
  lineTotal: number;
};

export function calculateProductLinePricing(
  baseUnitPrice: number,
  quantity: number,
  volumeDiscounts: VolumeDiscountTier[],
  selectedAddons: PremiumAddonOption[],
): ProductLinePricing {
  const discountPercent = getApplicableVolumeDiscountPercent(
    quantity,
    volumeDiscounts,
  );
  const discountedUnitPrice = baseUnitPrice * (1 - discountPercent / 100);
  const addonUnitTotal = selectedAddons.reduce(
    (sum, addon) => sum + addon.extraPrice,
    0,
  );
  const finalUnitPrice = discountedUnitPrice + addonUnitTotal;

  return {
    baseUnitPrice,
    discountPercent,
    discountedUnitPrice,
    addonUnitTotal,
    finalUnitPrice,
    lineTotal: finalUnitPrice * quantity,
  };
}

export function resolveProductMoq(
  moq: number | null | undefined,
  legacyMinOrderQuantity?: number | null,
): number {
  const candidate = moq ?? legacyMinOrderQuantity;

  if (candidate != null && Number.isFinite(candidate) && candidate >= 1) {
    return Math.floor(candidate);
  }

  return 1;
}
