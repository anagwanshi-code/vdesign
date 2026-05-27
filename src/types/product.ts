import type { ProductSaleType } from "@/lib/commerce/sale-type";
import type { ProductSpecifications } from "@/lib/product/specifications";
import type { HeroMedia } from "@/types/home";

export type ProductOption = {
  key: string;
  label: string;
};

export type ProductDetailVariant = {
  key: string;
  sizeKey: string;
  frameKey: string;
  priceInInr: number;
  compareAtPriceInInr?: number;
  sku?: string;
  inStock: boolean;
};

export type ProductDetail = {
  id: string;
  handle: string;
  title: string;
  subtitle?: string;
  description?: string;
  priceInInr: number;
  saleType: ProductSaleType;
  minOrderQuantity: number;
  logoUploadRequired: boolean;
  image: HeroMedia;
  gallery: HeroMedia[];
  sizes: ProductOption[];
  frames: ProductOption[];
  variants: ProductDetailVariant[];
  /** Sanity `category._ref` for similar-product queries (tried first). */
  categoryRef?: string;
  /** Sanity `collection._ref` — fallback when category matches are empty. */
  collectionRef?: string;
  collection?: {
    title: string;
    slug: string;
  };
  specifications?: ProductSpecifications | null;
};

export type SelectedProductVariant = {
  variantKey: string;
  sizeKey: string;
  frameKey: string;
  sizeLabel: string;
  frameLabel: string;
  priceInInr: number;
  priceLabel: string;
  compareAtPriceInInr?: number;
  sku?: string;
  inStock: boolean;
};

/** How complete the Studio variant matrix is for storefront purchase. */
export type ProductCatalogMode =
  | "base-only"
  | "configurable"
  | "building";

export type ProductPricingState = {
  mode: ProductCatalogMode;
  selected: SelectedProductVariant | null;
  displayPriceLabel: string;
  compareAtLabel?: string;
  isCombinationAvailable: boolean;
  canPurchase: boolean;
  statusMessage?: string;
  showSizeSelector: boolean;
  showFrameSelector: boolean;
};
