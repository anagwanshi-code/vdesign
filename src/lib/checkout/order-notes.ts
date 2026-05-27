import type { CheckoutCartItem } from "@/types/checkout";

export function buildCheckoutOrderNotes(
  items: CheckoutCartItem[],
  totals: {
    subtotalInInr: number;
    gstInInr: number;
    shippingInInr: number;
    grandTotalInInr: number;
  },
): Record<string, string> {
  const logoEntries = items
    .map((item, index) => {
      const parts: string[] = [];

      if (item.logoFileName) {
        parts.push(`file:${item.logoFileName}`);
      }

      if (item.uploadInstructions?.trim()) {
        parts.push(`notes:${item.uploadInstructions.trim()}`);
      }

      if (parts.length === 0) {
        return null;
      }

      return `item${index + 1}:${parts.join("|")}`;
    })
    .filter((entry): entry is string => Boolean(entry));

  return {
    itemCount: String(items.length),
    products: items.map((item) => item.productId).join(","),
    skus: items
      .map((item) => item.sku)
      .filter((sku): sku is string => Boolean(sku))
      .join(","),
    saleTypes: items.map((item) => item.saleType ?? "bulk").join(","),
    subtotalInr: String(totals.subtotalInInr),
    gstInr: String(totals.gstInInr),
    shippingInr: String(totals.shippingInInr),
    grandTotalInr: String(totals.grandTotalInInr),
    ...(logoEntries.length > 0
      ? {
          logoAssets: logoEntries.join(";"),
          uploadInstructions: items
            .map((item) => item.uploadInstructions?.trim())
            .filter(Boolean)
            .join(" | "),
        }
      : {}),
  };
}
