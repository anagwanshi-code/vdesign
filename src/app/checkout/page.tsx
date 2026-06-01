import { CheckoutForm } from "@/components/checkout/checkout-form";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your V Design order with secure checkout—enter shipping details and pay via Razorpay.",
};

export default function CheckoutPage() {
  return (
    <section className="mx-auto w-full max-w-content px-5 pb-24 pt-10 md:px-8 lg:px-20 lg:pb-32 lg:pt-16">
      <p className="text-overline uppercase text-saffron">Checkout</p>
      <h1 className="mt-4 font-serif text-display-lg text-text-primary">
        Complete your order
      </h1>
      <p className="mt-4 max-w-prose text-body-lg text-text-muted">
        Enter your details below. Payment is processed securely through Razorpay
        with your information prefilled.
      </p>

      <nav
        className="mt-4 text-caption text-text-muted"
        aria-label="Checkout breadcrumb"
      >
        <Link href="/shop" className="transition-colors hover:text-peacock">
          Shop
        </Link>
        <span className="mx-2 text-border" aria-hidden="true">
          /
        </span>
        <span className="text-text-primary">Checkout</span>
      </nav>

      <div className="mt-10">
        <CheckoutForm />
      </div>
    </section>
  );
}
