import { MOCK_HOME_PAGE_DATA } from "@/lib/data/home";
import { isSanityConfigured } from "@/lib/sanity/client";
import {
  mapSanityCatalogToShowcaseItems,
  mapSanityCollectionToCard,
} from "@/lib/sanity/mappers";
import { getAllCollections, getCollectionBySlug } from "@/lib/sanity/queries";
import type { CollectionCard, ProductShowcaseItem } from "@/types/home";

/** Normalizes URL segment to match `slug.current` in GROQ. */
export function normalizeCollectionSlug(slug: string): string {
  return decodeURIComponent(slug).toString().toLowerCase().trim();
}

const MOCK_COLLECTIONS: CollectionCard[] = [
  {
    id: "collection-signature",
    slug: "signature-edit",
    title: "Signature Edit",
    description: "Curated luxury pieces from the V Design atelier.",
    productCount: 3,
    image: MOCK_HOME_PAGE_DATA.hero.media,
    firstProductImage: undefined,
  },
];

export async function resolveAllCollections(): Promise<{
  collections: CollectionCard[];
  source: "sanity" | "mock";
}> {
  if (!isSanityConfigured()) {
    return { collections: MOCK_COLLECTIONS, source: "mock" };
  }

  try {
    const collections = await getAllCollections();

    if (!collections || collections.length === 0) {
      return { collections: MOCK_COLLECTIONS, source: "mock" };
    }

    return {
      collections: collections.map((collection) =>
        mapSanityCollectionToCard(collection, MOCK_HOME_PAGE_DATA.hero.media),
      ),
      source: "sanity",
    };
  } catch (error) {
    console.error("[Sanity] Collections fallback to mock:", error);
    return { collections: MOCK_COLLECTIONS, source: "mock" };
  }
}

export async function resolveCollectionBySlug(slug: string): Promise<{
  collection: CollectionCard | null;
  products: ProductShowcaseItem[];
  source: "sanity" | "mock";
}> {
  const normalizedSlug = normalizeCollectionSlug(slug);

  if (!isSanityConfigured()) {
    const collection = MOCK_COLLECTIONS.find(
      (entry) => normalizeCollectionSlug(entry.slug) === normalizedSlug,
    );

    return {
      collection: collection ?? null,
      products: collection
        ? MOCK_HOME_PAGE_DATA.products
        : [],
      source: "mock",
    };
  }

  try {
    const collection = await getCollectionBySlug(normalizedSlug);

    if (!collection) {
      return { collection: null, products: [], source: "sanity" };
    }

    const publishedProducts =
      collection.products?.filter(
        (product) => Boolean(product.collectionRef ?? product.collection?._id),
      ) ?? [];

    const card = mapSanityCollectionToCard(
      {
        _id: collection._id,
        title: collection.title,
        slug: collection.slug,
        description: collection.description,
        heroImage: collection.heroImage,
        coverImage: collection.coverImage,
        heroImageUrl: collection.heroImageUrl,
        coverImageUrl: collection.coverImageUrl,
        firstProductImage: collection.firstProductImage,
        productCount: publishedProducts.length,
      },
      MOCK_HOME_PAGE_DATA.hero.media,
    );

    const products = publishedProducts.length
      ? mapSanityCatalogToShowcaseItems(
          publishedProducts,
          MOCK_HOME_PAGE_DATA.hero.media,
        )
      : [];

    return { collection: card, products, source: "sanity" };
  } catch (error) {
    console.error("[Sanity] Collection page fallback:", error);
    return { collection: null, products: [], source: "mock" };
  }
}
