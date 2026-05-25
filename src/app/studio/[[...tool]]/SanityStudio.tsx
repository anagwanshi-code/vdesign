"use client";

import { useSuppressSanitySseDevOverlay } from "@/lib/sanity/suppress-studio-sse-dev-overlay";
import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

export default function SanityStudio() {
  useSuppressSanitySseDevOverlay();

  return <NextStudio config={config} />;
}
