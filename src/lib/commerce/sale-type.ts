export type ProductSaleType = "bulk" | "flexible";

export function normalizeSaleType(
  value: string | null | undefined,
): ProductSaleType {
  return value === "flexible" ? "flexible" : "bulk";
}
