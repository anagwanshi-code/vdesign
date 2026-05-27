import { MOCK_HOME_PAGE_DATA, resolveHomePageContent } from "@/lib/data/home";
import { isSanityConfigured } from "@/lib/sanity/client";
import { mapSanityCatalogToShowcaseItems } from "@/lib/sanity/mappers";
import { getHomePageWithCatalog } from "@/lib/sanity/queries";
import type { ProductShowcaseItem } from "@/types/home";

export async function resolveAllCatalogProducts(): Promise<{
  products: ProductShowcaseItem[];
  source: "sanity" | "mock";
}> {
  const mock = MOCK_HOME_PAGE_DATA.products;

  if (!isSanityConfigured()) {
    return { products: mock, source: "mock" };
  }

  try {
    const content = await getHomePageWithCatalog();

    if (content?.products?.length) {
      return {
        products: mapSanityCatalogToShowcaseItems(
          content.products,
          MOCK_HOME_PAGE_DATA.hero.media,
        ),
        source: "sanity",
      };
    }
  } catch (error) {
    console.error("[Catalog] Fallback to mock products:", error);
  }

  return { products: mock, source: "mock" };
}

export function filterCatalogProducts(
  products: ProductShowcaseItem[],
  query: string,
): ProductShowcaseItem[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  return products.filter((product) => {
    const haystack = [
      product.title,
      product.subtitle,
      product.searchDescription,
      product.handle,
      product.priceLabel,
      ...product.finishingTags,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
