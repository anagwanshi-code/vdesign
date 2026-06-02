"use client";

import type { ReactNode } from "react";

/** @deprecated Cart state is global via Zustand — provider no longer required. */
export function CartProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
