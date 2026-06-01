"use client";

import { SectionDivider } from "@/components/blocks/section-divider";
import { cn } from "@/lib/utils/cn";
import type {
  AboutJourneyStatItem,
  AboutJourneyTimelineItem,
} from "@/types/about";
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

const TIMELINE_ICON_CYCLE: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}[] = [
  { icon: Flag, iconBg: "bg-rose-50", iconColor: "text-royal-magenta" },
  { icon: Star, iconBg: "bg-amber-50", iconColor: "text-saffron-gold" },
  { icon: Trophy, iconBg: "bg-sky-50", iconColor: "text-peacock-blue" },
  { icon: Users, iconBg: "bg-purple-50", iconColor: "text-royal-magenta" },
  { icon: Rocket, iconBg: "bg-emerald-50", iconColor: "text-peacock-blue" },
  { icon: Award, iconBg: "bg-orange-50", iconColor: "text-saffron-gold" },
];

const STAT_ICON_CYCLE: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}[] = [
  { icon: Trophy, iconBg: "bg-rose-100", iconColor: "text-royal-magenta" },
  { icon: Star, iconBg: "bg-amber-100", iconColor: "text-saffron-gold" },
  { icon: Handshake, iconBg: "bg-sky-100", iconColor: "text-peacock-blue" },
  { icon: Award, iconBg: "bg-purple-100", iconColor: "text-royal-magenta" },
];

type AboutJourneyProps = {
  title: string;
  timeline: AboutJourneyTimelineItem[];
  journeyStats: AboutJourneyStatItem[];
};

export function AboutJourney({
  title,
  timeline,
  journeyStats,
}: AboutJourneyProps) {
  const milestones = timeline
    .map((item, index) => ({
      year: item.year?.trim() || "",
      text: item.description?.trim() || "",
      index,
    }))
    .filter((item) => item.year || item.text);

  const stats = journeyStats
    .slice(0, 4)
    .map((item, index) => ({
      value: item.value?.trim() || "",
      label: item.label?.trim() || "",
      index,
    }))
    .filter((item) => item.value || item.label);

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
          {title}
        </h2>
        <SectionDivider />
      </header>

      {milestones.length > 0 ? (
        <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-4">
          {milestones.map((item) => {
            const style =
              TIMELINE_ICON_CYCLE[item.index % TIMELINE_ICON_CYCLE.length];
            const Icon = style.icon;

            return (
              <article
                key={`${item.year}-${item.text}-${item.index}`}
                className="flex flex-col items-center rounded-2xl border border-zinc-100 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div
                  className={cn(
                    "mb-6 flex h-14 w-14 items-center justify-center rounded-full",
                    style.iconBg,
                  )}
                >
                  <Icon
                    className={cn("h-6 w-6", style.iconColor)}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
                {item.year ? (
                  <p className="mb-4 text-3xl font-bold text-royal-magenta">
                    {item.year}
                  </p>
                ) : null}
                {item.text ? (
                  <p className="text-sm leading-relaxed text-luxury-muted md:text-base">
                    {item.text}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <p className="mx-auto mt-12 max-w-lg px-6 text-center text-luxury-muted">
          Add timeline events in About Page Content (Sanity Studio) to showcase
          your journey here.
        </p>
      )}

      {stats.length > 0 ? (
        <div className="mx-auto mt-24 grid max-w-6xl grid-cols-2 gap-8 rounded-3xl border border-zinc-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] md:grid-cols-4">
          {stats.map((item) => {
            const style = STAT_ICON_CYCLE[item.index % STAT_ICON_CYCLE.length];
            const Icon = style.icon;

            return (
              <div
                key={`${item.value}-${item.label}-${item.index}`}
                className="flex items-center gap-4"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                    style.iconBg,
                  )}
                >
                  <Icon
                    className={cn("h-5 w-5", style.iconColor)}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0 text-left">
                  {item.value ? (
                    <p className="font-serif text-2xl font-bold text-luxury-text md:text-3xl">
                      {item.value}
                    </p>
                  ) : null}
                  {item.label ? (
                    <p className="text-sm uppercase tracking-wider text-luxury-muted">
                      {item.label}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
