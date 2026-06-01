import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Shared hover lift for primary gradient CTAs */
export const premiumCtaHoverClass =
  "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl";
