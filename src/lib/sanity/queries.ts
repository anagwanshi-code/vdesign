import { groq } from "next-sanity";
import { sanityFetch } from "@/lib/sanity/client";
import type { SanityHomePageQueryResult } from "@/types/sanity";

export const HOME_PAGE_WITH_CATALOG_QUERY = groq`
{
  "editorial": *[_type == "homePage"][0] {
    hero {
      eyebrow,
      headline,
      subheadline,
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
    }
  },
  "products": *[_type == "product"] | order(_createdAt desc)[0...4] {
    _id,
    title,
    "slug": slug.current,
    priceInInr,
    subtitle,
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
