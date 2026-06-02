"use client";

import type { ProductSaleType } from "@/lib/commerce/sale-type";
import type { VolumeDiscountTier } from "@/types/product";
import { cn } from "@/lib/utils/cn";

type VolumeDiscountHighlightsProps = {
  tiers: VolumeDiscountTier[];
  activeQuantity: number;
  moq: number;
  saleType: ProductSaleType;
  onSelectQuantity: (quantity: number) => void;
  className?: string;
};

function resolveTierQuantity(
  minQuantity: number,
  moq: number,
  saleType: ProductSaleType,
): number {
  if (saleType === "bulk") {
    const step = moq;
    return Math.max(moq, Math.ceil(minQuantity / step) * step);
  }

  return Math.max(moq, minQuantity);
}

export function VolumeDiscountHighlights({
  tiers,
  activeQuantity,
  moq,
  saleType,
  onSelectQuantity,
  className,
}: VolumeDiscountHighlightsProps) {
  if (!tiers.length) {
    return null;
  }

  const activeTier = [...tiers]
    .filter((tier) => activeQuantity >= tier.minQuantity)
    .sort((a, b) => b.minQuantity - a.minQuantity)[0];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
        Volume savings
      </p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiers.map((tier) => {
          const isActive = activeTier?.minQuantity === tier.minQuantity;
          const tierQuantity = resolveTierQuantity(
            tier.minQuantity,
            moq,
            saleType,
          );

          return (
            <button
              key={`${tier.minQuantity}-${tier.discountPercentage}`}
              type="button"
              onClick={() => onSelectQuantity(tierQuantity)}
              className={cn(
                "cursor-pointer border border-gray-200 bg-white p-3 text-center transition-all duration-300",
                "hover:border-pink-500 hover:shadow-[0_4px_16px_rgba(219,39,119,0.12)]",
                isActive && "border-pink-600 shadow-[0_4px_16px_rgba(219,39,119,0.14)]",
              )}
              aria-pressed={isActive}
              aria-label={`Buy ${tier.minQuantity} or more and save ${tier.discountPercentage} percent`}
            >
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-pink-700">
                Buy {tier.minQuantity}+
              </p>
              <p className="mt-1 font-serif text-lg font-medium text-pink-700">
                Save {tier.discountPercentage}%
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
