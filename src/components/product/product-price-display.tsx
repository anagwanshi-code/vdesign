"use client";

import type { ProductCatalogMode } from "@/types/product";
import { AnimatePresence, motion } from "framer-motion";

const LUXURY_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

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
    <div className="mb-8 flex flex-col gap-2">
      <div className="flex items-end gap-4">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={price}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: LUXURY_EASE }}
            className="font-sans text-2xl font-light tabular-nums text-foreground md:text-3xl"
          >
            ₹{price.toLocaleString("en-IN")}
          </motion.div>
        </AnimatePresence>

        {showCompareAt ? (
          <span className="mb-1 font-sans text-lg text-muted line-through tabular-nums">
            ₹{compareAtPrice.toLocaleString("en-IN")}
          </span>
        ) : null}
      </div>

      {modeNotice ? (
        <p className="font-sans text-xs text-muted">{modeNotice}</p>
      ) : null}
      {statusMessage ? (
        <p className="font-sans text-xs text-magenta">{statusMessage}</p>
      ) : null}
      {sku ? (
        <p className="font-sans text-xs uppercase tracking-widest text-muted">
          SKU {sku}
        </p>
      ) : null}
    </div>
  );
}
