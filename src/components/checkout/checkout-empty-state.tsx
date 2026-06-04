"use client";

import { premiumCtaHoverClass } from "@/lib/utils/cn";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export function CheckoutEmptyState() {
  return (
    <div className="relative flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center px-6 py-16 text-center">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(233,30,99,0.06),transparent_60%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex max-w-md flex-col items-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-border bg-surface shadow-lift">
          <ShoppingBag
            className="h-9 w-9 text-text-muted"
            strokeWidth={1.25}
            aria-hidden="true"
          />
        </div>

        <p className="text-overline uppercase text-saffron">Checkout</p>
        <h1 className="mt-3 font-serif text-display-lg text-text-primary">
          Your bag is empty
        </h1>
        <p className="mt-4 text-body leading-relaxed text-text-muted">
          Add pieces from the shop before checkout. Your selections will appear
          here when you are ready to pay securely.
        </p>

        <Link
          href="/shop"
          className={`mt-8 inline-flex items-center justify-center rounded-full bg-pink-600 bg-gradient-to-r from-[#E91E63] to-purple-600 px-10 py-3.5 font-sans text-body font-medium text-white shadow-lg ${premiumCtaHoverClass} hover:shadow-pink-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2`}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
