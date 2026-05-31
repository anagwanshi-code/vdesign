"use client";

import { SectionDivider } from "@/components/blocks/section-divider";
import { cn } from "@/lib/utils/cn";
import {
  BookOpen,
  Lightbulb,
  Package,
  PenTool,
  Printer,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type CategoryCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  href: string;
};

const CATEGORIES: CategoryCard[] = [
  {
    title: "Blog",
    description: "Stories, trends, and studio updates from the V Design team.",
    icon: BookOpen,
    iconBg: "bg-rose-50",
    iconColor: "text-royal-magenta",
    href: "/resources",
  },
  {
    title: "Design Inspiration",
    description: "Mood boards, palettes, and creative references for modern brands.",
    icon: Lightbulb,
    iconBg: "bg-amber-50",
    iconColor: "text-saffron-gold",
    href: "/resources",
  },
  {
    title: "Packaging Guide",
    description: "Structural formats, materials, and finishing options explained.",
    icon: Package,
    iconBg: "bg-sky-50",
    iconColor: "text-peacock-blue",
    href: "/resources",
  },
  {
    title: "Branding Tips",
    description: "Practical advice for identity, positioning, and visual consistency.",
    icon: PenTool,
    iconBg: "bg-purple-50",
    iconColor: "text-royal-magenta",
    href: "/resources",
  },
  {
    title: "Printing Knowledge",
    description: "Offset, digital, foil, and specialty print techniques demystified.",
    icon: Printer,
    iconBg: "bg-emerald-50",
    iconColor: "text-peacock-blue",
    href: "/resources",
  },
];

export function ResourcesCategories() {
  return (
    <section
      className="mx-auto max-w-7xl px-6 py-16"
      aria-labelledby="resources-categories-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
          EXPLORE BY TOPIC
        </p>
        <h2
          id="resources-categories-heading"
          className="font-serif text-4xl text-luxury-text md:text-5xl"
        >
          Browse Resource Categories
        </h2>
        <SectionDivider />
      </div>

      <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <li key={category.title} className="h-full">
              <Link
                href={category.href}
                className="flex h-full flex-col items-center rounded-2xl border border-zinc-100 bg-white p-6 text-center transition-all hover:shadow-lg"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full",
                    category.iconBg,
                  )}
                >
                  <Icon
                    className={cn("h-5 w-5", category.iconColor)}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mb-2 mt-4 font-serif text-lg font-bold text-luxury-text">
                  {category.title}
                </h3>
                <p className="mb-4 flex-grow text-xs text-luxury-muted">
                  {category.description}
                </p>
                <span className="text-xs font-semibold text-royal-magenta">
                  Explore →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
