import type { SanitySiteSettings } from "@/types/sanity";
import { DEFAULT_SHIPPING_INR } from "./totals";

export type ShippingConfig = {
  isShippingComplimentary: boolean;
  flatShippingRate: number;
};

export const DEFAULT_SHIPPING_CONFIG: ShippingConfig = {
  isShippingComplimentary: true,
  flatShippingRate: DEFAULT_SHIPPING_INR,
};

export function resolveShippingConfig(
  settings: Pick<
    SanitySiteSettings,
    "isShippingComplimentary" | "flatShippingRate"
  > | null | undefined,
): ShippingConfig {
  return {
    isShippingComplimentary: settings?.isShippingComplimentary ?? true,
    flatShippingRate: settings?.flatShippingRate ?? DEFAULT_SHIPPING_INR,
  };
}

export function shippingConfigToTotalsOptions(config: ShippingConfig) {
  return {
    isShippingComplimentary: config.isShippingComplimentary,
    flatShippingRate: config.flatShippingRate,
  };
}
