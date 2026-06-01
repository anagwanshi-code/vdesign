import type { CheckoutCustomerDetails } from "@/types/checkout-customer";

export type CheckoutVerifyOrderItem = {
  productName: string;
  quantity: number;
  price: number;
};

export type CheckoutVerifyOrderData = {
  customer: CheckoutCustomerDetails;
  items: CheckoutVerifyOrderItem[];
  totalAmount: number;
};

export type CheckoutVerifyRequestBody = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderData: CheckoutVerifyOrderData;
};

export type CheckoutVerifySuccessResponse = {
  orderId: string;
  sanityDocumentId: string;
};

export type CheckoutVerifyErrorResponse = {
  error: string;
};
