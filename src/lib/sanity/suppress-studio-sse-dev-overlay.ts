"use client";

import { useEffect } from "react";

/** Matches event-source-polyfill heartbeat reconnect noise from Sanity live listeners. */
const SANITY_SSE_KEEPALIVE_ERROR =
  /No activity within \d+ milliseconds\.(?: .*)? Reconnecting\./;

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

  return SANITY_SSE_KEEPALIVE_ERROR.test(message);
}

/**
 * Suppresses Sanity Studio's benign SSE keep-alive reconnect errors from the
 * Next.js dev overlay. Safe to call on every studio mount; no-op in production.
 */
export function useSuppressSanitySseDevOverlay(): void {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

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

    return () => {
      window.removeEventListener("error", handleWindowError, true);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
        true,
      );
      console.error = originalConsoleError;
    };
  }, []);
}
