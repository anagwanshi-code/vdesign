import { cn } from "@/lib/utils/cn";
import { Compass, Layers, Palette, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ProcessStep = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We listen to your brand goals, audience, and constraints to define a clear creative brief.",
    icon: Search,
  },
  {
    number: "02",
    title: "Strategy",
    description:
      "Positioning, formats, and production pathways are mapped before design begins.",
    icon: Compass,
  },
  {
    number: "03",
    title: "Design",
    description:
      "Concepts evolve through refined typography, color, structure, and tactile mockups.",
    icon: Palette,
  },
  {
    number: "04",
    title: "Production",
    description:
      "Print, finishing, and quality control bring every detail to life with precision.",
    icon: Layers,
  },
];

export function CreativeProcess() {
  return (
    <section
      className="w-full bg-white py-24 md:py-32"
      aria-labelledby="creative-process-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
            Our Process
          </p>
          <h2
            id="creative-process-heading"
            className="mb-6 font-serif text-4xl text-luxury-text md:text-5xl"
          >
            Built For Excellence
          </h2>
          <p className="text-lg text-luxury-muted">
            A simple, transparent and creative process that ensures the best
            results.
          </p>
        </header>

        <ol className="relative grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
          <div
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-8 hidden border-t border-dashed border-luxury-border md:block"
            aria-hidden="true"
          />

          {PROCESS_STEPS.map((step) => {
            const Icon = step.icon;

            return (
              <li key={step.number} className="relative text-center md:text-left">
                <span
                  className="pointer-events-none absolute -left-2 -top-4 z-0 font-serif text-6xl font-bold text-saffron-gold/20 md:-left-4"
                  aria-hidden="true"
                >
                  {step.number}
                </span>

                <div
                  className={cn(
                    "relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-luxury-surface text-royal-magenta md:mx-0",
                  )}
                >
                  <Icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
                </div>

                <h3 className="relative z-10 mb-2 font-serif text-xl text-luxury-text">
                  {step.title}
                </h3>
                <p className="relative z-10 text-sm leading-relaxed text-luxury-muted">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
