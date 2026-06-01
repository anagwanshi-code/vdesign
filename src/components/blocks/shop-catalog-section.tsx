"use client";

import EcommerceGrid from "@/components/blocks/ecommerce-grid";
import ShopSidebar, {
  EMPTY_TYPE_FILTERS,
  type ShopTypeFilters,
} from "@/components/blocks/shop-sidebar";
import type { ShopProductItem } from "@/types/shop";
import { useMemo, useState } from "react";

const ALL_PRODUCTS_LABEL = "All Products";

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

  return (
    <section
      id="shop-catalog"
      className="mx-auto flex max-w-7xl flex-col px-6 py-16 lg:flex-row"
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
      <EcommerceGrid
        products={filteredProducts}
        totalCount={products.length}
      />
    </section>
  );
}
