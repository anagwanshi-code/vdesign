"use client";

import { cn } from "@/lib/utils/cn";
import type { HeroEditorialParams } from "@/types/home";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const CINEMATIC_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: CINEMATIC_EASE,
    },
  },
};

type HeroBlockProps = {
  hero: HeroEditorialParams;
  className?: string;
};

export function HeroBlock({ hero, className }: HeroBlockProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const media = mediaRef.current;
    if (!section || !media) return;

    const context = gsap.context(() => {
      gsap.to(media, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, section);

    return () => context.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative min-h-svh overflow-hidden bg-surface",
        className,
      )}
      aria-label="Editorial hero"
    >
      <div className="mx-auto grid min-h-svh max-w-content grid-cols-1 items-center gap-12 px-5 py-24 md:px-8 lg:grid-cols-12 lg:gap-16 lg:px-20 lg:py-32">
        <motion.div
          className="flex flex-col gap-6 lg:col-span-5"
          variants={prefersReducedMotion ? undefined : containerVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          animate={prefersReducedMotion ? undefined : "visible"}
        >
          <motion.p
            className="text-overline uppercase text-saffron"
            variants={prefersReducedMotion ? undefined : itemVariants}
          >
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            className="font-serif text-display-xl text-balance text-text-primary"
            variants={prefersReducedMotion ? undefined : itemVariants}
          >
            {hero.title}
          </motion.h1>

          <motion.p
            className="max-w-prose text-body-lg text-text-muted"
            variants={prefersReducedMotion ? undefined : itemVariants}
          >
            {hero.description}
          </motion.p>

          <motion.div
            className="flex flex-col gap-4 pt-2 sm:flex-row"
            variants={prefersReducedMotion ? undefined : itemVariants}
          >
            <Link
              href={hero.ctaPrimary.href}
              className="inline-flex h-11 items-center justify-center rounded-md bg-text-primary px-8 text-body font-sans text-surface transition-colors duration-base ease-luxury hover:bg-peacock focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peacock focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {hero.ctaPrimary.label}
            </Link>
            <Link
              href={hero.ctaSecondary.href}
              className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-transparent px-8 text-body font-sans text-text-primary transition-colors duration-base ease-luxury hover:border-peacock hover:text-peacock focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peacock focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {hero.ctaSecondary.label}
            </Link>
          </motion.div>
        </motion.div>

        <div className="relative lg:col-span-7">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border shadow-soft">
            <div
              ref={mediaRef}
              className="absolute inset-0 will-change-transform"
            >
              <Image
                src={hero.media.src}
                alt={hero.media.alt}
                width={hero.media.width}
                height={hero.media.height}
                priority
                className="h-full w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/30 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
