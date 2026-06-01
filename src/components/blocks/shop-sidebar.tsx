"use client";

import { cn } from "@/lib/utils/cn";
import { useState } from "react";

const ALL_PRODUCTS_LABEL = "All Products";

const TYPE_FILTERS = [
  { label: "Best Sellers", key: "bestSellers" as const },
  { label: "New Arrivals", key: "newArrivals" as const },
  { label: "On Sale", key: "onSale" as const },
  { label: "Customizable", key: "customizable" as const },
] as const;

export type ShopTypeFilterKey = (typeof TYPE_FILTERS)[number]["key"];

export type ShopTypeFilters = Record<ShopTypeFilterKey, boolean>;

export const EMPTY_TYPE_FILTERS: ShopTypeFilters = {
  bestSellers: false,
  newArrivals: false,
  onSale: false,
  customizable: false,
};

const OCCASION_OPTIONS = [
  { title: "Wedding", value: "wedding" },
  { title: "Corporate", value: "corporate" },
  { title: "Festival", value: "festival" },
  { title: "Personal", value: "personal" },
] as const;

type ShopSidebarProps = {
  categories: { _id?: string; title: string; slug?: string }[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  typeFilters?: ShopTypeFilters;
  onTypeFiltersChange?: (filters: ShopTypeFilters) => void;
  occasions?: string[];
  onOccasionsChange?: (occasions: string[]) => void;
};

export default function ShopSidebar({
  categories,
  activeCategory: controlledCategory,
  onCategoryChange,
  typeFilters: controlledTypeFilters,
  onTypeFiltersChange,
  occasions: controlledOccasions,
  onOccasionsChange,
}: ShopSidebarProps) {
  const [internalCategory, setInternalCategory] = useState(ALL_PRODUCTS_LABEL);
  const [internalTypeFilters, setInternalTypeFilters] =
    useState<ShopTypeFilters>(EMPTY_TYPE_FILTERS);
  const [internalOccasions, setInternalOccasions] = useState<string[]>([]);

  const activeCategory = controlledCategory ?? internalCategory;
  const setActiveCategory = onCategoryChange ?? setInternalCategory;
  const typeFilters = controlledTypeFilters ?? internalTypeFilters;
  const setTypeFilters = onTypeFiltersChange ?? setInternalTypeFilters;
  const occasions = controlledOccasions ?? internalOccasions;
  const setOccasions = onOccasionsChange ?? setInternalOccasions;

  const categoryList = [
    { key: "all", title: ALL_PRODUCTS_LABEL },
    ...categories.map((category) => ({
      key: category._id ?? category.title,
      title: category.title,
    })),
  ];

  const toggleOccasion = (value: string) => {
    setOccasions(
      occasions.includes(value)
        ? occasions.filter((item) => item !== value)
        : [...occasions, value],
    );
  };

  const toggleTypeFilter = (key: ShopTypeFilterKey) => {
    setTypeFilters({ ...typeFilters, [key]: !typeFilters[key] });
  };

  const clearFilters = () => {
    setTypeFilters(EMPTY_TYPE_FILTERS);
    setOccasions([]);
  };

  const hasActiveFilters =
    Object.values(typeFilters).some(Boolean) || occasions.length > 0;

  return (
    <aside className="flex w-full flex-col gap-8 pr-0 lg:w-1/4 lg:pr-8">
      <div>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-royal-magenta">
          Categories
        </h2>
        <ul>
          {categoryList.map((category) => (
            <li key={category.key}>
              <button
                type="button"
                onClick={() => setActiveCategory(category.title)}
                className={cn(
                  "w-full cursor-pointer border-b border-zinc-100 py-2 text-left text-sm transition-colors",
                  activeCategory === category.title
                    ? "rounded-md bg-royal-magenta/10 px-2 font-medium text-royal-magenta"
                    : "text-luxury-muted hover:text-royal-magenta",
                )}
              >
                {category.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-royal-magenta">
          Filter By
        </h2>

        <div className="mb-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-luxury-text">
            Price Range
          </p>
          <div
            className="relative h-1.5 rounded-full bg-zinc-200"
            aria-hidden="true"
          >
            <div className="absolute inset-y-0 left-[8%] right-[25%] rounded-full bg-royal-magenta" />
            <span className="absolute left-[8%] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-royal-magenta shadow" />
            <span className="absolute right-[25%] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-royal-magenta shadow" />
          </div>
          <p className="mt-3 text-xs text-luxury-muted">₹ 100 - ₹ 10,000</p>
        </div>

        <fieldset className="mb-6">
          <legend className="mb-3 text-xs font-medium uppercase tracking-wider text-luxury-text">
            Filter By Type
          </legend>
          <ul className="space-y-2">
            {TYPE_FILTERS.map(({ label, key }) => (
              <li key={key}>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-luxury-muted">
                  <input
                    type="checkbox"
                    checked={typeFilters[key]}
                    onChange={() => toggleTypeFilter(key)}
                    className="h-4 w-4 rounded border-zinc-300 text-royal-magenta focus:ring-royal-magenta"
                  />
                  {label}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset className="mb-6">
          <legend className="mb-3 text-xs font-medium uppercase tracking-wider text-luxury-text">
            Occasion
          </legend>
          <ul className="space-y-2">
            {OCCASION_OPTIONS.map(({ title, value }) => (
              <li key={value}>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-luxury-muted">
                  <input
                    type="checkbox"
                    checked={occasions.includes(value)}
                    onChange={() => toggleOccasion(value)}
                    className="h-4 w-4 rounded border-zinc-300 text-royal-magenta focus:ring-royal-magenta"
                  />
                  {title}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="w-full rounded-lg border border-zinc-200 py-3 text-sm font-semibold text-luxury-text transition-colors hover:border-royal-magenta hover:text-royal-magenta"
          >
            Clear Filters
          </button>
        ) : null}
      </div>
    </aside>
  );
}
