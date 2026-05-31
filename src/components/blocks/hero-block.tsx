"use client";

import { cn } from "@/lib/utils/cn";
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

type HeroBlockProps = {
  hero: HeroEditorialParams;
  className?: string;
};

export function HeroBlock({ hero, className }: HeroBlockProps) {
  const prefersReducedMotion = useReducedMotion();
  const motionEnabled = !prefersReducedMotion;
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderImages = useMemo(() => {
    const fromCms = hero.heroImages
      .map((image) => image.src?.trim())
      .filter((src): src is string => Boolean(src));
    return fromCms.length > 0 ? fromCms : [...SLIDER_IMAGES];
  }, [hero.heroImages]);

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
      className={cn("w-full overflow-hidden bg-white", className)}
      aria-label="Editorial hero"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-16 pt-24 lg:grid-cols-2 lg:gap-12 lg:pt-32">
        <motion.div
          initial={motionEnabled ? { opacity: 0, y: 24 } : false}
          animate={motionEnabled ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
            {eyebrow}
          </p>

          <h1 className="mb-6 font-serif text-5xl leading-[1.1] text-zinc-900 md:text-7xl">
            We Build Brands That Leave a{" "}
            <span className="font-dancing ml-2 bg-gradient-to-r from-[#E91E63] to-purple-600 bg-clip-text text-6xl text-transparent md:text-8xl">
              Mark.
            </span>
          </h1>

          <p className="mb-8 max-w-lg text-lg text-zinc-600 md:text-xl">
            {hero.description?.trim() ||
              "Creative Design, Premium Printing, Luxury Packaging & Digital Branding Solutions in Surat."}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href={primaryCta.href}
              className="rounded-full bg-gradient-to-r from-[#E91E63] to-rose-500 px-8 py-3.5 font-medium text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E91E63] focus-visible:ring-offset-2"
            >
              {primaryCta.label}
            </Link>
            <Link
              href={secondaryCta.href}
              className="rounded-full border-2 border-zinc-200 px-8 py-3.5 font-medium text-zinc-700 transition-colors hover:border-[#E91E63] hover:text-[#E91E63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E91E63] focus-visible:ring-offset-2"
            >
              {secondaryCta.label}
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg"
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
              alt={
                hero.heroImages[index]?.alt?.trim() ||
                `V Design hero showcase ${index + 1}`
              }
              fill
              priority={index === 0}
              className={cn(
                "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out",
                index === currentIndex ? "opacity-100" : "opacity-0",
              )}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
