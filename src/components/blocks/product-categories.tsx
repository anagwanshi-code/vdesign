import { SectionDivider } from "@/components/blocks/section-divider";
import { cn } from "@/lib/utils/cn";
import {
  Briefcase,
  Frame,
  Gift,
  Heart,
  Image,
  Package,
  PenLine,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type CategoryItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  iconColor: string;
  href: string;
};

const CATEGORIES: CategoryItem[] = [
  {
    title: "Paper Photo Frames",
    description:
      "Elegant frames for portraits, events, and retail displays with premium finishes.",
    icon: Frame,
    gradient: "from-rose-50 via-white to-amber-50",
    iconBg: "bg-rose-50",
    iconColor: "text-royal-magenta",
    href: "/consultation",
  },
  {
    title: "Portfolio Albums",
    description:
      "Layflat and case-bound albums crafted for photographers and luxury brands.",
    icon: Image,
    gradient: "from-sky-50 via-zinc-50 to-peacock-blue/20",
    iconBg: "bg-sky-50",
    iconColor: "text-peacock-blue",
    href: "/consultation",
  },
  {
    title: "Invitation Boxes",
    description:
      "Keepsake boxes and suites for weddings, celebrations, and corporate events.",
    icon: Gift,
    gradient: "from-purple-50 via-rose-50 to-white",
    iconBg: "bg-purple-50",
    iconColor: "text-royal-magenta",
    href: "/consultation",
  },
  {
    title: "Packaging Boxes",
    description:
      "Rigid and folding cartons tailored for retail, gifting, and product launches.",
    icon: Package,
    gradient: "from-amber-50 via-white to-rose-50",
    iconBg: "bg-amber-50",
    iconColor: "text-saffron-gold",
    href: "/consultation",
  },
  {
    title: "Wedding Printing",
    description:
      "Invitations, menus, signage, and collateral with couture-level detail.",
    icon: Heart,
    gradient: "from-rose-100/80 via-white to-peacock-blue/15",
    iconBg: "bg-rose-50",
    iconColor: "text-royal-magenta",
    href: "/consultation",
  },
  {
    title: "Corporate Branding Kits",
    description:
      "Unified stationery, folders, and launch kits for professional brand presence.",
    icon: Briefcase,
    gradient: "from-zinc-100 via-sky-50 to-white",
    iconBg: "bg-sky-50",
    iconColor: "text-peacock-blue",
    href: "/consultation",
  },
  {
    title: "Luxury Shopping Bags",
    description:
      "Reinforced bags with foil, embossing, and ribbon details for premium retail.",
    icon: ShoppingBag,
    gradient: "from-peacock-blue/15 via-white to-saffron-gold/20",
    iconBg: "bg-emerald-50",
    iconColor: "text-peacock-blue",
    href: "/consultation",
  },
  {
    title: "Stationery Products",
    description:
      "Letterheads, envelopes, notecards, and desk sets with refined typography.",
    icon: PenLine,
    gradient: "from-purple-50/50 via-white to-amber-50",
    iconBg: "bg-purple-50",
    iconColor: "text-royal-magenta",
    href: "/consultation",
  },
  {
    title: "Custom Orders",
    description:
      "Bespoke formats, materials, and finishes when your vision goes beyond the catalog.",
    icon: Sparkles,
    gradient: "from-royal-magenta/10 via-amber-50 to-peacock-blue/10",
    iconBg: "bg-amber-50",
    iconColor: "text-saffron-gold",
    href: "/consultation",
  },
];

export function ProductCategories() {
  return (
    <section
      id="categories"
      className="mx-auto max-w-7xl px-6 py-24"
      aria-labelledby="product-categories-heading"
    >
      <header className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
          SHOP BY CATEGORY
        </p>
        <h2
          id="product-categories-heading"
          className="font-serif text-4xl text-luxury-text md:text-5xl"
        >
          Our Product Categories
        </h2>
        <SectionDivider />
      </header>

      <ul className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <li key={category.title}>
              <Link
                href={category.href}
                className="group flex flex-row overflow-hidden rounded-2xl border border-zinc-50 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative w-2/5 overflow-hidden bg-zinc-50">
                  <div
                    className={cn(
                      "flex h-full min-h-[140px] w-full items-center justify-center bg-gradient-to-br transition-transform duration-700 group-hover:scale-105",
                      category.gradient,
                    )}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex w-3/5 flex-col justify-center p-6">
                  <div
                    className={cn(
                      "mb-3 flex h-9 w-9 items-center justify-center rounded-full",
                      category.iconBg,
                    )}
                  >
                    <Icon
                      className={cn("h-4 w-4", category.iconColor)}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mb-2 font-serif text-lg font-bold text-luxury-text">
                    {category.title}
                  </h3>
                  <p className="mb-4 line-clamp-3 text-xs text-luxury-muted">
                    {category.description}
                  </p>
                  <span className="text-sm font-semibold text-royal-magenta">
                    Explore Products →
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
