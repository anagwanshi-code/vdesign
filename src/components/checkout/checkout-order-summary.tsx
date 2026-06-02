"use client";

import type { CartItem } from "@/types/cart";
import { labelOrderTotals } from "@/lib/checkout/totals";
import { selectOrderTotals, useCartStore } from "@/lib/store/useCartStore";
import { formatInr } from "@/lib/product/variants";
import Image from "next/image";
import { useMemo } from "react";

type CheckoutOrderSummaryProps = {
  cartItems: CartItem[];
  subtotalInInr: number;
  moqMessage: string | null;
  compact?: boolean;
};

export function CheckoutOrderSummary({
  cartItems,
  subtotalInInr,
  moqMessage,
  compact = false,
}: CheckoutOrderSummaryProps) {
  const shippingConfig = useCartStore((state) => state.shippingConfig);
  const totals = useMemo(
    () => labelOrderTotals(selectOrderTotals(cartItems, shippingConfig)),
    [cartItems, shippingConfig],
  );

  return (
    <aside
      className={
        compact
          ? "border border-gray-200 bg-white p-5 lg:sticky lg:top-24"
          : "rounded-xl border border-gray-200 bg-white p-6 lg:sticky lg:top-28"
      }
    >
      <h2 className="font-serif text-xl font-medium text-gray-950">
        Order Summary
      </h2>
      <p className="mt-1 font-sans text-xs uppercase tracking-widest text-gray-500">
        {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
      </p>

      <ul
        className={
          compact
            ? "mt-4 flex max-h-[min(32vh,240px)] flex-col gap-3 overflow-y-auto pr-0.5"
            : "mt-6 flex max-h-[min(40vh,320px)] flex-col gap-4 overflow-y-auto pr-1"
        }
      >
        {cartItems.map((item) => (
          <li
            key={item.id}
            className="flex gap-3 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
          >
            <div className="relative h-14 w-12 shrink-0 overflow-hidden border border-gray-200 bg-gray-50">
              {item.image ? (
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                  VDL
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 font-serif text-sm text-gray-950">
                {item.title}
              </p>
              {item.subtitle ? (
                <p className="line-clamp-1 font-sans text-[11px] text-gray-500">
                  {item.subtitle}
                </p>
              ) : null}
              {item.premiumAddons?.length ? (
                <ul className="mt-1 space-y-0.5">
                  {item.premiumAddons.map((addon) => (
                    <li
                      key={addon.addonName}
                      className="font-sans text-[11px] text-pink-700"
                    >
                      + {addon.addonName}
                    </li>
                  ))}
                </ul>
              ) : null}
              {item.volumeDiscountPercent ? (
                <p className="mt-1 font-sans text-[10px] uppercase tracking-wider text-gray-500">
                  {item.volumeDiscountPercent}% volume savings
                </p>
              ) : null}
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <p className="font-sans text-xs text-gray-500">
                  Qty {item.quantity}
                </p>
                <p className="font-sans text-sm font-semibold tabular-nums text-gray-950">
                  {formatInr(item.priceInInr * item.quantity)}
                </p>
              </div>
              <p className="font-sans text-[11px] text-gray-400">
                {item.priceLabel} / unit
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 font-sans text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="tabular-nums text-gray-900">
            {totals.subtotalLabel}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>GST (18%)</span>
          <span className="tabular-nums text-gray-900">{totals.gstLabel}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span className="tabular-nums text-gray-900">
            {totals.shippingLabel}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-3 font-serif text-lg font-medium text-gray-950">
          <span>Total</span>
          <span className="tabular-nums">{totals.grandTotalLabel}</span>
        </div>
      </div>

      {moqMessage ? (
        <p className="mt-3 font-sans text-xs text-pink-700">{moqMessage}</p>
      ) : null}

      <p className="mt-3 font-sans text-[11px] text-gray-500">
        Prices include selected add-ons and volume discounts.
      </p>
    </aside>
  );
}
