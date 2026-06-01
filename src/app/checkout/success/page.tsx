import { CheckoutSuccessContent } from "@/components/checkout/checkout-success-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description:
    "Thank you for your order with V Design. Our team will contact you regarding proofing and dispatch.",
};

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessContent />;
}
