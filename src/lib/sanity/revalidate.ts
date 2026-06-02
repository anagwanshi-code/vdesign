/** ISR interval for Sanity-backed pages and fetches (seconds). */
export const SANITY_REVALIDATE_SECONDS = 30;

export const SANITY_FETCH_OPTIONS = {
  next: { revalidate: SANITY_REVALIDATE_SECONDS },
} as const;
