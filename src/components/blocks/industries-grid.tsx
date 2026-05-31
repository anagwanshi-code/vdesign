"use client";

import { SectionDivider } from "@/components/blocks/section-divider";
import { cn } from "@/lib/utils/cn";
import type { IndustryDocument } from "@/types/industry";
import {
  Briefcase,
  Camera,
  Gem,
  Heart,
  Pill,
  Rocket,
  ShoppingBag,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type IndustryCardStyle = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  gradient: string;
  href: string;
};

type IndustryDisplayItem = IndustryCardStyle & {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
};

const ICON_BY_KEY: Record<string, LucideIcon> = {
  pill: Pill,
  pharma: Pill,
  gem: Gem,
  jewelry: Gem,
  heart: Heart,
  wedding: Heart,
  shoppingbag: ShoppingBag,
  fashion: ShoppingBag,
  briefcase: Briefcase,
  corporate: Briefcase,
  camera: Camera,
  photography: Camera,
  utensilscrossed: UtensilsCrossed,
  food: UtensilsCrossed,
  beverage: UtensilsCrossed,
  rocket: Rocket,
  startups: Rocket,
  startup: Rocket,
};

const CARD_STYLES: IndustryCardStyle[] = [
  {
    icon: Pill,
    iconBg: "bg-sky-50",
    iconColor: "text-peacock-blue",
    gradient: "from-sky-50 via-white to-peacock-blue/20",
    href: "/consultation",
  },
  {
    icon: Gem,
    iconBg: "bg-rose-50",
    iconColor: "text-royal-magenta",
    gradient: "from-rose-50 via-amber-50 to-white",
    href: "/consultation",
  },
  {
    icon: Heart,
    iconBg: "bg-rose-50",
    iconColor: "text-royal-magenta",
    gradient: "from-rose-100/80 via-white to-saffron-gold/25",
    href: "/consultation",
  },
  {
    icon: ShoppingBag,
    iconBg: "bg-purple-50",
    iconColor: "text-royal-magenta",
    gradient: "from-purple-50 via-zinc-50 to-rose-50",
    href: "/consultation",
  },
  {
    icon: Briefcase,
    iconBg: "bg-amber-50",
    iconColor: "text-saffron-gold",
    gradient: "from-amber-50 via-white to-zinc-100",
    href: "/consultation",
  },
  {
    icon: Camera,
    iconBg: "bg-sky-50",
    iconColor: "text-peacock-blue",
    gradient: "from-zinc-100 via-sky-50 to-white",
    href: "/consultation",
  },
  {
    icon: UtensilsCrossed,
    iconBg: "bg-emerald-50",
    iconColor: "text-peacock-blue",
    gradient: "from-emerald-50 via-amber-50 to-rose-50",
    href: "/consultation",
  },
  {
    icon: Rocket,
    iconBg: "bg-orange-50",
    iconColor: "text-saffron-gold",
    gradient: "from-orange-50 via-white to-royal-magenta/15",
    href: "/consultation",
  },
];

const FALLBACK_INDUSTRIES: IndustryDisplayItem[] = [
  {
    id: "fallback-pharma",
    title: "Pharma",
    description:
      "Compliant packaging, clear labeling, and shelf-ready systems built for trust and regulatory clarity.",
    ...CARD_STYLES[0],
  },
  {
    id: "fallback-jewelry",
    title: "Jewelry",
    description:
      "Velvet-touch boxes, display sets, and boutique packaging that elevate precious collections.",
    ...CARD_STYLES[1],
  },
  {
    id: "fallback-wedding",
    title: "Wedding",
    description:
      "Invitation suites, favor boxes, and ceremonial brand touchpoints for unforgettable celebrations.",
    ...CARD_STYLES[2],
  },
  {
    id: "fallback-fashion",
    title: "Fashion",
    description:
      "Tags, lookbooks, and retail packaging aligned with seasonal narratives and premium retail.",
    ...CARD_STYLES[3],
  },
  {
    id: "fallback-corporate",
    title: "Corporate",
    description:
      "Executive kits, onboarding sets, and brand systems for teams scaling with clarity.",
    ...CARD_STYLES[4],
  },
  {
    id: "fallback-photography",
    title: "Photography",
    description:
      "Portfolio albums, proof boxes, and studio collateral with tactile, gallery-worthy finishes.",
    ...CARD_STYLES[5],
  },
  {
    id: "fallback-food",
    title: "Food & Beverage",
    description:
      "Labels, cartons, and gift packaging designed for vibrant shelf stories and brand recall.",
    ...CARD_STYLES[6],
  },
  {
    id: "fallback-startups",
    title: "Startups",
    description:
      "Launch-ready identity, packaging, and print systems that scale as your business grows.",
    ...CARD_STYLES[7],
  },
];

