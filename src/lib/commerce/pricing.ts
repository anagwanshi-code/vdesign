import type { ProductSaleType } from "@/lib/commerce/sale-type";
import { formatInr } from "@/lib/product/variants";
import { normalizeMoq } from "@/lib/commerce/moq";

export function formatUnitPriceLabel(priceInInr: number): string {
  return formatInr(priceInInr);
}

export function formatMoqHint(moq: number): string {
  return `MOQ ${normalizeMoq(moq)} units`;
}

export function formatQuantityHint(
  saleType: ProductSaleType,
  moq: number,
): string {
  const quantity = normalizeMoq(moq);

  if (saleType === "flexible") {
    return `Minimum ${quantity} units`;
  }

  return `MOQ ${quantity} units (multiples only)`;
}

export function formatProductPriceWithMoq(
  priceInInr: number,
  moq?: number | null,
): string {
  const unitPrice = formatUnitPriceLabel(priceInInr);

  if (!moq) {
    return unitPrice;
  }

  return `${unitPrice} · ${formatMoqHint(moq)}`;
}
