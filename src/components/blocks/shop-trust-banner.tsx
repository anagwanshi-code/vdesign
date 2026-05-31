import { cn } from "@/lib/utils/cn";
import {
  Clock,
  Gem,
  Package,
  Palette,
  Percent,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ITEMS: {
  title: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}[] = [
  {
    title: "Premium Quality",
    icon: Gem,
    iconBg: "bg-rose-50",
    iconColor: "text-royal-magenta",
  },
  {
    title: "Custom Designs",
    icon: Palette,
    iconBg: "bg-amber-50",
    iconColor: "text-saffron-gold",
  },
  {
    title: "Secure Packaging",
    icon: Package,
    iconBg: "bg-sky-50",
    iconColor: "text-peacock-blue",
  },
  {
    title: "Timely Delivery",
    icon: Clock,
    iconBg: "bg-purple-50",
    iconColor: "text-royal-magenta",
  },
  {
    title: "Bulk Discounts",
    icon: Percent,
    iconBg: "bg-emerald-50",
    iconColor: "text-peacock-blue",
  },
];

export function ShopTrustBanner() {
  return (
    <div className="w-full border-y border-zinc-100 bg-luxury-surface/50 py-4">
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-6 md:justify-between md:gap-4">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.title}
              className="flex items-center gap-2 text-xs font-semibold text-luxury-text md:text-sm"
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  item.iconBg,
                )}
              >
                <Icon
                  className={cn("h-4 w-4", item.iconColor)}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </span>
              {item.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
