import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections",
  description: "Discover luxury collections curated by V Design Luxury.",
};

export default function CollectionsPage() {
  return (
    <section className="mx-auto w-full max-w-content px-5 py-24 md:px-8 lg:px-20">
      <p className="text-overline uppercase text-saffron">Shop</p>
      <h1 className="mt-4 font-serif text-display-lg text-text-primary">
        Collections
      </h1>
      <p className="mt-6 max-w-prose text-body text-text-muted">
        Curated product catalog powered by Sanity CMS with native Razorpay UPI
        checkout—no third-party commerce lock-in.
      </p>
    </section>
  );
}
