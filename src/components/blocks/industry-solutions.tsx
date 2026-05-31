import Image from "next/image";
import {
  Building2,
  Camera,
  Gem,
  Heart,
  Pill,
  Shirt,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type IndustryItem = {
  name: string;
  description: string;
  icon: LucideIcon;
  image: string;
};

const INDUSTRIES: IndustryItem[] = [
  {
    name: "Pharma",
    description:
      "Compliant packaging systems with clarity, trust, and refined shelf presence.",
    icon: Pill,
    image: "https://picsum.photos/seed/ind1/400/600",
  },
  {
    name: "Jewelry",
    description:
      "Velvet-touch boxes and display sets that elevate precious collections.",
    icon: Gem,
    image: "https://picsum.photos/seed/ind2/400/600",
  },
  {
    name: "Wedding",
    description:
      "Invitation suites, gifting boxes, and ceremonial brand touchpoints.",
    icon: Heart,
    image: "https://picsum.photos/seed/ind3/400/600",
  },
  {
    name: "Fashion",
    description:
      "Lookbooks, tags, and retail packaging aligned with seasonal narratives.",
    icon: Shirt,
    image: "https://picsum.photos/seed/ind4/400/600",
  },
  {
    name: "Corporate",
    description:
      "Executive kits, onboarding sets, and brand systems for growing teams.",
    icon: Building2,
    image: "https://picsum.photos/seed/ind5/400/600",
  },
  {
    name: "Photography",
    description:
      "Portfolio albums, proof boxes, and studio collateral with tactile finish.",
    icon: Camera,
    image: "https://picsum.photos/seed/ind6/400/600",
  },
  {
    name: "Food & Beverage",
    description:
      "Labels, cartons, and gift packaging designed for vibrant shelf stories.",
    icon: UtensilsCrossed,
    image: "https://picsum.photos/seed/ind7/400/600",
  },
  {
    name: "Startups",
    description:
      "Launch-ready identity kits that scale from pitch deck to first shipment.",
    icon: Sparkles,
    image: "https://picsum.photos/seed/ind8/400/600",
  },
];

export function IndustrySolutions() {
  return (
    <section
      className="w-full border-t border-luxury-border bg-luxury-surface py-24 md:py-32"
      aria-labelledby="industry-solutions-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
            Industries We Serve
          </p>
          <h2
            id="industry-solutions-heading"
            className="font-serif text-4xl text-luxury-text md:text-5xl"
          >
            Creative Solutions For Every Industry
          </h2>
        </header>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((industry) => {
            const Icon = industry.icon;

            return (
              <li key={industry.name}>
                <article className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
                  <Image
                    src={industry.image}
                    alt={industry.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                    aria-hidden="true"
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Icon
                      className="mb-3 h-7 w-7 text-white"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />

                    <h3 className="font-serif text-2xl text-white">
                      {industry.name}
                    </h3>

                    <p className="mt-3 max-h-0 translate-y-4 overflow-hidden text-sm leading-relaxed text-white/85 opacity-0 transition-all duration-500 group-hover:max-h-32 group-hover:translate-y-0 group-hover:opacity-100">
                      {industry.description}
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
