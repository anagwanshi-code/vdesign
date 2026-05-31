import { PortfolioProjectCard } from "@/components/blocks/portfolio-project-card";
import type { PortfolioCardProject } from "@/types/portfolio";
import Link from "next/link";

type PortfolioSectionProps = {
  projects: PortfolioCardProject[];
};

export function PortfolioSection({ projects }: PortfolioSectionProps) {
  return (
    <section
      className="w-full border-t border-luxury-border bg-luxury-bg py-24 md:py-32"
      aria-labelledby="portfolio-section-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
              Our Work
            </p>
            <h2
              id="portfolio-section-heading"
              className="font-serif text-4xl leading-tight text-luxury-text md:text-5xl"
            >
              Selected Creative Projects
            </h2>
          </div>

          <div className="flex flex-col items-start gap-6 lg:items-end lg:text-right">
            <p className="max-w-md text-lg text-luxury-muted lg:ml-auto">
              Looping previews of our latest branding, packaging, and visual
              experiences—curated for modern businesses.
            </p>
            <Link
              href="/portfolio"
              className="font-medium text-royal-magenta transition-colors hover:text-peacock-blue"
            >
              View Full Portfolio →
            </Link>
          </div>
        </div>

        {projects.length === 0 ? (
          <p className="mt-16 text-center text-luxury-muted">
            No portfolio projects yet. Add work in Sanity Studio to showcase it
            here.
          </p>
        ) : (
          <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {projects.map((project, index) => (
              <li key={project._id} className="min-w-0">
                <PortfolioProjectCard
                  project={project}
                  aspectClassName="aspect-[3/4]"
                  compact
                  priority={index < 2}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
