"use client";

import { cn } from "@/lib/utils/cn";
import type { ProductOption } from "@/types/product";

type VariantOptionGroupProps = {
  label: string;
  name: string;
  options: ProductOption[];
  value: string;
  onChange: (key: string) => void;
  isOptionDisabled?: (key: string) => boolean;
  /** Editorial pills: foreground fill when selected (PDP size selector). */
  appearance?: "default" | "editorial";
};

export function VariantOptionGroup({
  label,
  name,
  options,
  value,
  onChange,
  isOptionDisabled,
  appearance = "default",
}: VariantOptionGroupProps) {
  if (options.length === 0) {
    return null;
  }

  return (
    <fieldset className="flex flex-col gap-3">
      <legend
        className={cn(
          "uppercase tracking-widest",
          appearance === "editorial"
            ? "font-sans text-xs text-muted"
            : "text-overline text-text-muted",
        )}
      >
        {appearance === "editorial" && label === "Size"
          ? "Select Size"
          : label}
      </legend>
      <div
        className={cn(
          "flex flex-wrap",
          appearance === "editorial" ? "gap-3" : "gap-2",
        )}
        role="radiogroup"
        aria-label={label}
      >
        {options.map((option) => {
          const isSelected = value === option.key;
          const isDisabled = isOptionDisabled?.(option.key) ?? false;

          return (
            <label
              key={option.key}
              className={cn(
                "inline-flex cursor-pointer items-center justify-center border font-sans transition-all duration-300",
                appearance === "editorial"
                  ? cn(
                      "min-h-0 px-6 py-3 text-sm",
                      isSelected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border/80 bg-transparent text-foreground hover:border-foreground/50",
                    )
                  : cn(
                      "min-h-11 rounded-md px-4 text-caption duration-base ease-luxury",
                      isSelected
                        ? "border-peacock bg-peacock/5 text-peacock"
                        : "border-border text-text-primary hover:border-peacock/60",
                    ),
                isDisabled &&
                  "cursor-not-allowed opacity-40 hover:border-border",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.key}
                checked={isSelected}
                disabled={isDisabled}
                className="sr-only"
                onChange={() => {
                  if (!isDisabled) {
                    onChange(option.key);
                  }
                }}
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
