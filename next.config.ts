import type { NextConfig } from "next";

/** Benign Sanity live-listener SSE reconnect messages that loop Turbopack's dev overlay. */
const SANITY_SSE_DESCRIPTION =
  /No activity within \d+ milliseconds|Reconnecting\.|event-source-polyfill|EventSource reconnect/i;

const nextConfig: NextConfig = {
  transpilePackages: ["next-sanity"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  turbopack: {
    ignoreIssue: [
      {
        path: "**/studio/**",
        description: SANITY_SSE_DESCRIPTION,
      },
      {
        path: "**/sanity/**",
        description: SANITY_SSE_DESCRIPTION,
      },
      {
        path: /node_modules[\\/](?:@sanity|sanity|next-sanity|event-source-polyfill)/,
        description: SANITY_SSE_DESCRIPTION,
      },
      {
        path: "sanity.config.ts",
        description: SANITY_SSE_DESCRIPTION,
      },
    ],
  },
};

export default nextConfig;