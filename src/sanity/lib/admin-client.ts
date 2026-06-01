import { createClient, type SanityClient } from "@sanity/client";

import { apiVersion, dataset, projectId } from "../env";

let adminClient: SanityClient | null = null;

export function isSanityAdminConfigured(): boolean {
  return Boolean(process.env.SANITY_API_TOKEN);
}

export function getSanityAdminClient(): SanityClient {
  const token = process.env.SANITY_API_TOKEN;

  if (!token) {
    throw new Error("Missing environment variable: SANITY_API_TOKEN");
  }

  if (!adminClient) {
    adminClient = createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
    });
  }

  return adminClient;
}
