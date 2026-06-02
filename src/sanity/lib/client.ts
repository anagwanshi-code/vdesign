import {
  createSanityReadClient,
  isSanityConfigured,
  sanityFetch,
  SANITY_REVALIDATE_SECONDS,
} from "@/lib/sanity/client";
import type { QueryParams, SanityClient } from "next-sanity";

export { sanityFetch, SANITY_REVALIDATE_SECONDS, isSanityConfigured };

type SanityFetchFn = <T>(
  query: string,
  params?: QueryParams,
) => Promise<T>;

/** Minimal ISR-aware read client for GROQ queries. */
export type SanityReadClient = {
  fetch: SanityFetchFn;
  withConfig: () => { fetch: SanityFetchFn };
};

/**
 * ISR-aware Sanity reads. Prefer `sanityFetch()` for new code.
 * `client.fetch()` is wrapped to apply the same revalidation window.
 */
export const client: SanityReadClient = {
  fetch<T>(query: string, params: QueryParams = {}): Promise<T> {
    return sanityFetch<T>(query, params as Record<string, unknown>) as Promise<T>;
  },
  withConfig() {
    return {
      fetch<T>(query: string, params: QueryParams = {}): Promise<T> {
        return sanityFetch<T>(
          query,
          params as Record<string, unknown>,
        ) as Promise<T>;
      },
    };
  },
};

/** Underlying next-sanity client when a full SanityClient instance is required. */
export function getSanityReadClient(): SanityClient | null {
  return createSanityReadClient();
}
