"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type PremiumCtaProps = {
  title?: string;
  description?: string;
  href?: string;
  buttonLabel?: string;
};

export function PremiumCta({
  title = "Ready to Build a Premium Brand?",
  description = "Let's create something extraordinary together.",
  href = "/consultation",
  buttonLabel = "Book a Free Consultation →",
}: PremiumCtaProps) {
  return (
    <section
      className="relative overflow-hidden border-t border-zinc-100 bg-white py-16 lg:py-20"
      aria-labelledby="premium-cta-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100 via-white to-white"
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
      >
        <h2
          id="premium-cta-heading"
          className="mb-4 font-serif text-4xl text-zinc-900 md:text-5xl"
        >
          {title}
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-zinc-600">
          {description}
        </p>
        <Link
          href={href}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#E91E63] to-purple-600 px-10 py-4 text-base font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/25"
        >
          {buttonLabel}
        </Link>
      </motion.div>
    </section>
  );
}
