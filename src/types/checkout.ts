export type CheckoutCartItem = {
  productId: string;
  title: string;
  quantity: number;
  priceInInr: number;
};

export type CheckoutRequestBody = {
  items: CheckoutCartItem[];
};

export type CheckoutOrderResponse = {
  orderId: string;
  amount: number;
  currency: "INR";
  keyId: string;
};

export type CheckoutErrorResponse = {
  error: string;
};
