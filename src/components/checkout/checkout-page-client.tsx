"use client";

import { CheckoutEmptyState } from "@/components/checkout/checkout-empty-state";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { useCartStore } from "@/lib/store/useCartStore";
import Link from "next/link";

export function CheckoutPageClient() {
  const items = useCartStore((state) => state.items);

  if (items.length === 0) {
    return <CheckoutEmptyState />;
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-royal-magenta">
            Checkout
          </p>
          <h1 className="mt-2 font-serif text-4xl font-medium text-gray-950">
            Complete your order
          </h1>
        </div>
        <nav
          className="font-sans text-sm text-gray-500"
          aria-label="Checkout breadcrumb"
        >
          <Link href="/shop" className="transition-colors hover:text-pink-700">
            Shop
          </Link>
          <span className="mx-2 text-gray-300" aria-hidden="true">
            /
          </span>
          <span className="font-medium text-gray-900">Checkout</span>
        </nav>
      </div>

      <div className="mt-8">
        <CheckoutForm />
      </div>
    </>
  );
}
