"use client";

import EcommerceGrid from "@/components/blocks/ecommerce-grid";
import ShopSidebar, {
  EMPTY_TYPE_FILTERS,
  type ShopTypeFilters,
} from "@/components/blocks/shop-sidebar";
import { ALL_PRODUCTS_LABEL, ShopFiltersPanel } from "@/components/shop/shop-filters-panel";
import type { ShopProductItem } from "@/types/shop";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";

type ShopCatalogSectionProps = {
  products: ShopProductItem[];
  categories: { _id?: string; title: string; slug?: string }[];
  initialActiveCategory?: string;
};

function matchesTypeFilters(
  product: ShopProductItem,
  filters: ShopTypeFilters,
): boolean {
  if (filters.bestSellers && !product.isBestSeller) {
    return false;
  }
  if (filters.newArrivals && !product.isNewArrival) {
    return false;
  }
  if (filters.onSale && !product.isOnSale) {
    return false;
  }
  if (filters.customizable && !product.isCustomizable) {
    return false;
  }
  return true;
}

function matchesOccasionFilter(
  product: ShopProductItem,
  selectedOccasions: string[],
): boolean {
  if (selectedOccasions.length === 0) {
    return true;
  }

  return (
    product.occasion?.some((occ) => selectedOccasions.includes(occ)) ?? false
  );
}

export default function ShopCatalogSection({
  products,
  categories,
  initialActiveCategory,
}: ShopCatalogSectionProps) {
  const [activeCategory, setActiveCategory] = useState(
    initialActiveCategory?.trim() || ALL_PRODUCTS_LABEL,
  );
  const [typeFilters, setTypeFilters] =
    useState<ShopTypeFilters>(EMPTY_TYPE_FILTERS);
  const [occasions, setOccasions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (
        activeCategory !== ALL_PRODUCTS_LABEL &&
        product.categoryName !== activeCategory
      ) {
        return false;
      }

      if (!matchesTypeFilters(product, typeFilters)) {
        return false;
      }

      if (!matchesOccasionFilter(product, occasions)) {
        return false;
      }

      return true;
    });
  }, [products, activeCategory, typeFilters, occasions]);

  const activeFilterCount =
    Object.values(typeFilters).filter(Boolean).length + occasions.length;

  return (
    <section
      id="shop-catalog"
      className="mx-auto flex max-w-7xl flex-col px-4 py-6 md:px-6 md:py-16 lg:flex-row"
    >
      <ShopSidebar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        typeFilters={typeFilters}
        onTypeFiltersChange={setTypeFilters}
        occasions={occasions}
        onOccasionsChange={setOccasions}
      />

      <div className="w-full lg:w-3/4">
        <div className="mb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((open) => !open)}
            className="flex w-full items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm"
            aria-expanded={mobileFiltersOpen}
            aria-controls="shop-mobile-filters"
          >
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-pink-600" aria-hidden="true" />
              Filter & Sort
              {activeFilterCount > 0 ? (
                <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold uppercase text-pink-700">
                  {activeFilterCount}
                </span>
              ) : null}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-gray-500 transition-transform",
                mobileFiltersOpen && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>

          {mobileFiltersOpen ? (
            <div
              id="shop-mobile-filters"
              className="mt-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <ShopFiltersPanel
                compact
                showSort
                sortBy={sortBy}
                onSortChange={setSortBy}
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                typeFilters={typeFilters}
                onTypeFiltersChange={setTypeFilters}
                occasions={occasions}
                onOccasionsChange={setOccasions}
              />
            </div>
          ) : null}
        </div>

        <EcommerceGrid
          products={filteredProducts}
          totalCount={products.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
          hideMobileSort
        />
      </div>
    </section>
  );
}
