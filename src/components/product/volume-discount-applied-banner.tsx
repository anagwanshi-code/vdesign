"use client";

import { cn } from "@/lib/utils/cn";

type VolumeDiscountAppliedBannerProps = {
  discountPercent: number;
  quantity: number;
  className?: string;
};

export function VolumeDiscountAppliedBanner({
  discountPercent,
  quantity,
  className,
}: VolumeDiscountAppliedBannerProps) {
  if (discountPercent <= 0) {
    return null;
  }

  return (
    <p
      className={cn(
        "border-l-2 border-pink-600 pl-3 font-sans text-sm tracking-wide text-gray-700",
        className,
      )}
      role="status"
    >
      <span className="font-semibold text-pink-700">
        {discountPercent}% volume savings
      </span>{" "}
      applied to {quantity} units.
    </p>
  );
}
