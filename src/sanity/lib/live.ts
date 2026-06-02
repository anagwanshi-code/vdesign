// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { getSanityReadClient } from "./client";

const sanityClient = getSanityReadClient();

if (!sanityClient) {
  throw new Error(
    "[Sanity Live] NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET must be set.",
  );
}

export const { sanityFetch, SanityLive } = defineLive({
  client: sanityClient,
});