function resolveIndustryIcon(iconKey: string | null | undefined): LucideIcon | null {
  if (!iconKey?.trim()) {
    return null;
  }
  const normalized = iconKey.trim().replace(/\s+/g, "").toLowerCase();
  return ICON_BY_KEY[normalized] ?? ICON_BY_KEY[normalized.replace(/&/g, "")] ?? null;
}

function mapCmsIndustries(industries: IndustryDocument[]): IndustryDisplayItem[] {
  return industries
    .filter((item) => item.title?.trim())
    .map((item, index) => {
      const style = CARD_STYLES[index % CARD_STYLES.length];
      const iconFromCms = resolveIndustryIcon(item.icon);
      return {
        id: item._id,
        title: item.title!.trim(),
        description: item.shortDescription?.trim() ?? "",
        imageUrl: item.imageUrl,
        icon: iconFromCms ?? style.icon,
        iconBg: style.iconBg,
        iconColor: style.iconColor,
        gradient: style.gradient,
        href: item.slug?.trim()
          ? `/consultation?industry=${encodeURIComponent(item.slug.trim())}`
          : style.href,
      };
    });
}

type IndustriesGridProps = {
  industries?: IndustryDocument[] | null;
};

export function IndustriesGrid({ industries }: IndustriesGridProps) {
  const fromCms = industries?.filter((item) => item.title?.trim()) ?? [];
  const displayIndustries =
    fromCms.length > 0 ? mapCmsIndustries(fromCms) : FALLBACK_INDUSTRIES;

  return (
    <section
      className="mx-auto max-w-7xl px-6 py-24"
      aria-labelledby="industries-grid-heading"
    >
      <header className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
          INDUSTRIES
        </p>
        <h2
          id="industries-grid-heading"
          className="font-serif text-4xl text-luxury-text md:text-5xl"
        >
          Tailored Solutions. Maximum Impact.
        </h2>
        <SectionDivider />
      </header>

      <ul className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {displayIndustries.map((industry) => {
          const Icon = industry.icon;
          return (
            <li key={industry.id} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
                <div className="flex flex-grow flex-col p-6">
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                        industry.iconBg,
                      )}
                    >
                      <Icon
                        className={cn("h-5 w-5", industry.iconColor)}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="ml-3 font-serif text-xl font-bold text-luxury-text">
                      {industry.title}
                    </h3>
                  </div>
                  <p className="mt-4 line-clamp-4 text-xs text-luxury-muted">
                    {industry.description}
                  </p>
                  <Link
                    href={industry.href}
                    className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-royal-magenta transition-colors hover:text-peacock-blue"
                  >
                    Explore Solutions →
                  </Link>
                </div>
                <div className="relative mt-auto h-32 overflow-hidden bg-zinc-50">
                  {industry.imageUrl ? (
                    <Image
                      src={industry.imageUrl}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 25vw"
                      unoptimized={!industry.imageUrl.startsWith("http")}
                    />
                  ) : (
                    <div
                      className={cn(
                        "h-full w-full bg-gradient-to-br transition-transform duration-700 group-hover:scale-105",
                        industry.gradient,
                      )}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
