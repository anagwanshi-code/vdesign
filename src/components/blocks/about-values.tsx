import { SectionDivider } from "@/components/blocks/section-divider";
import { cn } from "@/lib/utils/cn";
import type { AboutValueItem } from "@/types/about";
import {
  Gem,
  HeartHandshake,
  Lightbulb,
  Scale,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ValueCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

const ICON_CYCLE: Pick<ValueCard, "icon" | "iconBg" | "iconColor">[] = [
  { icon: Lightbulb, iconBg: "bg-rose-50", iconColor: "text-royal-magenta" },
  { icon: Gem, iconBg: "bg-amber-50", iconColor: "text-saffron-gold" },
  { icon: HeartHandshake, iconBg: "bg-sky-50", iconColor: "text-peacock-blue" },
  { icon: Zap, iconBg: "bg-purple-50", iconColor: "text-royal-magenta" },
  { icon: Scale, iconBg: "bg-emerald-50", iconColor: "text-peacock-blue" },
];

const DEFAULT_VALUES: ValueCard[] = [
  {
    title: "Creativity",
    description:
      "Bold ideas and distinctive design that help your brand stand apart.",
    ...ICON_CYCLE[0],
  },
  {
    title: "Quality",
    description:
      "Meticulous standards across materials, print, and every client touchpoint.",
    ...ICON_CYCLE[1],
  },
  {
    title: "Commitment",
    description:
      "Dedicated partnership from first brief through delivery and beyond.",
    ...ICON_CYCLE[2],
  },
  {
    title: "Innovation",
    description:
      "Modern techniques and technology that elevate packaging and identity.",
    ...ICON_CYCLE[3],
  },
  {
    title: "Integrity",
    description:
      "Transparent processes, honest timelines, and work you can trust.",
    ...ICON_CYCLE[4],
  },
];

const DEFAULT_VALUES_TITLE = "The Principles That Define Us";

function buildValues(valuesList?: AboutValueItem[]): ValueCard[] {
  const items = valuesList?.filter((item) => item.title || item.description);
  if (!items?.length) return DEFAULT_VALUES;

  return items.map((item, index) => {
    const style = ICON_CYCLE[index % ICON_CYCLE.length];
    return {
      title: item.title?.trim() || "",
      description: item.description?.trim() || "",
      ...style,
    };
  });
}

type AboutValuesProps = {
  title?: string;
  valuesList?: AboutValueItem[];
};

export function AboutValues({ title, valuesList }: AboutValuesProps) {
  const values = buildValues(valuesList);
  const sectionTitle = title?.trim() || DEFAULT_VALUES_TITLE;

  return (
    <section
      className="w-full bg-luxury-surface py-24"
      aria-labelledby="about-values-heading"
    >
      <header className="mx-auto max-w-3xl px-6 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
          OUR VALUES
        </p>
        <h2
          id="about-values-heading"
          className="font-serif text-4xl text-luxury-text md:text-5xl"
        >
          {sectionTitle}
        </h2>
        <SectionDivider />
      </header>

      <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        {values.map((value) => {
          const Icon = value.icon;
          return (
            <article
              key={value.title}
              className="flex flex-col items-center rounded-2xl border border-gray-50 bg-white p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-transform duration-300 hover:-translate-y-1 lg:p-12"
            >
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full",
                  value.iconBg,
                )}
              >
                <Icon
                  className={cn("h-6 w-6", value.iconColor)}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <h3 className="mb-4 mt-8 font-serif text-2xl text-gray-900">
                {value.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-gray-600">
                {value.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
