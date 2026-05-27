import type { SanityProduct } from "@/types/sanity";

export type ProductSpecifications = {
  paperType?: string;
  printMethod?: string;
  machineType?: string;
  laminationType?: string;
  techFinishingOptions?: string[];
};

export function mapSanityProductSpecifications(
  product: SanityProduct,
): ProductSpecifications | null {
  const specifications: ProductSpecifications = {
    paperType: product.paperType ?? undefined,
    printMethod: product.printMethod ?? undefined,
    machineType: product.machineType ?? undefined,
    laminationType: product.laminationType ?? undefined,
    techFinishingOptions: product.techFinishingOptions?.filter(Boolean) ?? undefined,
  };

  const hasContent = Object.values(specifications).some((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return Boolean(value);
  });

  return hasContent ? specifications : null;
}

export function hasProductSpecifications(
  specifications: ProductSpecifications | null | undefined,
): specifications is ProductSpecifications {
  if (!specifications) {
    return false;
  }

  return Object.values(specifications).some((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return Boolean(value);
  });
}
