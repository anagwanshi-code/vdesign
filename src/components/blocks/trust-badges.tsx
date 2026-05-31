import { cn } from "@/lib/utils/cn";
import {
  Clock,
  Gem,
  Headphones,
  Palette,
  Printer,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type TrustBadge = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

const PRODUCTS_BADGES: TrustBadge[] = [
  {
    title: "Premium Quality",
    subtitle: "Finest Materials",
    icon: Gem,
    iconBg: "bg-rose-50",
    iconColor: "text-royal-magenta",
  },
  {
    title: "Custom Designs",
    subtitle: "Tailored for You",
    icon: Palette,
    iconBg: "bg-amber-50",
    iconColor: "text-saffron-gold",
  },
  {
    title: "Advanced Printing",
    subtitle: "High Definition",
    icon: Printer,
    iconBg: "bg-sky-50",
    iconColor: "text-peacock-blue",
  },
  {
    title: "Timely Delivery",
    subtitle: "On-time Promise",
    icon: Clock,
    iconBg: "bg-purple-50",
    iconColor: "text-royal-magenta",
  },
  {
    title: "Nationwide Shipping",
    subtitle: "Across India",
    icon: Truck,
    iconBg: "bg-emerald-50",
    iconColor: "text-peacock-blue",
  },
];

const CONTACT_BADGES: TrustBadge[] = [
  {
    title: "Quick Response",
    subtitle: "Replies within 24 hours",
    icon: Zap,
    iconBg: "bg-rose-50",
    iconColor: "text-royal-magenta",
  },
  {
    title: "Expert Support",
    subtitle: "Dedicated design consultants",
    icon: Headphones,
    iconBg: "bg-sky-50",
    iconColor: "text-peacock-blue",
  },
  {
    title: "Confidential",
    subtitle: "Your brief stays private",
    icon: ShieldCheck,
    iconBg: "bg-purple-50",
    iconColor: "text-royal-magenta",
  },
  {
    title: "Trusted Partner",
    subtitle: "18+ years of client care",
    icon: Gem,
    iconBg: "bg-amber-50",
    iconColor: "text-saffron-gold",
  },
  {
    title: "Timely Delivery",
    subtitle: "Clear timelines & updates",
    icon: Clock,
    iconBg: "bg-emerald-50",
    iconColor: "text-peacock-blue",
  },
];

type TrustBadgesProps = {
  variant?: "products" | "contact";
};

export function TrustBadges({ variant = "products" }: TrustBadgesProps) {
  const badges = variant === "contact" ? CONTACT_BADGES : PRODUCTS_BADGES;

  return (
    <section
      className="w-full border-y border-zinc-100 bg-white py-8"
      aria-label="Trust highlights"
    >
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <li key={badge.title} className="flex min-w-[200px] flex-1 items-center gap-4">
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
                  badge.iconBg,
                )}
              >
                <Icon
                  className={cn("h-5 w-5", badge.iconColor)}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-luxury-text">
                  {badge.title}
                </p>
                <p className="text-xs text-luxury-muted">{badge.subtitle}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
