import { CheckoutPageClient } from "@/components/checkout/checkout-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your V Design order with secure checkout—enter shipping details and pay via Razorpay.",
};

export default function CheckoutPage() {
  return (
    <section className="relative mx-auto w-full max-w-content px-5 pb-12 pt-8 md:px-8 lg:px-20 lg:pb-16 lg:pt-10">
      <CheckoutPageClient />
    </section>
  );
}
