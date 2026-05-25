import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "The V Design Luxury studio—where packaging systems, brand films, and luxury commerce experiences are composed.",
};

export default function AtelierPage() {
  return (
    <section className="mx-auto w-full max-w-content px-5 pb-24 pt-28 md:px-8 lg:px-20 lg:pb-32 lg:pt-36">
      <p className="text-overline uppercase text-saffron">Studio</p>
      <h1 className="mt-4 font-serif text-display-lg text-text-primary">
        The atelier
      </h1>
      <p className="mt-6 max-w-prose text-body-lg text-text-muted">
        Our studio practice spans rigid box engineering, Sanity-managed
        commerce, and scroll-native case studies—always restrained, always
        intentional.
      </p>
    </section>
  );
}
