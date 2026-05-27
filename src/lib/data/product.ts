import { MOCK_HOME_PAGE_DATA } from "@/lib/data/home";
import { isSanityConfigured } from "@/lib/sanity/client";
import { mapSanityProductToDetail } from "@/lib/sanity/mappers";
import { getProductBySlug } from "@/lib/sanity/queries";
import type { ProductSpecifications } from "@/lib/product/specifications";
import type { ProductDetail } from "@/types/product";
import type { ProductShowcaseItem } from "@/types/home";

const MOCK_PRODUCT_SPECIFICATIONS: Record<string, ProductSpecifications> = {
  "jaipur-rigid-box": {
    paperType: "350 GSM Ivory",
    printMethod: "Offset Printing",
    machineType: "Heidelberg Offset",
    laminationType: "Velvet",
    techFinishingOptions: ["Gold Foiling", "Spot UV", "Die Cutting"],
  },
};

function mapShowcaseItemToDetail(item: ProductShowcaseItem): ProductDetail {
  return {
    id: item.id,
    handle: item.handle,
    title: item.title,
    subtitle: item.subtitle,
    priceInInr: item.priceInInr,
    saleType: item.saleType,
    minOrderQuantity: item.minOrderQuantity,
    logoUploadRequired: item.logoUploadRequired,
    specifications: MOCK_PRODUCT_SPECIFICATIONS[item.handle] ?? null,
    image: item.image,
    gallery: item.hoverImage ? [item.hoverImage] : [],
    sizes: [],
    frames: [],
    variants: [],
  };
}

export async function resolveProductByHandle(
  handle: string,
): Promise<ProductDetail | null> {
  const mockMatch = MOCK_HOME_PAGE_DATA.products.find(
    (product) => product.handle === handle,
  );

  if (!isSanityConfigured()) {
    return mockMatch ? mapShowcaseItemToDetail(mockMatch) : null;
  }

  try {
    const product = await getProductBySlug(
      handle.toString().toLowerCase().trim(),
    );

    if (product) {
      return mapSanityProductToDetail(
        product,
        MOCK_HOME_PAGE_DATA.hero.media,
      );
    }
  } catch (error) {
    console.error("[Sanity] Product fallback to mock data:", error);
  }

  return mockMatch ? mapShowcaseItemToDetail(mockMatch) : null;
}
