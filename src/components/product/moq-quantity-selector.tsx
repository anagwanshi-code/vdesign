"use client";

import { cn } from "@/lib/utils/cn";
import { getMoqStepOptions } from "@/lib/commerce/moq";

type MoqQuantitySelectorProps = {
  moq: number;
  quantity: number;
  onChange: (quantity: number) => void;
};

export function MoqQuantitySelector({
  moq,
  quantity,
  onChange,
}: MoqQuantitySelectorProps) {
  const options = getMoqStepOptions(moq, 6);

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-overline uppercase text-text-muted">
        Quantity
      </legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Quantity">
        {options.map((option) => {
          const isSelected = quantity === option;

          return (
            <label
              key={option}
              className={cn(
                "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md border px-4 text-caption tabular-nums transition-colors duration-base ease-luxury",
                isSelected
                  ? "border-peacock bg-peacock/5 text-peacock"
                  : "border-border text-text-primary hover:border-peacock/60",
              )}
            >
              <input
                type="radio"
                name="moq-quantity"
                value={option}
                checked={isSelected}
                className="sr-only"
                onChange={() => onChange(option)}
              />
              {option}
            </label>
          );
        })}
      </div>
      <p className="text-caption text-text-muted">
        Sold in multiples of {moq} units.
      </p>
    </fieldset>
  );
}
