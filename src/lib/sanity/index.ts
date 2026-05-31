export {
  createSanityApiClient,
  createSanityReadClient,
  isSanityConfigured,
  sanityFetch,
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID,
} from "./client";

export {
  getAllCollections,
  getCollectionsForIndex,
  getCollectionBySlug,
  getHomePageContent,
  getHomePageWithCatalog,
  getProductBySlug,
  ALL_COLLECTIONS_QUERY,
  COLLECTIONS_INDEX_QUERY,
  COLLECTION_BY_SLUG_QUERY,
  HOME_PAGE_QUERY,
  HOME_PAGE_WITH_CATALOG_QUERY,
  PRODUCT_BY_SLUG_QUERY,
} from "./queries";

export {
  mapSanityCatalogToShowcaseItems,
  mapSanityCollectionToCard,
  mapSanityHeroToEditorial,
  mapSanityHomePageToEditorial,
  mapSanityHomePageWithCatalog,
  mapSanityProductToDetail,
  mapSanityProductToShowcaseItem,
} from "./mappers";
