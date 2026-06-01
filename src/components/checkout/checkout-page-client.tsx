"use client";

import { CheckoutEmptyState } from "@/components/checkout/checkout-empty-state";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";

export function CheckoutPageClient() {
  const { cartItems } = useCart();

  if (cartItems.length === 0) {
    return <CheckoutEmptyState />;
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-overline uppercase text-saffron">Checkout</p>
          <h1 className="mt-1 font-serif text-display-lg text-text-primary">
            Complete your order
          </h1>
        </div>
        <nav
          className="text-caption text-text-muted"
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
      </div>

      <div className="mt-4">
        <CheckoutForm />
      </div>
    </>
  );
}
