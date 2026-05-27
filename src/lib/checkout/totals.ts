export const DEFAULT_GST_RATE = 0.18;
export const DEFAULT_SHIPPING_INR = 150;
export const FREE_SHIPPING_THRESHOLD_INR = 5000;

export type OrderTotals = {
  subtotalInInr: number;
  gstRate: number;
  gstInInr: number;
  shippingInInr: number;
  grandTotalInInr: number;
};

export type OrderTotalsLabels = OrderTotals & {
  subtotalLabel: string;
  gstLabel: string;
  shippingLabel: string;
  grandTotalLabel: string;
};

function roundInr(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function calculateOrderTotals(
  subtotalInInr: number,
  options?: {
    gstRate?: number;
    shippingInInr?: number;
    freeShippingThresholdInInr?: number;
  },
): OrderTotals {
  const gstRate = options?.gstRate ?? DEFAULT_GST_RATE;
  const freeShippingThreshold =
    options?.freeShippingThresholdInInr ?? FREE_SHIPPING_THRESHOLD_INR;
  const configuredShipping = options?.shippingInInr ?? DEFAULT_SHIPPING_INR;

  const subtotal = roundInr(Math.max(0, subtotalInInr));
  const gstInInr = roundInr(subtotal * gstRate);
  const shippingInInr =
    subtotal >= freeShippingThreshold ? 0 : roundInr(configuredShipping);
  const grandTotalInInr = roundInr(subtotal + gstInInr + shippingInInr);

  return {
    subtotalInInr: subtotal,
    gstRate,
    gstInInr,
    shippingInInr,
    grandTotalInInr,
  };
}

export function labelOrderTotals(totals: OrderTotals): OrderTotalsLabels {
  return {
    ...totals,
    subtotalLabel: formatInr(totals.subtotalInInr),
    gstLabel: formatInr(totals.gstInInr),
    shippingLabel:
      totals.shippingInInr === 0 ? "Complimentary" : formatInr(totals.shippingInInr),
    grandTotalLabel: formatInr(totals.grandTotalInInr),
  };
}

export function formatOrderConfirmationSummary(totals: OrderTotalsLabels): string {
  const gstPercent = Math.round(totals.gstRate * 100);

  return [
    `Subtotal: ${totals.subtotalLabel}`,
    `GST (${gstPercent}%): ${totals.gstLabel}`,
    `Shipping: ${totals.shippingLabel}`,
    `Grand Total: ${totals.grandTotalLabel}`,
  ].join("\n");
}

export function orderTotalsToPaise(grandTotalInInr: number): number {
  return Math.round(grandTotalInInr * 100);
}
