import type { ShopProductItem } from "@/types/shop";

const TRUST_RATINGS = [4.8, 4.9] as const;
const TRUST_REVIEW_COUNTS = [42, 87, 128, 156] as const;

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getProductTrustDisplay(product: ShopProductItem): {
  rating: number;
  reviewCount: number;
} {
  if (
    typeof product.rating === "number" &&
    product.rating > 0 &&
    typeof product.reviewsCount === "number" &&
    product.reviewsCount > 0
  ) {
    return {
      rating: product.rating,
      reviewCount: product.reviewsCount,
    };
  }

  const hash = hashString(product._id || product.slug || product.title);
  return {
    rating: TRUST_RATINGS[hash % TRUST_RATINGS.length],
    reviewCount: TRUST_REVIEW_COUNTS[hash % TRUST_REVIEW_COUNTS.length],
  };
}

export function getProductCardDiscount(
  product: ShopProductItem,
): { percent: number; label: string } | null {
  const price = product.price ?? 0;
  if (price <= 0) {
    return null;
  }

  const compareAt = product.mrp ?? product.compareAtPrice ?? null;
  if (typeof compareAt === "number" && compareAt > price) {
    const percent = Math.round(((compareAt - price) / compareAt) * 100);
    if (percent > 0) {
      return { percent, label: `${percent}% OFF` };
    }
  }

  const volumePercent = product.maxVolumeDiscountPercent ?? 0;
  if (volumePercent > 0) {
    return { percent: volumePercent, label: `${volumePercent}% OFF` };
  }

  if (product.isOnSale && typeof compareAt === "number" && compareAt > price) {
    const percent = Math.round(((compareAt - price) / compareAt) * 100);
    if (percent > 0) {
      return { percent, label: `${percent}% OFF` };
    }
  }

  return null;
}

export function getProductCardCompareAtPrice(
  product: ShopProductItem,
): number | null {
  const price = product.price ?? 0;
  const compareAt = product.mrp ?? product.compareAtPrice ?? null;
  if (typeof compareAt === "number" && compareAt > price) {
    return compareAt;
  }
  return null;
}
