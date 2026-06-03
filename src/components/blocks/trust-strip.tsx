"use client";

import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";
import Image from "next/image";

const DEFAULT_BRANDS_TITLE = "TRUSTED BY GROWING BRANDS";

type TrustStripProps = {
  brandLogosTitle?: string;
  brandLogoUrls?: string[];
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
  compact = false,
  className,
}: TrustStripProps) {
  const title = brandLogosTitle.trim() || DEFAULT_BRANDS_TITLE;
  const logos = brandLogoUrls.map((url) => url.trim()).filter(Boolean);
  const marqueeTrack = buildMarqueeTrack(logos);

  return (
    <section
      className={cn(
        "w-full max-w-none overflow-hidden bg-transparent px-0",
        compact ? "border-b border-luxury-border/80 py-12" : "border-y border-luxury-border py-16",
        className,
      )}
      aria-label="Trust and credentials"
    >
      <motion.div
        className="mx-auto w-full max-w-7xl px-4 md:px-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 md:text-sm">
          {title}
        </p>
      </motion.div>

      {marqueeTrack.length > 0 ? (
        <div
          className={cn(
            "relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden px-0",
            compact ? "py-1" : "py-2",
          )}
          aria-label="Client brand logos"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/80 to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#FAFAFA] via-[#FAFAFA]/80 to-transparent sm:w-16" />

          <div
            className={cn(
              "flex w-max animate-marquee items-center will-change-transform motion-reduce:animate-none",
              compact ? "gap-12" : "gap-16 md:gap-20",
            )}
          >
            {marqueeTrack.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className={cn(
                  "relative shrink-0",
                  compact ? "h-10 w-32 md:h-12 md:w-40" : "h-14 w-36 md:h-16 md:w-44",
                )}
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="176px"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
