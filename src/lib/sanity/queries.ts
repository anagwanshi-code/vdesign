import { groq } from "next-sanity";
import { sanityFetch } from "@/lib/sanity/client";
import type { CollectionIndexItem } from "@/types/collection";
import type {
  SanityCollection,
  SanityCollectionSummary,
  SanityHomePageQueryResult,
  SanityProduct,
  SanitySiteSettings,
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
  "mrp": coalesce(mrp, compareAtPrice),
  "moq": coalesce(moq, minOrderQuantity, minimumOrderQuantity, 1),
  allowCustomUpload,
  volumeDiscounts[] {
    minQuantity,
    discountPercentage
  },
  premiumAddons[] {
    addonName,
    extraPrice
  },
  subtitle,
  description,
  featured,
  occasion,
  isNewArrival,
  isOnSale,
  isCustomizable,
  status,
  saleType,
  "minOrderQuantity": coalesce(moq, minOrderQuantity, minimumOrderQuantity, 1),
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
  "imageUrl": image.asset->url,
  "galleryUrls": array::compact(
    coalesce(gallery[]{"url": coalesce(asset->url, image.asset->url)}.url, [])
    + coalesce(gallery[].asset->url, [])
    + coalesce(images[].asset->url, [])
    + coalesce(productGallery[].asset->url, [])
  ),
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
    "image": {
      "alt": coalesce(alt, image.alt),
      "asset": coalesce(
        asset->{
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        },
        image.asset->{
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        }
      )
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
      "image": {
        "alt": coalesce(alt, image.alt),
        "asset": coalesce(
          asset->{
            url,
            metadata {
              dimensions {
                width,
                height
              }
            }
          },
          image.asset->{
            url,
            metadata {
              dimensions {
                width,
                height
              }
            }
          }
        )
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
    heroHeadingRegular,
    heroHeadingCursive,
    heroHeading,
    "heroHeadingRegular": coalesce(heroHeadingRegular, heroHeading),
    heroSubheading,
    trustStripHeading,
    heroStats[] {
      numberValue,
      label,
      value
    },
    homeStats[] {
      value,
      label
    },
    "brandLogosTitle": coalesce(trustStripHeading, brandLogosTitle),
    "clientLogoUrls": coalesce(clientLogos, brandLogos)[].asset->url,
    "brandLogoUrls": coalesce(clientLogos, brandLogos)[].asset->url,
    hero {
      eyebrow,
      headline,
      subheadline,
      "heroImageUrls": heroImages[].asset->url,
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
    },
    featuredProducts[]->{
      ${PRODUCT_CATALOG_FIELDS}
    },
    aboutStudio {
      eyebrow,
      headline,
      description,
      ctaLabel,
      ctaLink,
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

/** Lightweight projection for the premium /collections index page. */
export const COLLECTIONS_INDEX_QUERY = groq`
*[_type == "collection"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  "image": coalesce(
    coverImage.asset->url,
    heroImage.asset->url
  ),
  "alt": coalesce(coverImage.alt, heroImage.alt)
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
  ${PRODUCT_CATALOG_FIELDS},
  "galleryUrls": array::compact(
    coalesce(gallery[]{"url": coalesce(asset->url, image.asset->url)}.url, [])
    + coalesce(gallery[].asset->url, [])
    + coalesce(images[].asset->url, [])
    + coalesce(productGallery[].asset->url, [])
  )
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

export const SITE_SETTINGS_QUERY = groq`
*[_type == "siteSettings"][0] {
  socialLinks[] {
    _key,
    platform,
    url
  },
  contactEmail,
  copyrightText,
  announcements,
  isShippingComplimentary,
  flatShippingRate
}
`;

export async function getAnnouncementMessages(): Promise<string[]> {
  const settings = await getSiteSettings();
  const fromCms =
    settings?.announcements
      ?.map((line) => line?.trim())
      .filter((line): line is string => Boolean(line)) ?? [];
  return fromCms;
}

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  try {
    return await sanityFetch<SanitySiteSettings | null>(SITE_SETTINGS_QUERY);
  } catch (error) {
    console.error("[Sanity] Failed to fetch site settings:", error);
    return null;
  }
}

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

export async function getCollectionsForIndex(): Promise<
  CollectionIndexItem[] | null
> {
  try {
    return await sanityFetch<CollectionIndexItem[]>(COLLECTIONS_INDEX_QUERY);
  } catch (error) {
    console.error("[Sanity] Failed to fetch collections index:", error);
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
