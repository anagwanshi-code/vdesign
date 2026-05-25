import { createClient as createSanityClient } from "@sanity/client";
import { createClient, type SanityClient } from "next-sanity";

export const SANITY_API_VERSION = "2024-05-24";

export const SANITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";

export const SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export function isSanityConfigured(): boolean {
  return Boolean(SANITY_PROJECT_ID && SANITY_DATASET);
}

export function createSanityReadClient(): SanityClient | null {
  if (!isSanityConfigured()) {
    return null;
  }

  return createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    useCdn: true,
  });
}

/** Direct `@sanity/client` factory for mutations, previews, or webhook handlers. */
export function createSanityApiClient(options?: {
  token?: string;
  useCdn?: boolean;
}) {
  if (!isSanityConfigured()) {
    return null;
  }

  return createSanityClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    useCdn: options?.useCdn ?? true,
    token: options?.token,
  });
}

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T | null> {
  const client = createSanityReadClient();

  if (!client) {
    return null;
  }

  return client.fetch<T>(query, params);
}
