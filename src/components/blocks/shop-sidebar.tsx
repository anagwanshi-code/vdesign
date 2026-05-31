"use client";

import { cn } from "@/lib/utils/cn";
import { useState } from "react";

const ALL_PRODUCTS_LABEL = "All Products";

const PRODUCT_TYPES = [
  "Best Sellers",
  "New Arrivals",
  "On Sale",
  "Customizable",
] as const;

const OCCASIONS = ["Wedding", "Corporate", "Festival", "Personal"] as const;

type ShopSidebarProps = {
  categories: { _id?: string; title: string; slug?: string }[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  productTypes?: string[];
  onProductTypesChange?: (types: string[]) => void;
};

export default function ShopSidebar({
  categories,
  activeCategory: controlledCategory,
  onCategoryChange,
  productTypes: controlledProductTypes,
  onProductTypesChange,
}: ShopSidebarProps) {
  const [internalCategory, setInternalCategory] = useState(ALL_PRODUCTS_LABEL);
  const [internalProductTypes, setInternalProductTypes] = useState<string[]>([]);
  const [occasions, setOccasions] = useState<string[]>([]);

  const activeCategory = controlledCategory ?? internalCategory;
  const setActiveCategory = onCategoryChange ?? setInternalCategory;
  const productTypes = controlledProductTypes ?? internalProductTypes;
  const setProductTypes = onProductTypesChange ?? setInternalProductTypes;

  const categoryList = [
    { key: "all", title: ALL_PRODUCTS_LABEL },
    ...categories.map((category) => ({
      key: category._id ?? category.title,
      title: category.title,
    })),
  ];

  const toggleFilter = (
    value: string,
    list: string[],
    setter: (next: string[]) => void,
  ) => {
    setter(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value],
    );
  };

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
            Product Type
          </legend>
          <ul className="space-y-2">
            {PRODUCT_TYPES.map((type) => (
              <li key={type}>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-luxury-muted">
                  <input
                    type="checkbox"
                    checked={productTypes.includes(type)}
                    onChange={() =>
                      toggleFilter(type, productTypes, setProductTypes)
                    }
                    className="h-4 w-4 rounded border-zinc-300 text-royal-magenta focus:ring-royal-magenta"
                  />
                  {type}
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
            {OCCASIONS.map((occasion) => (
              <li key={occasion}>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-luxury-muted">
                  <input
                    type="checkbox"
                    checked={occasions.includes(occasion)}
                    onChange={() =>
                      toggleFilter(occasion, occasions, setOccasions)
                    }
                    className="h-4 w-4 rounded border-zinc-300 text-royal-magenta focus:ring-royal-magenta"
                  />
                  {occasion}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <button
          type="button"
          className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          Apply Filters
        </button>
      </div>
    </aside>
  );
}
