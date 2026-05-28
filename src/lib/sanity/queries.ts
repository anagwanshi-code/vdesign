import { groq } from "next-sanity";
import { sanityFetch } from "@/lib/sanity/client";
import type {
  SanityCollection,
  SanityCollectionSummary,
  SanityHomePageQueryResult,
  SanityProduct,
} from "@/types/sanity";

const PRODUCT_CATALOG_FIELDS = groq`
  _id,
  title,
  "slug": slug.current,
  "priceInInr": coalesce(
    price,
    priceInInr,
    variants[] | order(priceInInr asc)[0].priceInInr,
    0
  ),
  compareAtPrice,
  subtitle,
  description,
  featured,
  status,
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
  seoTitle,
  seoDescription,
  sku,
  inStock,
  customizationNotes,
  "categoryRef": category._ref,
  "collectionRef": collection._ref,
  collection->{
    _id,
    title,
    "slug": slug.current
  },
  image {
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
  },
  images[] {
    _key,
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
  },
  gallery[] {
    _key,
    caption,
    image {
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
  },
  "gallery": coalesce(
    images[1..999] {
      "_key": _key,
      "image": {
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
    },
    gallery[] {
      _key,
      caption,
      image {
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
    }
  ),
  availableSizes[]->{
    _id,
    title,
    "slug": slug.current,
    dimensionsLabel,
    widthInches,
    heightInches,
    aspectRatio,
    sortOrder
  },
  sizeLabels,
  availableFrames[]->{
    _id,
    title,
    "slug": slug.current,
    frameType,
    finish,
    description,
    sortOrder
  },
  frameLabels,
  variants[] {
    _key,
    sizeLabel,
    frameLabel,
    priceInInr,
    compareAtPriceInInr,
    sku,
    inStock,
    size->{
      _id,
      title,
      "slug": slug.current,
      dimensionsLabel,
      widthInches,
      heightInches,
      aspectRatio,
      sortOrder
    },
    frame->{
      _id,
      title,
      "slug": slug.current,
      frameType,
      finish,
      description,
      sortOrder
    }
  }
`;

export const HOME_PAGE_WITH_CATALOG_QUERY = groq`
{
  "editorial": *[_type == "homePage" && _id == "homePageV2"][0] {
    hero {
      eyebrow,
      headline,
      subheadline,
      heroImages[] {
        _key,
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
      },
      media {
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
      },
      ctaPrimary {
        label,
        href
      },
      ctaSecondary {
        label,
        href
      }
    },
    services[] {
      _key,
      title,
      description,
      vertical,
      accent,
      href,
      coverImage {
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
    },
    featuredCollections[]->{
      _id,
      title,
      "slug": slug.current,
      description,
      heroImage {
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
      },
      coverImage {
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
      },
      "coverImageUrl": coverImage.asset->url,
      "heroImageUrl": heroImage.asset->url,
      "firstProductImage": coalesce(
        products[0]->image.asset->url,
        products[0]->images[0].asset->url,
        products[0]->gallery[0].image.asset->url,
        *[
          _type == "product" &&
          collection._ref == ^._id &&
          coalesce(status, "active") != "archived"
        ] | order(_createdAt desc)[0].image.asset->url,
        *[
          _type == "product" &&
          collection._ref == ^._id &&
          coalesce(status, "active") != "archived"
        ] | order(_createdAt desc)[0].images[0].asset->url
      )
    }
  },
  "products": *[
    _type == "product" &&
    coalesce(status, "active") != "archived" &&
    defined(collection._ref)
  ] | order(_createdAt desc) {
    ${PRODUCT_CATALOG_FIELDS}
  }
}
`;

