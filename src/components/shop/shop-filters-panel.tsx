"use client";

import {
  ALL_PRODUCTS_LABEL,
  EMPTY_TYPE_FILTERS,
  OCCASION_OPTIONS,
  TYPE_FILTERS,
  type ShopTypeFilters,
} from "@/components/blocks/shop-sidebar-constants";
import { cn } from "@/lib/utils/cn";

export { ALL_PRODUCTS_LABEL } from "@/components/blocks/shop-sidebar-constants";

type ShopFiltersPanelProps = {
  categories: { _id?: string; title: string; slug?: string }[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  typeFilters: ShopTypeFilters;
  onTypeFiltersChange: (filters: ShopTypeFilters) => void;
  occasions: string[];
  onOccasionsChange: (occasions: string[]) => void;
  sortBy?: string;
  onSortChange?: (value: string) => void;
  showSort?: boolean;
  compact?: boolean;
};

export function ShopFiltersPanel({
  categories,
  activeCategory,
  onCategoryChange,
  typeFilters,
  onTypeFiltersChange,
  occasions,
  onOccasionsChange,
  sortBy = "popularity",
  onSortChange,
  showSort = false,
  compact = false,
}: ShopFiltersPanelProps) {
  const categoryList = [
    { key: "all", title: ALL_PRODUCTS_LABEL },
    ...categories.map((category) => ({
      key: category._id ?? category.title,
      title: category.title,
    })),
  ];

  const toggleOccasion = (value: string) => {
    onOccasionsChange(
      occasions.includes(value)
        ? occasions.filter((item) => item !== value)
        : [...occasions, value],
    );
  };

  const toggleTypeFilter = (key: keyof ShopTypeFilters) => {
    onTypeFiltersChange({ ...typeFilters, [key]: !typeFilters[key] });
  };

  const clearFilters = () => {
    onTypeFiltersChange(EMPTY_TYPE_FILTERS);
    onOccasionsChange([]);
  };

  const hasActiveFilters =
    Object.values(typeFilters).some(Boolean) || occasions.length > 0;

  return (
    <div className={cn("flex flex-col", compact ? "gap-5" : "gap-8")}>
      {showSort && onSortChange ? (
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-royal-magenta">
            Sort
          </h2>
          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-royal-magenta focus:ring-1 focus:ring-royal-magenta"
          >
            <option value="popularity">Popularity</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      ) : null}

      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-royal-magenta">
          Categories
        </h2>
        <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-0">
          {categoryList.map((category) => (
            <li key={category.key} className="lg:w-full">
              <button
                type="button"
                onClick={() => onCategoryChange(category.title)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-left text-sm transition-colors lg:w-full lg:rounded-md lg:px-2 lg:py-2",
                  activeCategory === category.title
                    ? "bg-royal-magenta/10 font-medium text-royal-magenta"
                    : "border border-zinc-200 text-luxury-muted hover:text-royal-magenta lg:border-0 lg:border-b lg:border-zinc-100",
                )}
              >
                {category.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-royal-magenta">
          Filter By
        </h2>

        <fieldset className="mb-5">
          <legend className="mb-2 text-xs font-medium uppercase tracking-wider text-luxury-text">
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

        <fieldset className="mb-5">
          <legend className="mb-2 text-xs font-medium uppercase tracking-wider text-luxury-text">
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
    </div>
  );
}
