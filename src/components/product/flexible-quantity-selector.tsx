"use client";

type FlexibleQuantitySelectorProps = {
  minOrderQuantity: number;
  quantity: number;
  onChange: (quantity: number) => void;
};

export function FlexibleQuantitySelector({
  minOrderQuantity,
  quantity,
  onChange,
}: FlexibleQuantitySelectorProps) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-overline uppercase text-text-muted">
        Quantity
      </legend>
      <div className="flex items-center gap-4">
        <label className="sr-only" htmlFor="flexible-quantity">
          Order quantity
        </label>
        <input
          id="flexible-quantity"
          type="number"
          min={minOrderQuantity}
          step={1}
          value={quantity}
          onChange={(event) => {
            const next = Number.parseInt(event.target.value, 10);

            if (Number.isFinite(next)) {
              onChange(next);
            }
          }}
          className="h-11 w-32 rounded-md border border-border bg-surface px-4 text-body tabular-nums text-text-primary focus:border-peacock focus:outline-none focus:ring-2 focus:ring-peacock/30"
        />
        <span className="text-caption text-text-muted">units</span>
      </div>
      <p className="text-caption text-text-muted">
        Flexible ordering — minimum {minOrderQuantity} units, any quantity above.
      </p>
    </fieldset>
  );
}
