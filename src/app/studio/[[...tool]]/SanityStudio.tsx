"use client";

import {
  initSuppressSanitySseDevOverlay,
  useSuppressSanitySseDevOverlay,
} from "@/lib/sanity/suppress-studio-sse-dev-overlay";
import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

initSuppressSanitySseDevOverlay();

export default function SanityStudio() {
  useSuppressSanitySseDevOverlay();

  return <NextStudio config={config} scheme="dark" />;
}
