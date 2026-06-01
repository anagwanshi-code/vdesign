import { SectionDivider } from "@/components/blocks/section-divider";
import { cn } from "@/lib/utils/cn";
import type { ProductCategoryDocument } from "@/types/product-category";
import {
  Briefcase,
  Frame,
  Gift,
  Heart,
  Image as ImageIcon,
  Package,
  PenLine,
  ShoppingBag,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type CategoryCardStyle = {
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  iconColor: string;
};

const CARD_STYLES: CategoryCardStyle[] = [
  {
    icon: Frame,
    gradient: "from-rose-50 via-white to-amber-50",
    iconBg: "bg-rose-50",
    iconColor: "text-royal-magenta",
  },
  {
    icon: ImageIcon,
    gradient: "from-sky-50 via-zinc-50 to-peacock-blue/20",
    iconBg: "bg-sky-50",
    iconColor: "text-peacock-blue",
  },
  {
    icon: Gift,
    gradient: "from-purple-50 via-rose-50 to-white",
    iconBg: "bg-purple-50",
    iconColor: "text-royal-magenta",
  },
  {
    icon: Package,
    gradient: "from-amber-50 via-white to-rose-50",
    iconBg: "bg-amber-50",
    iconColor: "text-saffron-gold",
  },
  {
    icon: Heart,
    gradient: "from-rose-100/80 via-white to-peacock-blue/15",
    iconBg: "bg-rose-50",
    iconColor: "text-royal-magenta",
  },
  {
    icon: Briefcase,
    gradient: "from-zinc-100 via-sky-50 to-white",
    iconBg: "bg-sky-50",
    iconColor: "text-peacock-blue",
  },
  {
    icon: ShoppingBag,
    gradient: "from-peacock-blue/15 via-white to-saffron-gold/20",
    iconBg: "bg-emerald-50",
    iconColor: "text-peacock-blue",
  },
  {
    icon: PenLine,
    gradient: "from-purple-50/50 via-white to-amber-50",
    iconBg: "bg-purple-50",
    iconColor: "text-royal-magenta",
  },
  {
    icon: Sparkles,
    gradient: "from-royal-magenta/10 via-amber-50 to-peacock-blue/10",
    iconBg: "bg-amber-50",
    iconColor: "text-saffron-gold",
  },
];

function categoryHref(slug: string | null | undefined): string {
  const normalized = slug?.trim();
  if (!normalized) {
    return "/shop";
  }
  return `/shop?category=${encodeURIComponent(normalized)}`;
}

type ProductCategoriesProps = {
  categories?: ProductCategoryDocument[] | null;
};

export function ProductCategories({ categories }: ProductCategoriesProps) {
  const items =
    categories?.filter((item) => item.title?.trim()) ?? [];

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

      {items.length === 0 ? (
        <p className="mt-16 text-center text-luxury-muted">
          No categories yet. Add product categories in Sanity Studio to display
          them here.
        </p>
      ) : (
        <ul className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {items.map((category, index) => {
            const style = CARD_STYLES[index % CARD_STYLES.length];
            const Icon = style.icon;
            const slug = category.slug?.trim();
            const imageUrl = category.imageUrl?.trim();
            const description =
              category.description?.trim() ||
              "Explore premium print and packaging tailored to your needs.";

            return (
              <li key={category._id}>
                <Link
                  href={categoryHref(slug)}
                  className="group flex flex-row overflow-hidden rounded-2xl border border-zinc-50 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative w-2/5 min-w-[120px] overflow-hidden bg-zinc-50">
                    {imageUrl ? (
                      <div className="relative min-h-[140px] h-full w-full">
                        <Image
                          src={imageUrl}
                          alt={category.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="200px"
                          unoptimized={!imageUrl.startsWith("http")}
                        />
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "flex h-full min-h-[140px] w-full items-center justify-center bg-gradient-to-br transition-transform duration-700 group-hover:scale-105",
                          style.gradient,
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="flex w-3/5 flex-col justify-center p-6">
                    <div
                      className={cn(
                        "mb-3 flex h-9 w-9 items-center justify-center rounded-full",
                        style.iconBg,
                      )}
                    >
                      <Icon
                        className={cn("h-4 w-4", style.iconColor)}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mb-2 font-serif text-lg font-bold text-luxury-text">
                      {category.title}
                    </h3>
                    <p className="mb-4 line-clamp-3 text-xs text-luxury-muted">
                      {description}
                    </p>
                    <span className="text-sm font-semibold text-royal-magenta transition-colors group-hover:text-peacock-blue">
                      Explore Products →
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
