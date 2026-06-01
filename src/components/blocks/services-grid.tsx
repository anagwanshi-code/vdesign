"use client";

import { SectionDivider } from "@/components/blocks/section-divider";
import { cn } from "@/lib/utils/cn";
import type { ServiceDocument } from "@/types/service";
import {
  Megaphone,
  Monitor,
  Package,
  PenTool,
  Printer,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ServiceCardStyle = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  features: string[];
  href: string;
};

type ServiceDisplayItem = ServiceCardStyle & {
  id: string;
  number: string;
  title: string;
  description: string;
  imageUrl?: string | null;
};

const CARD_STYLES: ServiceCardStyle[] = [
  {
    features: [
      "Logo Design",
      "Brand Strategy",
      "Visual Guidelines",
      "Brand Collateral",
    ],
    icon: PenTool,
    iconBg: "bg-rose-50",
    iconColor: "text-royal-magenta",
    href: "/consultation",
  },
  {
    features: [
      "Rigid Boxes",
      "Structural Design",
      "Material Selection",
      "Prototype & Mockups",
    ],
    icon: Package,
    iconBg: "bg-sky-50",
    iconColor: "text-peacock-blue",
    href: "/consultation",
  },
  {
    features: [
      "Offset Printing",
      "Foil & Embossing",
      "Large Format",
      "Quality Control",
    ],
    icon: Printer,
    iconBg: "bg-amber-50",
    iconColor: "text-saffron-gold",
    href: "/consultation",
  },
  {
    features: [
      "Social Creative",
      "Campaign Design",
      "Content Strategy",
      "Ad Creatives",
    ],
    icon: Megaphone,
    iconBg: "bg-purple-50",
    iconColor: "text-royal-magenta",
    href: "/consultation",
  },
  {
    features: [
      "UI/UX Design",
      "E-commerce Sites",
      "Landing Pages",
      "Performance Optimization",
    ],
    icon: Monitor,
    iconBg: "bg-emerald-50",
    iconColor: "text-peacock-blue",
    href: "/consultation",
  },
  {
    features: [
      "Brand Audits",
      "Production Planning",
      "Vendor Coordination",
      "Growth Strategy",
    ],
    icon: Users,
    iconBg: "bg-orange-50",
    iconColor: "text-saffron-gold",
    href: "/consultation",
  },
];

const FALLBACK_SERVICES: ServiceDisplayItem[] = [
  {
    id: "fallback-1",
    number: "01",
    title: "Branding & Identity",
    description:
      "Build a distinctive brand presence with strategic identity systems that resonate across every touchpoint.",
    ...CARD_STYLES[0],
  },
  {
    id: "fallback-2",
    number: "02",
    title: "Packaging Design",
    description:
      "Luxury structural packaging and unboxing experiences engineered for retail, gifting, and product launches.",
    ...CARD_STYLES[1],
  },
  {
    id: "fallback-3",
    number: "03",
    title: "Printing Solutions",
    description:
      "Premium print production with foil, embossing, and specialty finishes executed with color fidelity.",
    ...CARD_STYLES[2],
  },
  {
    id: "fallback-4",
    number: "04",
    title: "Digital Marketing",
    description:
      "Campaign creative and performance-ready assets that amplify your brand across digital channels.",
    ...CARD_STYLES[3],
  },
  {
    id: "fallback-5",
    number: "05",
    title: "Web Design & Development",
    description:
      "Refined websites and ecommerce experiences with editorial typography, motion, and conversion flow.",
    ...CARD_STYLES[4],
  },
  {
    id: "fallback-6",
    number: "06",
    title: "Business Consultancy",
    description:
      "Strategic guidance from concept to production for teams scaling packaging, print, and brand systems.",
    ...CARD_STYLES[5],
  },
];

function mapCmsServices(services: ServiceDocument[]): ServiceDisplayItem[] {
  return services
    .filter((item) => item.title?.trim())
    .map((item, index) => {
      const style = CARD_STYLES[index % CARD_STYLES.length];
      return {
        id: item._id,
        number: String(index + 1).padStart(2, "0"),
        title: item.title!.trim(),
        description: item.shortDescription?.trim() ?? "",
        imageUrl: item.imageUrl,
        href: "/consultation",
        features: [],
        icon: style.icon,
        iconBg: style.iconBg,
        iconColor: style.iconColor,
      };
    });
}

type ServicesGridProps = {
  services?: ServiceDocument[] | null;
};

export function ServicesGrid({ services }: ServicesGridProps) {
  const fromCms = services?.filter((item) => item.title?.trim()) ?? [];
  const displayServices =
    fromCms.length > 0 ? mapCmsServices(fromCms) : FALLBACK_SERVICES;

  return (
    <section
      className="mx-auto max-w-7xl px-6 py-24"
      aria-labelledby="services-grid-heading"
    >
      <header className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
          WHAT WE DO
        </p>
        <h2
          id="services-grid-heading"
          className="font-serif text-4xl text-luxury-text md:text-5xl"
        >
          Our Premium Services
        </h2>
        <SectionDivider />
      </header>

      <ul className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {displayServices.map((service) => {
          const Icon = service.icon;
          const hasFeatures = service.features.length > 0;

          return (
            <li key={service.id}>
              <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
                <span
                  className="absolute right-6 top-4 z-0 font-serif text-6xl font-bold text-zinc-50 transition-colors group-hover:text-royal-magenta/5"
                  aria-hidden="true"
                >
                  {service.number}
                </span>

                <div className="relative z-10 flex flex-col">
                  {service.imageUrl ? (
                    <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-xl bg-zinc-50">
                      <Image
                        src={service.imageUrl}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={!service.imageUrl.startsWith("http")}
                      />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full",
                        service.iconBg,
                      )}
                    >
                      <Icon
                        className={cn("h-5 w-5", service.iconColor)}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  <h3
                    className={cn(
                      "mb-3 font-serif text-2xl font-bold text-luxury-text",
                      service.imageUrl ? "mt-0" : "mt-6",
                    )}
                  >
                    {service.title}
                  </h3>
                  <p className="mb-6 line-clamp-3 text-sm text-luxury-muted">
                    {service.description}
                  </p>

                  {hasFeatures ? (
                    <ul className="mb-6">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="mb-2 flex items-center text-xs text-luxury-muted"
                        >
                          <span
                            className="mr-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-saffron-gold"
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <Link
                    href={service.href}
                    className="mt-auto inline-block pt-6 text-sm font-semibold text-royal-magenta transition-colors hover:text-peacock-blue"
                  >
                    Explore More →
                  </Link>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
