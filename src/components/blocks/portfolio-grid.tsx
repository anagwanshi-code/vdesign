"use client";

import { PortfolioProjectCard } from "@/components/blocks/portfolio-project-card";
import type { PortfolioListItem } from "@/types/portfolio";

export default function PortfolioGrid({
  projects,
}: {
  projects: PortfolioListItem[];
}) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="bg-[#FAFAFA] py-16 md:py-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
          {projects.map((project, index) => (
            <li key={project._id} className="min-w-0">
              <PortfolioProjectCard
                project={project}
                aspectClassName="aspect-[3/4]"
                showDescription
                compact
                priority={index < 4}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
