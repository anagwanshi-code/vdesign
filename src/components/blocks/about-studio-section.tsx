"use client";

import { cn } from "@/lib/utils/cn";
import type { AboutStudioContent } from "@/types/home";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const CINEMATIC_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const textContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08,
    },
  },
};

const textItemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: CINEMATIC_EASE,
    },
  },
};

type AboutStudioSectionProps = {
  content: AboutStudioContent | null;
  className?: string;
};

export function AboutStudioSection({
  content,
  className,
}: AboutStudioSectionProps) {
  if (!content) {
    return null;
  }

  const { eyebrow, headline, description, ctaLabel, ctaLink, image } = content;
  const hasText = Boolean(eyebrow || headline || description);
  const hasImage = Boolean(image?.src);
  const showCta = Boolean(ctaLabel?.trim());

  if (!hasText && !hasImage) {
    return null;
  }

  const prefersReducedMotion = useReducedMotion();
  const motionEnabled = !prefersReducedMotion;

  return (
    <section
      className={cn("bg-black py-24 text-white md:py-32", className)}
      aria-labelledby={headline ? "about-studio-heading" : undefined}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        {hasText ? (
          <motion.div
            className="max-w-xl lg:max-w-none"
            variants={motionEnabled ? textContainerVariants : undefined}
            initial={motionEnabled ? "hidden" : false}
            whileInView={motionEnabled ? "visible" : undefined}
            viewport={{ once: true, amount: 0.35 }}
          >
            {eyebrow ? (
              <motion.p
                className="mb-6 text-sm uppercase tracking-[0.2em] text-[#D4AF37]"
                variants={motionEnabled ? textItemVariants : undefined}
              >
                {eyebrow}
              </motion.p>
            ) : null}

            {headline ? (
              <motion.h2
                id="about-studio-heading"
                className="mb-8 font-serif text-4xl font-light leading-tight md:text-5xl"
                variants={motionEnabled ? textItemVariants : undefined}
              >
                {headline}
              </motion.h2>
            ) : null}

            {description ? (
              <motion.p
                className={cn(
                  "max-w-md text-lg font-light leading-relaxed text-gray-400",
                  showCta ? "mb-10" : "mb-0",
                )}
                variants={motionEnabled ? textItemVariants : undefined}
              >
                {description}
              </motion.p>
            ) : null}

            {showCta ? (
              <motion.div variants={motionEnabled ? textItemVariants : undefined}>
                <Link
                  href={ctaLink || "/about"}
                  className="inline-flex items-center justify-center rounded-full border border-white px-8 py-3 text-sm uppercase tracking-widest text-white backdrop-blur-sm transition-all duration-500 hover:bg-white hover:text-black"
                >
                  {ctaLabel}
                </Link>
              </motion.div>
            ) : null}
          </motion.div>
        ) : (
          <div className="hidden lg:block" aria-hidden="true" />
        )}

        <motion.div
          className="relative aspect-[4/3] overflow-hidden rounded-sm"
          initial={motionEnabled ? { opacity: 0, scale: 1.06 } : false}
          whileInView={motionEnabled ? { opacity: 1, scale: 1 } : undefined}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.4, ease: CINEMATIC_EASE }}
        >
          <motion.div
            className="absolute inset-0"
            animate={
              motionEnabled
                ? { scale: hasImage ? [1, 1.03, 1] : [1, 1.04, 1] }
                : undefined
            }
            transition={
              motionEnabled
                ? {
                    duration: 14,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                : undefined
            }
          >
            {hasImage && image ? (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div
                className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-neutral-900 to-black"
                aria-hidden="true"
              />
            )}
          </motion.div>

          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40"
            aria-hidden="true"
          />
        </motion.div>
      </div>
    </section>
  );
}
