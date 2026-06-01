"use client";

import { PortfolioMedia } from "@/components/blocks/portfolio-media";
import { cn } from "@/lib/utils/cn";
import type { PortfolioCardProject } from "@/types/portfolio";
import Link from "next/link";

type PortfolioProjectCardProps = {
  project: PortfolioCardProject;
  aspectClassName?: string;
  showDescription?: boolean;
  priority?: boolean;
  /** Denser typography and padding for multi-column gallery rows */
  compact?: boolean;
};

export function PortfolioProjectCard({
  project,
  aspectClassName = "aspect-[4/5]",
  showDescription = false,
  priority = false,
  compact = false,
}: PortfolioProjectCardProps) {
  const slug = project.slug?.trim();
  const href = slug ? `/portfolio/${slug}` : "/portfolio";

  return (
    <Link
      href={href}
      className={cn(
        "group relative block overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl",
        compact ? "rounded-xl" : "rounded-2xl",
        aspectClassName,
      )}
    >
      <PortfolioMedia
        title={project.title}
        imageUrl={project.imageUrl}
        videoUrl={project.videoUrl}
        priority={priority}
        mediaClassName="transition-transform duration-700 group-hover:scale-105"
        sizes={
          compact
            ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            : "(max-width: 768px) 100vw, 50vw"
        }
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/95"
        aria-hidden="true"
      />

      <div
        className={cn(
          "absolute bottom-0 left-0 right-0",
          compact ? "p-3 md:p-4" : "p-6 md:p-8",
        )}
      >
        <p
          className={cn(
            "uppercase text-gray-300",
            compact
              ? "mb-1 text-[10px] tracking-[0.2em]"
              : "mb-2 text-xs tracking-widest",
          )}
        >
          {project.category || "Signature Work"}
        </p>
        <h3
          className={cn(
            "font-serif font-light leading-snug text-white",
            compact ? "text-base md:text-lg" : "text-2xl md:text-3xl",
          )}
        >
          {project.title}
        </h3>
        {showDescription && project.shortDescription ? (
          <p
            className={cn(
              "text-white/80",
              compact
                ? "mt-1.5 line-clamp-2 text-[11px] leading-snug"
                : "mt-3 line-clamp-2 text-sm",
            )}
          >
            {project.shortDescription}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
