"use client";

import { premiumCtaHoverClass } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Sparkles } from "lucide-react";
import Link from "next/link";

const NEXT_STEPS = [
  "Our team will review your order and confirm specifications within one business day.",
  "You will receive proofing details and production timelines by email or phone.",
  "Once approved, your order enters production and dispatch with tracking shared at shipment.",
] as const;

export function CheckoutSuccessContent() {
  return (
    <section className="relative overflow-hidden px-5 pb-12 pt-8 md:px-8 lg:px-20 lg:pb-16 lg:pt-12">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(233,30,99,0.08),transparent_55%),radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(0,136,169,0.06),transparent_50%)]"
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto w-full max-w-2xl text-center"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface shadow-lift"
        >
          <CheckCircle2
            className="h-8 w-8 text-peacock"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </motion.div>

        <p className="text-overline uppercase text-saffron">Order confirmed</p>
        <h1 className="mt-2 font-serif text-display-lg text-text-primary">
          Thank you for your order
        </h1>
        <p className="mx-auto mt-3 max-w-prose text-body leading-snug text-text-muted">
          Your payment was received securely. We are preparing your confirmation
          and our studio will be in touch shortly regarding proofing and
          dispatch.
        </p>

        <div className="mt-6 rounded-xl border border-border bg-surface/80 p-5 text-left shadow-sm backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2.5">
            <Package
              className="h-4 w-4 shrink-0 text-peacock"
              aria-hidden="true"
            />
            <h2 className="font-serif text-heading-md text-text-primary">
              What happens next
            </h2>
          </div>
          <ol className="space-y-3">
            {NEXT_STEPS.map((step, index) => (
              <li
                key={step}
                className="flex gap-3 text-body-sm leading-snug text-text-muted"
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border font-serif text-caption text-text-primary"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 text-caption text-text-muted">
          <Sparkles className="h-3.5 w-3.5 text-saffron" aria-hidden="true" />
          Questions? Reach us via Consultation or Contact anytime.
        </p>

        <Link
          href="/shop"
          className={`mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#E91E63] to-purple-600 px-9 py-3.5 font-sans text-body font-medium text-white shadow-lg ${premiumCtaHoverClass} hover:shadow-pink-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 focus-visible:ring-offset-surface`}
        >
          Continue Shopping
        </Link>
      </motion.div>
    </section>
  );
}
