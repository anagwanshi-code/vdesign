function isValidSanityAssetUrl(url: string | null | undefined): string | null {
  if (typeof url !== "string") {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed || trimmed.includes("unsplash.com")) {
    return null;
  }

  return trimmed;
}

function assetUrlFromSanityImage(
  image: { asset?: { url?: string } } | null | undefined,
): string | null {
  return isValidSanityAssetUrl(image?.asset?.url);
}

/**
 * Collection cards: hero → cover → first linked product image (Sanity assets only).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveCollectionImageOrNull(item: any): string | null {
  if (!item) {
    return null;
  }

  const hero = assetUrlFromSanityImage(item.heroImage);
  if (hero) {
    return hero;
  }

  const cover = assetUrlFromSanityImage(item.coverImage);
  if (cover) {
    return cover;
  }

  const firstListedProduct = item.products?.[0];
  const fromProductImages = assetUrlFromSanityImage(
    firstListedProduct?.images?.[0],
  );
  if (fromProductImages) {
    return fromProductImages;
  }

  const fromProductPrimary = assetUrlFromSanityImage(firstListedProduct?.image);
  if (fromProductPrimary) {
    return fromProductPrimary;
  }

  return isValidSanityAssetUrl(item.firstProductImage);
}

/**
 * Product cards: primary image → gallery → legacy images array (Sanity assets only).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveProductCardImageOrNull(item: any): string | null {
  if (!item) {
    return null;
  }

  const primary = assetUrlFromSanityImage(item.image);
  if (primary) {
    return primary;
  }

  if (Array.isArray(item.gallery) && item.gallery.length > 0) {
    const fromGallery = assetUrlFromSanityImage(item.gallery[0]?.image);
    if (fromGallery) {
      return fromGallery;
    }
  }

  if (Array.isArray(item.images) && item.images.length > 0) {
    const fromImages = assetUrlFromSanityImage(item.images[0]);
    if (fromImages) {
      return fromImages;
    }
  }

  return null;
}

/** @deprecated Use {@link resolveProductCardImageOrNull}. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveProductCardImage(item: any): string | null {
  return resolveProductCardImageOrNull(item);
}

/** @deprecated Use {@link resolveCollectionImageOrNull}. */
export const resolveCollectionImage = resolveCollectionImageOrNull;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveProductCardAlt(item: any): string {
  return (
    item.image?.alt ??
    item.heroImage?.alt ??
    item.coverImage?.alt ??
    item.title ??
    "V Design Product"
  );
}

export const resolveCollectionAlt = resolveProductCardAlt;

/** Mapped storefront product cards — only Sanity CDN URLs on `image.asset`. */
export function resolveShowcaseItemImage(product: {
  title: string;
  image?: { src?: string; alt?: string };
}): string | null {
  if (!product.image?.src) {
    return null;
  }

  return resolveProductCardImageOrNull({
    title: product.title,
    image: { asset: { url: product.image.src }, alt: product.image.alt },
  });
}
