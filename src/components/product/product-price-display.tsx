"use client";

import type { ProductCatalogMode } from "@/types/product";
import { AnimatePresence, motion } from "framer-motion";

const LUXURY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type ProductPriceDisplayProps = {
  price: number;
  compareAtPrice?: number;
  catalogMode?: ProductCatalogMode;
  statusMessage?: string;
  sku?: string;
};

const catalogModeCopy: Record<ProductCatalogMode, string | undefined> = {
  "base-only": undefined,
  building:
    "Variant matrix in progress—available combinations update as Studio pricing is published.",
  configurable: undefined,
};

export function ProductPriceDisplay({
  price,
  compareAtPrice,
  catalogMode = "base-only",
  statusMessage,
  sku,
}: ProductPriceDisplayProps) {
  const modeNotice = catalogModeCopy[catalogMode];
  const showCompareAt =
    typeof compareAtPrice === "number" &&
    compareAtPrice > price &&
    compareAtPrice > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
        <AnimatePresence mode="popLayout">
          <motion.p
            key={price}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: LUXURY_EASE }}
            className="font-serif text-4xl font-medium tabular-nums tracking-tight text-gray-950 md:text-[2.75rem]"
          >
            ₹{price.toLocaleString("en-IN")}
          </motion.p>
        </AnimatePresence>

        {showCompareAt ? (
          <span className="mb-1 font-sans text-xl tabular-nums text-gray-400 line-through">
            ₹{compareAtPrice.toLocaleString("en-IN")}
          </span>
        ) : null}
      </div>

      {modeNotice ? (
        <p className="font-sans text-sm text-gray-600">{modeNotice}</p>
      ) : null}
      {statusMessage ? (
        <p className="font-sans text-sm font-medium text-royal-magenta">
          {statusMessage}
        </p>
      ) : null}
      {sku ? (
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
          SKU · {sku}
        </p>
      ) : null}
    </div>
  );
}
