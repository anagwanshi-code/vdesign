type SanityImageLike = {
  asset?: {
    _ref?: string;
    url?: string;
  } | null;
} | null;

/**
 * Builds a Sanity CDN URL from an image asset ref (Studio form value).
 */
export function resolveStudioImageUrl(
  image: SanityImageLike,
  projectId: string,
  dataset: string,
): string | null {
  if (!image?.asset) {
    return null;
  }

  if (image.asset.url) {
    return image.asset.url;
  }

  const ref = image.asset._ref;

  if (!ref) {
    return null;
  }

  const match = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);

  if (!match) {
    return null;
  }

  const [, id, dimensions, format] = match;

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
}
