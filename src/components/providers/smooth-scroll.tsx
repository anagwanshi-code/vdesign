"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type SmoothScrollProps = {
  children: ReactNode;
};

/** Native document scrolling — Lenis removed to avoid scroll hijacking and input lag. */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  const isStudioRoute = pathname.startsWith("/studio");
  const isAdminRoute = pathname.startsWith("/admin");

  if (isStudioRoute || isAdminRoute) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
