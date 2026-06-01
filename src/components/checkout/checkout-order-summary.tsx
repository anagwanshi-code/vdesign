"use client";

import { calculateOrderTotals, labelOrderTotals } from "@/lib/checkout/totals";
import { formatInr } from "@/lib/product/variants";
import type { CartItem } from "@/types/cart";
import Image from "next/image";

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
  const totals = labelOrderTotals(calculateOrderTotals(subtotalInInr));

  return (
    <aside
      className={
        compact
          ? "rounded-lg border border-border bg-surface/80 p-4 shadow-sm lg:sticky lg:top-24"
          : "rounded-xl border border-border bg-surface/80 p-6 shadow-sm lg:sticky lg:top-28"
      }
    >
      <h2 className="font-serif text-heading text-text-primary">Order summary</h2>
      <p className="mt-0.5 text-caption text-text-muted">
        {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
      </p>

      <ul
        className={
          compact
            ? "mt-3 flex max-h-[min(28vh,200px)] flex-col gap-2 overflow-y-auto pr-0.5"
            : "mt-6 flex max-h-[min(40vh,320px)] flex-col gap-4 overflow-y-auto pr-1"
        }
      >
        {cartItems.map((item) => (
          <li
            key={item.id}
            className={
              compact
                ? "flex gap-2 border-b border-border pb-2 last:border-b-0 last:pb-0"
                : "flex gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0"
            }
          >
            <div
              className={
                compact
                  ? "relative h-12 w-10 shrink-0 overflow-hidden rounded border border-border bg-border"
                  : "relative h-16 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-border"
              }
            >
              {item.image ? (
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  className="object-cover"
                  sizes={compact ? "40px" : "56px"}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-text-muted">
                  VDL
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 font-serif text-caption text-text-primary">
                {item.title}
              </p>
              <p className="text-[11px] text-text-muted">Qty {item.quantity}</p>
              <p className="text-caption tabular-nums text-text-primary">
                {formatInr(item.priceInInr * item.quantity)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-3 space-y-1 border-t border-border pt-3 text-[11px] text-text-muted">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="tabular-nums text-text-primary">
            {totals.subtotalLabel}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>GST (18%)</span>
          <span className="tabular-nums text-text-primary">
            {totals.gstLabel}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span className="tabular-nums text-text-primary">
            {totals.shippingLabel}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-1.5 font-serif text-body-sm text-text-primary">
          <span>Total</span>
          <span className="tabular-nums">{totals.grandTotalLabel}</span>
        </div>
      </div>

      {moqMessage ? (
        <p className="mt-2 text-[11px] text-magenta">{moqMessage}</p>
      ) : null}

      <p className="mt-2 text-[11px] text-text-muted">
        Secure UPI · Cards · Netbanking
      </p>
    </aside>
  );
}
