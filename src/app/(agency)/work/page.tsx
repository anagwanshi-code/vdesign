import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "Creative agency case studies and portfolio by V Design Luxury.",
};

export default function WorkPage() {
  return (
    <section className="mx-auto w-full max-w-content px-5 py-24 md:px-8 lg:px-20">
      <p className="text-overline uppercase text-purple">Agency</p>
      <h1 className="mt-4 font-serif text-display-lg text-text-primary">
        Selected Work
      </h1>
      <p className="mt-6 max-w-prose text-body text-text-muted">
        Case studies and cinematic project narratives powered by Sanity CMS will
        render in this route group.
      </p>
    </section>
  );
}
