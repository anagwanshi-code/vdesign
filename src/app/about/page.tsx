import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind V Design Luxury—packaging, commerce, and creative agency rooted in modern Indian artistic excellence.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-content px-5 pb-24 pt-28 md:px-8 lg:px-20 lg:pb-32 lg:pt-36">
      <p className="text-overline uppercase text-peacock">About</p>
      <h1 className="mt-4 font-serif text-display-lg text-text-primary">
        Refined by craft, rooted in India
      </h1>
      <p className="mt-6 max-w-prose text-body-lg text-text-muted">
        V Design Luxury unites packaging architecture, curated commerce, and
        cinematic agency work under one editorial standard—40% packaging, 25%
        ecommerce, 20% creative agency, 15% modern Indian artistic identity.
      </p>
    </section>
  );
}
