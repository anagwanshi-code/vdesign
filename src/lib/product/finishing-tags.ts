import type { ProductShowcaseItem } from "@/types/home";
import type { SanityProduct } from "@/types/sanity";

type FinishingTagSource = Pick<
  SanityProduct,
  | "goldFoiling"
  | "embossing"
  | "spotUV"
  | "velvetLamination"
  | "paperGsm"
  | "paperType"
  | "techFinishingOptions"
  | "laminationType"
>;

/** Nested shape from Sanity GROQ or showcase payloads. */
export type FinishingTagProductInput =
  | FinishingTagSource
  | Pick<ProductShowcaseItem, "finishingTags">
  | {
      finishingTags?: string[];
      specifications?: {
        techFinishingOptions?: string[] | null;
      } | null;
      finishing?: {
        embossing?: boolean | null;
        spotUV?: boolean | null;
        goldFoiling?: boolean | null;
        velvetLamination?: boolean | null;
      } | null;
    };

export function buildFinishingTags(source: FinishingTagSource): string[] {
  const tags: string[] = [];

  if (source.goldFoiling) {
    tags.push("Gold Foiling");
  }

  if (source.embossing) {
    tags.push("Embossing");
  }

  if (source.spotUV) {
    tags.push("Spot UV");
  }

  if (source.velvetLamination) {
    tags.push("Velvet Lamination");
  }

  if (source.laminationType && source.laminationType !== "None") {
    tags.push(`${source.laminationType} Lamination`);
  }

  if (source.paperGsm) {
    tags.push(source.paperGsm);
  } else if (source.paperType) {
    tags.push(source.paperType);
  }

  for (const option of source.techFinishingOptions ?? []) {
    if (option && !tags.includes(option)) {
      tags.push(option);
    }
  }

  return tags.slice(0, 4);
}

export function buildFinishingTagsForShowcase(
  product: FinishingTagProductInput,
): string[] {
  if ("finishingTags" in product && product.finishingTags?.length) {
    return product.finishingTags;
  }

  const tags: string[] = [];

  if ("specifications" in product && product.specifications?.techFinishingOptions) {
    tags.push(...product.specifications.techFinishingOptions.filter(Boolean));
  }

  if ("finishing" in product && product.finishing) {
    if (product.finishing.embossing) {
      tags.push("Embossing");
    }

    if (product.finishing.spotUV) {
      tags.push("Spot UV");
    }

    if (product.finishing.goldFoiling) {
      tags.push("Gold Foiling");
    }

    if (product.finishing.velvetLamination) {
      tags.push("Velvet Lamination");
    }
  }

  if (tags.length > 0) {
    return Array.from(new Set(tags)).slice(0, 4);
  }

  const hasSanityFields =
    "goldFoiling" in product ||
    "embossing" in product ||
    "techFinishingOptions" in product;

  if (hasSanityFields) {
    return buildFinishingTags(product as FinishingTagSource);
  }

  return [];
}
