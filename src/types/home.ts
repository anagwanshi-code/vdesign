import type { ProductSaleType } from "@/lib/commerce/sale-type";

export type HeroCta = {
  label: string;
  href: string;
};

export type HeroMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type HeroEditorialParams = {
  eyebrow: string;
  title: string;
  description: string;
  ctaPrimary: HeroCta;
  ctaSecondary: HeroCta;
  media: HeroMedia;
};

export type ServiceVertical = "packaging" | "ecommerce" | "agency";

export type ServiceAccent = "peacock" | "saffron" | "purple";

export type ServiceStory = {
  id: string;
  vertical: ServiceVertical;
  title: string;
  description: string;
  accent: ServiceAccent;
  href: string;
  coverImage?: HeroMedia;
};

export type ProductShowcaseItem = {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  priceLabel: string;
  priceInInr: number;
  saleType: ProductSaleType;
  minOrderQuantity: number;
  logoUploadRequired: boolean;
  finishingTags: string[];
  /** Plain-text description used for storefront search. */
  searchDescription?: string;
  image: HeroMedia;
  /** Legacy card payloads that only expose a flat image URL. */
  imageUrl?: string;
  hoverImage?: HeroMedia;
  collectionHandle?: string;
  source?: "sanity" | "mock";
};

export type CollectionCard = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  image: HeroMedia;
  /** Raw Sanity hero image for resolver fallbacks. */
  heroImage?: {
    alt?: string | null;
    asset?: { url?: string | null } | null;
  } | null;
  /** Optional cover image when schema uses `coverImage` instead of `heroImage`. */
  coverImage?: {
    alt?: string | null;
    asset?: { url?: string | null } | null;
  } | null;
  /** Auto-resolved from first product when no cover/hero is uploaded. */
  firstProductImage?: string | null;
  coverImageUrl?: string | null;
  heroImageUrl?: string | null;
  productCount: number;
};

export type HomePageData = {
  hero: HeroEditorialParams;
  services: ServiceStory[];
  products: ProductShowcaseItem[];
};

export type HomePageContentSource = "sanity" | "mock";

export type HomePageContentResult = HomePageData & {
  source: HomePageContentSource;
};
