"use client";

import { cn, premiumCtaHoverClass } from "@/lib/utils/cn";
import type { HeroEditorialParams } from "@/types/home";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CINEMATIC_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const SLIDER_IMAGES = [
  "https://picsum.photos/seed/h1/1920/1080",
  "https://picsum.photos/seed/h2/1920/1080",
  "https://picsum.photos/seed/h3/1920/1080",
] as const;

const SLIDER_INTERVAL_MS = 4000;

type HeroImageInput =
  | string
  | HeroEditorialParams["heroImages"][number]
  | { src?: string | null; url?: string | null; alt?: string | null };

function resolveHeroImageSrc(image: HeroImageInput): string | null {
  if (typeof image === "string") {
    const trimmed = image.trim();
    return trimmed || null;
  }
  const src = image.src?.trim();
  if (src) {
    return src;
  }
  const url = "url" in image ? image.url?.trim() : null;
  return url || null;
}

function resolveHeroImageAlt(image: HeroImageInput | undefined, index: number): string {
  if (typeof image === "string") {
    return `V Design Showcase ${index + 1}`;
  }
  return image?.alt?.trim() || `V Design Showcase ${index + 1}`;
}

type HeroBlockProps = {
  hero: HeroEditorialParams;
  /** Tighter vertical spacing when stacked in the homepage viewport hero */
  compact?: boolean;
  className?: string;
};

export function HeroBlock({ hero, compact = false, className }: HeroBlockProps) {
  const prefersReducedMotion = useReducedMotion();
  const motionEnabled = !prefersReducedMotion;
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderImages = useMemo(() => {
    const fromUrlField =
      hero.heroImageUrls?.map((url) => url?.trim()).filter((src): src is string =>
        Boolean(src),
      ) ?? [];
    if (fromUrlField.length > 0) {
      return fromUrlField;
    }

    if (!hero.heroImages || !Array.isArray(hero.heroImages)) {
      return [...SLIDER_IMAGES];
    }

    const fromCms = hero.heroImages
      .map((img) => resolveHeroImageSrc(img as HeroImageInput))
      .filter((src): src is string => Boolean(src));

    return fromCms.length > 0 ? fromCms : [...SLIDER_IMAGES];
  }, [hero.heroImageUrls, hero.heroImages]);

  useEffect(() => {
    if (prefersReducedMotion || sliderImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
    }, SLIDER_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, sliderImages.length]);

  const primaryCta = {
    label: hero.ctaPrimary.label?.trim() || "Explore Our Work",
    href: hero.ctaPrimary.href?.trim() || "/work",
  };
  const secondaryCta = {
    label: hero.ctaSecondary.label?.trim() || "Book Consultation",
    href: hero.ctaSecondary.href?.trim() || "/consultation",
  };

  const eyebrow = hero.eyebrow?.trim() || "We Don't Just Design.";

  return (
    <section
      className={cn(
        "flex w-full flex-col overflow-hidden bg-white",
        className,
      )}
      aria-label="Editorial hero"
    >
      <div
        className={cn(
          "mx-auto grid w-full max-w-7xl grid-cols-1 items-center px-6 lg:grid-cols-2",
          compact
            ? "gap-12 pb-12 pt-12 lg:gap-16 lg:pb-20 lg:pt-16"
            : "gap-10 pb-12 pt-10 lg:gap-12 lg:pb-20 lg:pt-16",
        )}
      >
        <motion.div
          initial={motionEnabled ? { opacity: 0, y: 24 } : false}
          animate={motionEnabled ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
            {eyebrow}
          </p>

          <h1
            className={cn(
              "font-serif leading-[1.1] text-zinc-900",
              compact
                ? "mb-4 text-4xl md:text-5xl lg:text-6xl"
                : "mb-6 text-5xl md:text-7xl",
            )}
          >
            We Build Brands That Leave a{" "}
            <span className="font-dancing ml-2 bg-gradient-to-r from-[#E91E63] to-purple-600 bg-clip-text text-6xl text-transparent md:text-8xl">
              Mark.
            </span>
          </h1>

          <p
            className={cn(
              "max-w-lg text-zinc-600",
              compact ? "mb-5 text-base md:text-lg" : "mb-8 text-lg md:text-xl",
            )}
          >
            {hero.description?.trim() ||
              "Creative Design, Premium Printing, Luxury Packaging & Digital Branding Solutions in Surat."}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href={primaryCta.href}
              className={cn(
                "rounded-full bg-gradient-to-r from-[#E91E63] to-rose-500 px-8 py-3.5 font-medium text-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E91E63] focus-visible:ring-offset-2",
                premiumCtaHoverClass,
              )}
            >
              {primaryCta.label}
            </Link>
            <Link
              href={secondaryCta.href}
              className="rounded-full border-2 border-zinc-200 px-8 py-3.5 font-medium text-zinc-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E91E63] hover:text-[#E91E63] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E91E63] focus-visible:ring-offset-2"
            >
              {secondaryCta.label}
            </Link>
          </div>
        </motion.div>

        <motion.div
          className={cn(
            "relative mx-auto w-full overflow-hidden rounded-2xl lg:ml-auto",
            compact
              ? "aspect-video max-w-3xl shadow-2xl"
              : "aspect-video shadow-lg",
          )}
          initial={motionEnabled ? { opacity: 0, scale: 0.98 } : false}
          animate={
            motionEnabled
              ? {
                  opacity: 1,
                  scale: 1,
                  y: [0, -10, 0],
                }
              : undefined
          }
          transition={
            motionEnabled
              ? {
                  opacity: { duration: 0.9, ease: CINEMATIC_EASE },
                  scale: { duration: 0.9, ease: CINEMATIC_EASE },
                  y: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }
              : undefined
          }
        >
          {sliderImages.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt={resolveHeroImageAlt(hero.heroImages[index], index)}
              fill
              priority={index === 0}
              className={cn(
                "object-cover transition-opacity duration-1000 ease-in-out",
                index === currentIndex ? "opacity-100" : "opacity-0",
              )}
              sizes="(max-width: 1024px) 100vw, 768px"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
