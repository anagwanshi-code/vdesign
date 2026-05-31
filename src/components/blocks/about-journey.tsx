"use client";

import { SectionDivider } from "@/components/blocks/section-divider";
import { cn } from "@/lib/utils/cn";
import type { AboutJourneyTimelineItem } from "@/types/about";
import {
  Award,
  Flag,
  Handshake,
  Rocket,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type JourneyMilestone = {
  year: string;
  text: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

const ICON_CYCLE: Pick<JourneyMilestone, "icon" | "iconBg" | "iconColor">[] = [
  { icon: Flag, iconBg: "bg-rose-50", iconColor: "text-royal-magenta" },
  { icon: Star, iconBg: "bg-amber-50", iconColor: "text-saffron-gold" },
  { icon: Trophy, iconBg: "bg-sky-50", iconColor: "text-peacock-blue" },
  { icon: Users, iconBg: "bg-purple-50", iconColor: "text-royal-magenta" },
  { icon: Rocket, iconBg: "bg-emerald-50", iconColor: "text-peacock-blue" },
  { icon: Award, iconBg: "bg-orange-50", iconColor: "text-saffron-gold" },
];

const DEFAULT_MILESTONES: JourneyMilestone[] = [
  {
    year: "2007",
    text: "V Design founded with a vision for premium print and branding.",
    ...ICON_CYCLE[0],
  },
  {
    year: "2010",
    text: "Expanded into luxury packaging for retail and hospitality brands.",
    ...ICON_CYCLE[1],
  },
  {
    year: "2014",
    text: "Recognized regionally for craftsmanship and consistent delivery.",
    ...ICON_CYCLE[2],
  },
  {
    year: "2018",
    text: "Built a multidisciplinary team across design, print, and digital.",
    ...ICON_CYCLE[3],
  },
  {
    year: "2021",
    text: "Launched integrated brand systems for national and global clients.",
    ...ICON_CYCLE[4],
  },
  {
    year: "2024+",
    text: "Scaling innovation in sustainable luxury and experiential retail.",
    ...ICON_CYCLE[5],
  },
];

const DEFAULT_JOURNEY_TITLE = "A Journey of Passion & Creativity";

type StatItem = {
  value: string;
  label: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

const STATS: StatItem[] = [
  {
    value: "5000+",
    label: "Projects",
    icon: Trophy,
    iconBg: "bg-rose-100",
    iconColor: "text-royal-magenta",
  },
  {
    value: "18+",
    label: "Years",
    icon: Star,
    iconBg: "bg-amber-100",
    iconColor: "text-saffron-gold",
  },
  {
    value: "100+",
    label: "Partners",
    icon: Handshake,
    iconBg: "bg-sky-100",
    iconColor: "text-peacock-blue",
  },
  {
    value: "25+",
    label: "Awards",
    icon: Award,
    iconBg: "bg-purple-100",
    iconColor: "text-royal-magenta",
  },
];

function buildMilestones(
  timeline?: AboutJourneyTimelineItem[],
): JourneyMilestone[] {
  const items = timeline?.filter((item) => item.year || item.description);
  if (!items?.length) return DEFAULT_MILESTONES;

  return items.map((item, index) => {
    const style = ICON_CYCLE[index % ICON_CYCLE.length];
    return {
      year: item.year?.trim() || "",
      text: item.description?.trim() || "",
      ...style,
    };
  });
}

type AboutJourneyProps = {
  title?: string;
  timeline?: AboutJourneyTimelineItem[];
};

export function AboutJourney({ title, timeline }: AboutJourneyProps) {
  const milestones = buildMilestones(timeline);
  const sectionTitle = title?.trim() || DEFAULT_JOURNEY_TITLE;

  return (
    <section
      className="w-full bg-white py-24"
      aria-labelledby="about-journey-heading"
    >
      <header className="mx-auto max-w-3xl px-6 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
          OUR JOURNEY
        </p>
        <h2
          id="about-journey-heading"
          className="font-serif text-4xl text-luxury-text md:text-5xl"
        >
          {sectionTitle}
        </h2>
        <SectionDivider />
      </header>

      <div className="relative mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        {milestones.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.year}-${item.text}`}
              className="flex flex-col items-center text-center"
            >
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full",
                  item.iconBg,
                )}
              >
                <Icon
                  className={cn("h-6 w-6", item.iconColor)}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <p className="mb-4 mt-6 text-2xl font-bold text-royal-magenta">
                {item.year}
              </p>
              <p className="px-4 text-sm leading-relaxed text-gray-600 md:text-base">
                {item.text}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-24 grid max-w-6xl grid-cols-2 gap-8 divide-x divide-zinc-100 rounded-3xl border border-zinc-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] md:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-4 px-2 md:px-4"
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                  stat.iconBg,
                )}
              >
                <Icon
                  className={cn("h-5 w-5", stat.iconColor)}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <div className="text-left">
                <p className="font-serif text-2xl font-bold text-luxury-text md:text-3xl">
                  {stat.value}
                </p>
                <p className="text-sm uppercase tracking-wider text-luxury-muted">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
