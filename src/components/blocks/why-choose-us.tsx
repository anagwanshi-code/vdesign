import { cn } from "@/lib/utils/cn";
import {
  Award,
  Clock,
  Headphones,
  Lightbulb,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type FeatureItem = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accentClass: string;
  iconBg?: string;
};

const HOME_FEATURES: FeatureItem[] = [
  {
    title: "Premium Quality",
    subtitle: "Materials and finishes chosen for lasting luxury appeal.",
    icon: ShieldCheck,
    accentClass: "text-peacock-blue",
  },
  {
    title: "Creative Expertise",
    subtitle: "Editorial design led by seasoned brand storytellers.",
    icon: Lightbulb,
    accentClass: "text-royal-magenta",
  },
  {
    title: "Custom Solutions",
    subtitle: "Tailored systems built around your product and audience.",
    icon: SlidersHorizontal,
    accentClass: "text-saffron-gold",
  },
  {
    title: "Modern Technology",
    subtitle: "Precision print workflows and digital-ready asset pipelines.",
    icon: Sparkles,
    accentClass: "text-peacock-blue",
  },
  {
    title: "Timely Delivery",
    subtitle: "Structured production schedules with clear milestones.",
    icon: Clock,
    accentClass: "text-royal-magenta",
  },
  {
    title: "Client Satisfaction",
    subtitle: "Partnerships measured by clarity, craft, and repeat trust.",
    icon: Headphones,
    accentClass: "text-saffron-gold",
  },
];

const INDUSTRIES_FEATURES: FeatureItem[] = [
  {
    title: "Industry Expertise",
    subtitle: "Deep understanding of sector-specific packaging and brand needs.",
    icon: Award,
    accentClass: "text-royal-magenta",
    iconBg: "bg-rose-50",
  },
  {
    title: "Creative Excellence",
    subtitle: "Distinctive design systems that elevate your market presence.",
    icon: Lightbulb,
    accentClass: "text-saffron-gold",
    iconBg: "bg-amber-50",
  },
  {
    title: "Premium Quality",
    subtitle: "Finest materials and finishes for lasting luxury appeal.",
    icon: ShieldCheck,
    accentClass: "text-peacock-blue",
    iconBg: "bg-sky-50",
  },
  {
    title: "End-to-End Support",
    subtitle: "From strategy through production with a dedicated partner team.",
    icon: Headphones,
    accentClass: "text-royal-magenta",
    iconBg: "bg-purple-50",
  },
];

type WhyChooseUsProps = {
  variant?: "home" | "industries";
};

export function WhyChooseUs({ variant = "home" }: WhyChooseUsProps) {
  if (variant === "industries") {
    return (
      <section
        className="w-full border-t border-zinc-100 bg-luxury-surface/50 py-16"
        aria-labelledby="why-choose-industries-heading"
      >
        <header className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-royal-magenta">
            WHY CHOOSE V DESIGN?
          </p>
          <h2
            id="why-choose-industries-heading"
            className="sr-only"
          >
            Why choose V Design for your industry
          </h2>
        </header>

        <ul className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <li key={feature.title} className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                    feature.iconBg,
                  )}
                >
                  <Icon
                    className={cn("h-5 w-5", feature.accentClass)}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-luxury-text">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-luxury-muted">{feature.subtitle}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  return (
    <section
      className="w-full bg-white py-24 md:py-32"
      aria-labelledby="why-choose-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
            Why Choose V Design
          </p>
          <h2
            id="why-choose-heading"
            className="font-serif text-4xl text-luxury-text md:text-5xl"
          >
            Where Creativity Meets Commitment
          </h2>
        </header>

        <ul className="grid grid-cols-2 gap-8 text-center md:grid-cols-3 lg:grid-cols-6">
          {HOME_FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <li key={feature.title}>
                <div
                  className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-luxury-surface transition-transform duration-500 hover:scale-110"
                  aria-hidden="true"
                >
                  <Icon
                    className={cn("h-7 w-7", feature.accentClass)}
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="mb-2 font-serif text-lg text-luxury-text">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-luxury-muted">
                  {feature.subtitle}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
