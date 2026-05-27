import type { ProductSaleType } from "@/lib/commerce/sale-type";
import type { OrderTotals } from "@/lib/checkout/totals";

export type CheckoutCartItem = {
  productId: string;
  title: string;
  quantity: number;
  priceInInr: number;
  sku?: string;
  saleType?: ProductSaleType;
  minOrderQuantity?: number;
  logoFileName?: string;
  uploadInstructions?: string;
};

export type CheckoutRequestBody = {
  items: CheckoutCartItem[];
};

export type CheckoutOrderResponse = {
  orderId: string;
  amount: number;
  currency: "INR";
  keyId: string;
  totals: OrderTotals;
};

export type CheckoutErrorResponse = {
  error: string;
};
