"use client";

import type { PremiumAddonOption } from "@/types/product";
import { cn } from "@/lib/utils/cn";
import { formatInr } from "@/lib/product/variants";

type PremiumAddonSelectorProps = {
  addons: PremiumAddonOption[];
  selectedNames: string[];
  onToggle: (addonName: string) => void;
  className?: string;
};

export function PremiumAddonSelector({
  addons,
  selectedNames,
  onToggle,
  className,
}: PremiumAddonSelectorProps) {
  if (!addons.length) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
        Premium add-ons
      </p>

      <div className="flex flex-col gap-2">
        {addons.map((addon) => {
          const isSelected = selectedNames.includes(addon.addonName);

          return (
            <label
              key={addon.addonName}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-4 border px-4 py-3 transition-colors duration-300",
                isSelected
                  ? "border-pink-600 bg-white"
                  : "border-gray-200 bg-white hover:border-pink-500",
              )}
            >
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(addon.addonName)}
                  className="h-4 w-4 rounded-none border-gray-300 text-pink-700 focus:ring-pink-600/30"
                />
                <span className="font-sans text-sm font-medium text-gray-900">
                  {addon.addonName}
                </span>
              </span>
              <span className="shrink-0 font-sans text-sm font-semibold tabular-nums text-pink-700">
                +{formatInr(addon.extraPrice)}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
