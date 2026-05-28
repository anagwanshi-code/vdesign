"use client";

import { cn } from "@/lib/utils/cn";
import type { HeroEditorialParams, HeroMedia } from "@/types/home";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CINEMATIC_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SLIDE_INTERVAL_MS = 5000;

const textContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.35,
    },
  },
};

const textItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: CINEMATIC_EASE,
    },
  },
};

const slideVariants = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0 },
};

type HeroBlockProps = {
  hero: HeroEditorialParams;
  className?: string;
};

function resolveHeroSlides(hero: HeroEditorialParams): HeroMedia[] {
  const fromSlider = hero.heroImages.filter((image) => Boolean(image.src?.trim()));
  if (fromSlider.length > 0) {
    return fromSlider;
  }
  if (hero.media.src?.trim()) {
    return [hero.media];
  }
  return [];
}

export function HeroBlock({ hero, className }: HeroBlockProps) {
  const prefersReducedMotion = useReducedMotion();
  const motionEnabled = !prefersReducedMotion;
  const slides = useMemo(() => resolveHeroSlides(hero), [hero]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || prefersReducedMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCurrentImageIndex((previous) => (previous + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [slides.length, prefersReducedMotion]);

  const activeSlide = slides[currentImageIndex];

  return (
    <section
      className={cn(
        "relative flex h-[90vh] w-full items-center justify-center overflow-hidden bg-black lg:h-screen",
        className,
      )}
      aria-label="Editorial hero"
    >
      {/* Background slider — Z-0 */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          {activeSlide ? (
            <motion.div
              key={currentImageIndex}
              className="absolute inset-0"
              variants={slideVariants}
              initial={motionEnabled ? "initial" : false}
              animate={motionEnabled ? "animate" : undefined}
              exit={motionEnabled ? "exit" : undefined}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <Image
                src={activeSlide.src}
                alt={activeSlide.alt}
                fill
                priority={currentImageIndex === 0}
                className="h-full w-full object-cover"
                sizes="100vw"
              />
            </motion.div>
          ) : (
            <div
              key="hero-empty"
              className="absolute inset-0 bg-neutral-950"
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Cinematic overlay — Z-10 */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/30 to-black/80"
        aria-hidden="true"
      />

      {/* Content — Z-20 */}
      <motion.div
        className="relative z-20 mx-auto flex max-w-5xl flex-col items-center px-4 text-center"
        variants={motionEnabled ? textContainerVariants : undefined}
        initial={motionEnabled ? "hidden" : false}
        animate={motionEnabled ? "visible" : undefined}
      >
        <motion.p
          className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] sm:text-sm"
          variants={motionEnabled ? textItemVariants : undefined}
        >
          {hero.eyebrow}
        </motion.p>

        <motion.h1
          className="mt-6 font-serif text-5xl font-light leading-tight tracking-tight text-white md:text-7xl lg:text-8xl"
          variants={motionEnabled ? textItemVariants : undefined}
        >
          {hero.title}
        </motion.h1>

        <motion.p
          className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300"
          variants={motionEnabled ? textItemVariants : undefined}
        >
          {hero.description}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
          variants={motionEnabled ? textItemVariants : undefined}
        >
          <Link
            href={hero.ctaPrimary.href}
            className="inline-flex h-12 min-w-[160px] items-center justify-center bg-white px-8 font-sans text-sm font-medium tracking-wide text-black transition-opacity duration-300 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {hero.ctaPrimary.label}
          </Link>
          <Link
            href={hero.ctaSecondary.href}
            className="inline-flex h-12 min-w-[160px] items-center justify-center border border-white bg-transparent px-8 font-sans text-sm font-medium tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:border-white/80 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {hero.ctaSecondary.label}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