export const ALL_COLLECTIONS_QUERY = groq`
*[_type == "collection"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  heroImage {
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
  },
  coverImage {
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
  },
  "coverImageUrl": coverImage.asset->url,
  "heroImageUrl": heroImage.asset->url,
  "firstProductImage": coalesce(
    products[0]->image.asset->url,
    products[0]->images[0].asset->url,
    products[0]->gallery[0].image.asset->url,
    *[
      _type == "product" &&
      references(^._id) &&
      coalesce(status, "active") != "archived"
    ] | order(_createdAt desc)[0].image.asset->url,
    *[
      _type == "product" &&
      references(^._id) &&
      coalesce(status, "active") != "archived"
    ] | order(_createdAt desc)[0].images[0].asset->url,
    *[
      _type == "product" &&
      collection._ref == ^._id &&
      coalesce(status, "active") != "archived"
    ] | order(_createdAt desc)[0].image.asset->url,
    *[
      _type == "product" &&
      collection._ref == ^._id &&
      coalesce(status, "active") != "archived"
    ] | order(_createdAt desc)[0].images[0].asset->url
  ),
  "productCount": count(*[_type == "product" && collection._ref == ^._id && coalesce(status, "active") != "archived"])
}
`;

export const COLLECTION_BY_SLUG_QUERY = groq`
*[_type == "collection" && lower(slug.current) == lower($slug)][0] {
  _id,
  title,
  "slug": slug.current,
  description,
  heroImage {
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
  },
  coverImage {
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
  },
  "heroImageUrl": heroImage.asset->url,
  "coverImageUrl": coverImage.asset->url,
  "firstProductImage": coalesce(
    products[0]->image.asset->url,
    products[0]->images[0].asset->url,
    products[0]->gallery[0].image.asset->url,
    *[
      _type == "product" &&
      collection._ref == ^._id &&
      coalesce(status, "active") != "archived"
    ] | order(_createdAt desc)[0].image.asset->url,
    *[
      _type == "product" &&
      collection._ref == ^._id &&
      coalesce(status, "active") != "archived"
    ] | order(_createdAt desc)[0].images[0].asset->url
  ),
  "products": *[
    _type == "product" &&
    coalesce(status, "active") != "archived" &&
    defined(collection._ref) &&
    (collection._ref == ^._id || _id in ^.products[]._ref)
  ] | order(_createdAt desc) {
    ${PRODUCT_CATALOG_FIELDS}
  }
}
`;


export const PRODUCT_BY_SLUG_QUERY = groq`
*[_type == "product" && slug.current == $slug][0] {
  ${PRODUCT_CATALOG_FIELDS}
}
`;


export async function getHomePageWithCatalog(): Promise<SanityHomePageQueryResult> {
  try {
    return await sanityFetch<SanityHomePageQueryResult>(
      HOME_PAGE_WITH_CATALOG_QUERY,
    );
  } catch (error) {
    console.error("[Sanity] Failed to fetch home page with catalog:", error);
    return null;
  }
}

/** @deprecated Use getHomePageWithCatalog */
export async function getHomePageContent(): Promise<SanityHomePageQueryResult> {
  return getHomePageWithCatalog();
}

export const HOME_PAGE_QUERY = HOME_PAGE_WITH_CATALOG_QUERY;

export async function getProductBySlug(
  slug: string,
): Promise<SanityProduct | null> {
  const normalizedSlug = slug.toLowerCase().trim();

  try {
    console.log("[Sanity] getProductBySlug:", normalizedSlug);

    return await sanityFetch<SanityProduct | null>(PRODUCT_BY_SLUG_QUERY, {
      slug: normalizedSlug,
    });
  } catch (error) {
    console.error("[Sanity] Failed to fetch product by slug:", error);
    return null;
  }
}

export async function getAllCollections(): Promise<
  SanityCollectionSummary[] | null
> {
  try {
    return await sanityFetch<SanityCollectionSummary[]>(ALL_COLLECTIONS_QUERY);
  } catch (error) {
    console.error("[Sanity] Failed to fetch collections:", error);
    return null;
  }
}

export async function getCollectionBySlug(
  slug: string,
): Promise<SanityCollection | null> {
  const normalizedSlug = slug.trim();

  try {
    console.log("[Sanity] getCollectionBySlug:", normalizedSlug);

    return await sanityFetch<SanityCollection | null>(COLLECTION_BY_SLUG_QUERY, {
      slug: normalizedSlug,
    });
  } catch (error) {
    console.error("[Sanity] Failed to fetch collection by slug:", error);
    return null;
  }
}
