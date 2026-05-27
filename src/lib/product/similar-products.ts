import { MOCK_HOME_PAGE_DATA } from "@/lib/data/home";
import { isSanityConfigured, sanityFetch } from "@/lib/sanity/client";
import { mapSanityCatalogToShowcaseItems } from "@/lib/sanity/mappers";
import type { ProductShowcaseItem } from "@/types/home";
import type { SanityProduct } from "@/types/sanity";
import { groq } from "next-sanity";

const TARGET_COUNT = 4;

const SIMILAR_PRODUCT_FIELDS = groq`
  _id,
  title,
  "slug": slug.current,
  "priceInInr": coalesce(
    price,
    priceInInr,
    variants[] | order(priceInInr asc)[0].priceInInr,
    0
  ),
  subtitle,
  saleType,
  "minOrderQuantity": coalesce(minOrderQuantity, minimumOrderQuantity, 100),
  logoUploadRequired,
  paperType,
  printMethod,
  machineType,
  laminationType,
  techFinishingOptions,
  embossing,
  spotUV,
  goldFoiling,
  velvetLamination,
  paperGsm,
  collection->{
    _id,
    title,
    "slug": slug.current
  },
  images[] {
    alt,
    asset->{
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    }
  }
`;

const buildSimilarQuery = (filter: string) => groq`
*[
  _type == "product" &&
  coalesce(status, "active") != "archived" &&
  ${filter} &&
  !(_id in $fetchedIds) &&
  !(_id in path("drafts.**"))
][0...$limit] {
  ${SIMILAR_PRODUCT_FIELDS}
}
`;

const SIMILAR_BY_CATEGORY_QUERY = buildSimilarQuery(
  "category._ref == $categoryId",
);
const SIMILAR_BY_COLLECTION_QUERY = buildSimilarQuery(
  "collection._ref == $collectionId",
);
const SIMILAR_RECENT_QUERY = groq`
*[
  _type == "product" &&
  coalesce(status, "active") != "archived" &&
  !(_id in $fetchedIds) &&
  !(_id in path("drafts.**"))
] | order(_createdAt desc)[0...$limit] {
  ${SIMILAR_PRODUCT_FIELDS}
}
`;

function fillMockSimilarProducts(
  currentProductId: string,
  existing: ProductShowcaseItem[],
): ProductShowcaseItem[] {
  const seen = new Set([currentProductId, ...existing.map((p) => p.id)]);
  const pool = MOCK_HOME_PAGE_DATA.products.filter((p) => !seen.has(p.id));
  const merged = [...existing];

  for (const product of pool) {
    if (merged.length >= TARGET_COUNT) {
      break;
    }
    merged.push(product);
    seen.add(product.id);
  }

  return merged.slice(0, TARGET_COUNT);
}

async function fetchSimilarBatch(
  query: string,
  params: Record<string, unknown>,
): Promise<SanityProduct[]> {
  const products = await sanityFetch<SanityProduct[]>(query, params);
  return products ?? [];
}

function mapBatch(
  products: SanityProduct[],
  fallbackImage: (typeof MOCK_HOME_PAGE_DATA)["hero"]["media"],
): ProductShowcaseItem[] {
  return mapSanityCatalogToShowcaseItems(products, fallbackImage);
}

/**
 * Fill-the-gap similar products: category → collection → newest store items (always up to 4).
 */
export async function getSimilarProducts(
  currentProductId: string,
  categoryId?: string | null,
  collectionId?: string | null,
): Promise<ProductShowcaseItem[]> {
  const fallbackImage = MOCK_HOME_PAGE_DATA.hero.media;

  if (!isSanityConfigured()) {
    return fillMockSimilarProducts(currentProductId, []);
  }

  try {
    const fetchedIds: string[] = [currentProductId];
    const accumulated: SanityProduct[] = [];

    if (categoryId && accumulated.length < TARGET_COUNT) {
      const limit = TARGET_COUNT - accumulated.length;
      const categoryBatch = await fetchSimilarBatch(SIMILAR_BY_CATEGORY_QUERY, {
        categoryId,
        fetchedIds,
        limit,
      });

      accumulated.push(...categoryBatch);
      fetchedIds.push(...categoryBatch.map((product) => product._id));
    }

    if (collectionId && accumulated.length < TARGET_COUNT) {
      const limit = TARGET_COUNT - accumulated.length;
      const collectionBatch = await fetchSimilarBatch(
        SIMILAR_BY_COLLECTION_QUERY,
        {
          collectionId,
          fetchedIds,
          limit,
        },
      );

      accumulated.push(...collectionBatch);
      fetchedIds.push(...collectionBatch.map((product) => product._id));
    }

    if (accumulated.length < TARGET_COUNT) {
      const limit = TARGET_COUNT - accumulated.length;
      const recentBatch = await fetchSimilarBatch(SIMILAR_RECENT_QUERY, {
        fetchedIds,
        limit,
      });

      accumulated.push(...recentBatch);
    }

    const mapped = mapBatch(accumulated.slice(0, TARGET_COUNT), fallbackImage);

    if (mapped.length >= TARGET_COUNT) {
      return mapped;
    }

    return fillMockSimilarProducts(currentProductId, mapped);
  } catch (error) {
    console.error("[SimilarProducts] Failed to fetch:", error);
    return fillMockSimilarProducts(currentProductId, []);
  }
}
