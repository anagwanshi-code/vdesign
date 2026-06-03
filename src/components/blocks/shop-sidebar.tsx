"use client";

import {
  ShopFiltersPanel,
} from "@/components/shop/shop-filters-panel";
import type { ShopTypeFilters } from "@/components/blocks/shop-sidebar-constants";

export {
  ALL_PRODUCTS_LABEL,
  EMPTY_TYPE_FILTERS,
  OCCASION_OPTIONS,
  TYPE_FILTERS,
  type ShopTypeFilterKey,
  type ShopTypeFilters,
} from "@/components/blocks/shop-sidebar-constants";

type ShopSidebarProps = {
  categories: { _id?: string; title: string; slug?: string }[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  typeFilters?: ShopTypeFilters;
  onTypeFiltersChange?: (filters: ShopTypeFilters) => void;
  occasions?: string[];
  onOccasionsChange?: (occasions: string[]) => void;
};

export default function ShopSidebar(props: ShopSidebarProps) {
  const {
    categories,
    activeCategory,
    onCategoryChange,
    typeFilters,
    onTypeFiltersChange,
    occasions,
    onOccasionsChange,
  } = props;

  if (
    !activeCategory ||
    !onCategoryChange ||
    !typeFilters ||
    !onTypeFiltersChange ||
    !occasions ||
    !onOccasionsChange
  ) {
    return null;
  }

  return (
    <aside className="hidden w-full flex-col pr-0 lg:flex lg:w-1/4 lg:pr-8">
      <ShopFiltersPanel
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
        typeFilters={typeFilters}
        onTypeFiltersChange={onTypeFiltersChange}
        occasions={occasions}
        onOccasionsChange={onOccasionsChange}
      />
    </aside>
  );
}
