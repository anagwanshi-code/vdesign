import { isSanityConfigured, sanityFetch } from "@/lib/sanity/client";
import {
  ALL_CATEGORIES_QUERY,
  ALL_PRODUCTS_QUERY,
} from "@/sanity/lib/queries";
import type { ShopCatalogData, ShopCategoryItem, ShopProductItem } from "@/types/shop";

export async function resolveShopCatalog(): Promise<ShopCatalogData> {
  if (!isSanityConfigured()) {
    return { products: [], categories: [], source: "empty" };
  }

  try {
    const [products, categories] = await Promise.all([
      sanityFetch<ShopProductItem[]>(ALL_PRODUCTS_QUERY),
      sanityFetch<ShopCategoryItem[]>(ALL_CATEGORIES_QUERY),
    ]);

    return {
      products: products ?? [],
      categories: categories ?? [],
      source: "sanity",
    };
  } catch (error) {
    console.error("[resolveShopCatalog] Sanity fetch failed:", error);
    return { products: [], categories: [], source: "empty" };
  }
}
