"use client";

import { cn } from "@/lib/utils/cn";
import type { HomeStatItem } from "@/types/home";
import { motion } from "framer-motion";
import Image from "next/image";

const DEFAULT_BRANDS_TITLE = "TRUSTED BY GROWING BRANDS";

type TrustStripProps = {
  brandLogosTitle?: string;
  brandLogoUrls?: string[];
  homeStats?: HomeStatItem[];
  /** Tighter layout for the full-viewport homepage hero stack */
  compact?: boolean;
  className?: string;
};

function buildMarqueeTrack(urls: string[]): string[] {
  if (urls.length === 0) {
    return [];
  }
  let track = [...urls];
  while (track.length < 8) {
    track = [...track, ...urls];
  }
  return [...track, ...track];
}

export function TrustStrip({
  brandLogosTitle = DEFAULT_BRANDS_TITLE,
  brandLogoUrls = [],
  homeStats = [],
  compact = false,
  className,
}: TrustStripProps) {
  const title = brandLogosTitle.trim() || DEFAULT_BRANDS_TITLE;
  const logos = brandLogoUrls.map((url) => url.trim()).filter(Boolean);
  const marqueeTrack = buildMarqueeTrack(logos);
  const stats = homeStats.filter(
    (item) => item.value?.trim() || item.label?.trim(),
  );

  return (
    <section
      className={cn(
        "w-full bg-white",
        compact ? "border-b border-luxury-border py-3" : "border-y border-luxury-border py-12",
        className,
      )}
      aria-label="Trust and credentials"
    >
      <motion.div
        className={cn("mx-auto max-w-7xl px-6", compact && "px-4")}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p
          className={cn(
            "text-center text-xs font-medium uppercase tracking-widest text-luxury-muted",
            compact ? "mb-3" : "mb-8",
          )}
        >
          {title}
        </p>

        {marqueeTrack.length > 0 ? (
          <div
            className={cn(
              "relative overflow-hidden",
              compact ? "mb-4" : "mb-10",
            )}
            aria-label="Client brand logos"
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent md:w-16" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent md:w-16" />

            <div
              className={cn(
                "flex w-max animate-marquee items-center px-2",
                compact ? "gap-10" : "gap-14 px-4",
              )}
            >
              {marqueeTrack.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className={cn(
                    "relative flex shrink-0 items-center justify-center",
                    compact ? "h-10 w-28 md:h-12 md:w-36" : "h-14 w-36 md:h-16 md:w-44",
                  )}
                >
                  <Image
                    src={url}
                    alt=""
                    fill
                    className="object-contain opacity-55 grayscale transition-all duration-300 hover:opacity-90 hover:grayscale-0"
                    sizes="176px"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {stats.length > 0 ? (
          <ul
            className={cn(
              "grid gap-4 text-center",
              stats.length === 1 && "grid-cols-1",
              stats.length === 2 && "grid-cols-2",
              stats.length === 3 && "grid-cols-3",
              stats.length >= 4 && "grid-cols-2 md:grid-cols-4",
              compact && "gap-3 md:gap-6",
              !compact && "gap-8",
            )}
          >
            {stats.map((stat) => (
              <li key={`${stat.value}-${stat.label}`}>
                <p
                  className={cn(
                    "mb-0.5 font-serif text-royal-magenta",
                    compact ? "text-2xl md:text-3xl" : "text-3xl",
                  )}
                >
                  {stat.value}
                </p>
                <p className="text-[10px] font-medium uppercase tracking-widest text-luxury-muted md:text-xs">
                  {stat.label}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </motion.div>
    </section>
  );
}
