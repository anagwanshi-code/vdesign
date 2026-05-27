import type { ProductSaleType } from "@/lib/commerce/sale-type";
import { normalizeSaleType } from "@/lib/commerce/sale-type";

export const DEFAULT_MINIMUM_ORDER_QUANTITY = 100;

export function normalizeMoq(value: number | null | undefined): number {
  if (!Number.isFinite(value) || !value || value < 1) {
    return DEFAULT_MINIMUM_ORDER_QUANTITY;
  }

  return Math.floor(value);
}

export function isBulkQuantityValid(
  quantity: number,
  minOrderQuantity: number = DEFAULT_MINIMUM_ORDER_QUANTITY,
): boolean {
  const moq = normalizeMoq(minOrderQuantity);

  return (
    Number.isFinite(quantity) &&
    quantity >= moq &&
    quantity % moq === 0
  );
}

export function isFlexibleQuantityValid(
  quantity: number,
  minOrderQuantity: number = DEFAULT_MINIMUM_ORDER_QUANTITY,
): boolean {
  const moq = normalizeMoq(minOrderQuantity);

  return Number.isFinite(quantity) && quantity >= moq;
}

export function isQuantityValidForSaleType(
  quantity: number,
  minOrderQuantity: number,
  saleType: ProductSaleType | string | null | undefined,
): boolean {
  const normalizedSaleType = normalizeSaleType(saleType);

  if (normalizedSaleType === "flexible") {
    return isFlexibleQuantityValid(quantity, minOrderQuantity);
  }

  return isBulkQuantityValid(quantity, minOrderQuantity);
}

/** @deprecated Use isBulkQuantityValid */
export function isMoqQuantityValid(
  quantity: number,
  moq: number = DEFAULT_MINIMUM_ORDER_QUANTITY,
): boolean {
  return isBulkQuantityValid(quantity, moq);
}

export function getMoqStepOptions(moq: number, steps = 5): number[] {
  const normalized = normalizeMoq(moq);

  return Array.from({ length: steps }, (_, index) => normalized * (index + 1));
}

export function getQuantityValidationMessage(
  minOrderQuantity: number,
  saleType: ProductSaleType | string | null | undefined,
): string {
  const moq = normalizeMoq(minOrderQuantity);
  const normalizedSaleType = normalizeSaleType(saleType);

  if (normalizedSaleType === "flexible") {
    return `Minimum order quantity is ${moq} units.`;
  }

  return `Minimum order quantity is ${moq} units. Quantity must be ordered in multiples of ${moq}.`;
}

/** @deprecated Use getQuantityValidationMessage */
export function getMoqValidationMessage(moq: number): string {
  return getQuantityValidationMessage(moq, "bulk");
}
