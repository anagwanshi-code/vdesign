import { cn } from "@/lib/utils/cn";
import type { HomeStatItem } from "@/types/home";

const DEFAULT_STATS: HomeStatItem[] = [
  { value: "18+", label: "Years Experience" },
  { value: "5000+", label: "Projects Delivered" },
  { value: "100+", label: "Business Partners" },
  { value: "25+", label: "Awards & Recognition" },
];

type HeroTrustStatsProps = {
  stats?: HomeStatItem[];
  className?: string;
};

export function HeroTrustStats({ stats = [], className }: HeroTrustStatsProps) {
  const items =
    stats.length > 0
      ? stats.filter((item) => item.value?.trim() || item.label?.trim())
      : DEFAULT_STATS;

  if (items.length === 0) {
    return null;
  }

  return (
    <ul
      className={cn(
        "mt-6 grid w-full grid-cols-2 gap-3 animate-fade-in-up md:grid-cols-4 md:gap-4",
        className,
      )}
      aria-label="Trust highlights"
    >
      {items.map((stat) => (
        <li key={`${stat.value}-${stat.label}`}>
          <div
            className={cn(
              "group flex h-full flex-col items-center justify-center rounded-2xl border border-pink-300/60 bg-gradient-to-br from-white/95 to-pink-50/90 px-3 py-3.5 text-center shadow-[0_6px_28px_rgba(233,30,99,0.12)] ring-1 ring-white/90 backdrop-blur-md transition-all duration-300",
              "hover:-translate-y-2 hover:border-pink-400/70 hover:shadow-xl hover:shadow-pink-500/20",
              "md:rounded-xl md:px-2 md:py-4",
            )}
          >
            <p className="font-serif text-2xl font-bold leading-none text-pink-600 md:text-3xl">
              {stat.value}
            </p>
            <p className="mt-1.5 text-[10px] font-medium uppercase leading-snug tracking-[0.14em] text-gray-500 md:mt-2 md:text-[11px] md:tracking-[0.16em]">
              {stat.label}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
