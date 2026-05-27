"use client";

import { useEffect } from "react";

/** Benign Sanity live-listener / event-source-polyfill reconnect noise. */
export const SANITY_SSE_KEEPALIVE_PATTERNS = [
  /No activity within \d+ milliseconds\.(?: .*)? Reconnecting\./,
  /No activity within \d+ milliseconds/i,
  /EventSource reconnect/i,
  /event-source-polyfill/i,
] as const;

function isSanitySseKeepAliveError(value: unknown): boolean {
  const message =
    value instanceof Error
      ? value.message
      : typeof value === "string"
        ? value
        : value &&
            typeof value === "object" &&
            "message" in value &&
            typeof (value as { message: unknown }).message === "string"
          ? (value as { message: string }).message
          : String(value);

  return SANITY_SSE_KEEPALIVE_PATTERNS.some((pattern) => pattern.test(message));
}

let suppressSanitySseDevOverlayInitialized = false;

/**
 * Installs dev-only guards before Sanity Studio mounts. Idempotent and safe to
 * call from module scope or a React effect.
 */
export function initSuppressSanitySseDevOverlay(): void {
  if (
    typeof window === "undefined" ||
    process.env.NODE_ENV !== "development" ||
    suppressSanitySseDevOverlayInitialized
  ) {
    return;
  }

  suppressSanitySseDevOverlayInitialized = true;

  const handleWindowError = (event: ErrorEvent) => {
    if (isSanitySseKeepAliveError(event.error ?? event.message)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    if (isSanitySseKeepAliveError(event.reason)) {
      event.preventDefault();
    }
  };

  const originalConsoleError = console.error.bind(console);

  console.error = (...args: unknown[]) => {
    if (args.some((arg) => isSanitySseKeepAliveError(arg))) {
      return;
    }

    originalConsoleError(...args);
  };

  window.addEventListener("error", handleWindowError, true);
  window.addEventListener(
    "unhandledrejection",
    handleUnhandledRejection,
    true,
  );
}

/**
 * Suppresses Sanity Studio's benign SSE keep-alive reconnect errors from the
 * Next.js dev overlay. Safe to call on every studio mount; no-op in production.
 */
export function useSuppressSanitySseDevOverlay(): void {
  useEffect(() => {
    initSuppressSanitySseDevOverlay();
  }, []);
}
