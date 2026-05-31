import PortfolioGrid from "@/components/blocks/portfolio-grid";
import { client } from "@/sanity/lib/client";
import { ALL_PORTFOLIO_QUERY } from "@/sanity/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore V Design selected works in luxury packaging, premium printing, and brand identity.",
};

export default async function PortfolioPage() {
  const projects = await client.fetch(ALL_PORTFOLIO_QUERY);

  return (
    <div className="bg-luxury-bg pt-32">
      <header className="mx-auto max-w-7xl px-6 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
          OUR PORTFOLIO
        </p>
        <h1 className="mb-6 font-serif text-4xl leading-tight text-luxury-text md:text-6xl">
          Selected Works &amp; <br />
          <span className="font-dancing text-5xl text-royal-magenta md:text-7xl">
            Masterpieces
          </span>
        </h1>
        <p className="mx-auto mb-16 max-w-2xl text-lg text-luxury-muted">
          Explore our latest projects in luxury packaging, premium printing, and
          brand identity.
        </p>
      </header>

      <PortfolioGrid projects={projects ?? []} />
    </div>
  );
}
