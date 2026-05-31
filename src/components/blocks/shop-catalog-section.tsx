"use client";

import EcommerceGrid from "@/components/blocks/ecommerce-grid";
import ShopSidebar from "@/components/blocks/shop-sidebar";
import { useMemo, useState } from "react";

const ALL_PRODUCTS_LABEL = "All Products";

type ShopCatalogSectionProps = {
  products: {
    _id: string;
    title: string;
    slug?: string;
    price?: number;
    rating?: number;
    reviewsCount?: number;
    isBestSeller?: boolean;
    imageUrl?: string | null;
    categoryName?: string | null;
    _createdAt?: string;
  }[];
  categories: { _id?: string; title: string; slug?: string }[];
};

export default function ShopCatalogSection({
  products,
  categories,
}: ShopCatalogSectionProps) {
  const [activeCategory, setActiveCategory] = useState(ALL_PRODUCTS_LABEL);
  const [productTypes, setProductTypes] = useState<string[]>([]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== ALL_PRODUCTS_LABEL) {
      result = result.filter((p) => p.categoryName === activeCategory);
    }

    if (productTypes.includes("Best Sellers")) {
      result = result.filter((p) => p.isBestSeller === true);
    }

    return result;
  }, [products, activeCategory, productTypes]);

  return (
    <section
      id="shop-catalog"
      className="mx-auto flex max-w-7xl flex-col px-6 py-16 lg:flex-row"
    >
      <ShopSidebar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        productTypes={productTypes}
        onProductTypesChange={setProductTypes}
      />
      <EcommerceGrid products={filteredProducts} totalCount={products.length} />
    </section>
  );
}
