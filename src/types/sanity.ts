/** Sanity CMS — content schema types for editorial + ecommerce catalog. */

export type SanityImageDimensions = {
  width: number;
  height: number;
};

export type SanityImageAsset = {
  url: string;
  metadata?: {
    dimensions?: SanityImageDimensions | null;
  } | null;
};

export type SanityImage = {
  alt?: string | null;
  asset?: SanityImageAsset | null;
};

export type SanityCta = {
  label: string;
  href: string;
};

export type SanityHeroBlock = {
  eyebrow?: string | null;
  headline: string;
  subheadline?: string | null;
  media?: SanityImage | null;
  ctaPrimary?: SanityCta | null;
  ctaSecondary?: SanityCta | null;
};

export type SanityServiceVertical = "packaging" | "ecommerce" | "agency";

export type SanityServiceAccent = "peacock" | "saffron" | "purple";

export type SanityService = {
  _key: string;
  title: string;
  description: string;
  vertical?: SanityServiceVertical | null;
  accent?: SanityServiceAccent | null;
  href?: string | null;
  coverImage?: SanityImage | null;
};

export type SanityHomePage = {
  hero: SanityHeroBlock | null;
  services: SanityService[] | null;
};

export type SanityProductSize = {
  _id: string;
  title: string;
  slug: string;
  dimensionsLabel: string;
  widthInches: number;
  heightInches: number;
  aspectRatio?: string | null;
  sortOrder?: number | null;
};

export type SanityProductFrame = {
  _id: string;
  title: string;
  slug: string;
  frameType: string;
  finish: string;
  description?: string | null;
  sortOrder?: number | null;
};

export type SanityProductVariant = {
  _key: string;
  size?: SanityProductSize | null;
  sizeLabel?: string | null;
  frame?: SanityProductFrame | null;
  frameLabel?: string | null;
  priceInInr: number;
  compareAtPriceInInr?: number | null;
  sku?: string | null;
  inStock?: boolean | null;
};

export type SanityProductGalleryImage = {
  _key: string;
  image: SanityImage;
  caption?: string | null;
};

export type SanityCollection = {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
  heroImage?: SanityImage | null;
  coverImage?: SanityImage | null;
  heroImageUrl?: string | null;
  coverImageUrl?: string | null;
  firstProductImage?: string | null;
  products?: SanityProduct[] | null;
};

export type SanityCollectionSummary = Pick<
  SanityCollection,
  "_id" | "title" | "slug" | "description" | "heroImage"
> & {
  coverImage?: SanityImage | null;
  coverImageUrl?: string | null;
  heroImageUrl?: string | null;
  firstProductImage?: string | null;
  productCount: number;
};

/** E-commerce catalog product managed entirely in Sanity. */
export type SanityProduct = {
  _id: string;
  title: string;
  slug: string;
  priceInInr: number;
  compareAtPrice?: number | null;
  subtitle?: string | null;
  description?: string | null;
  featured?: boolean | null;
  status?: "active" | "draft" | "archived" | null;
  saleType?: "bulk" | "flexible" | null;
  minOrderQuantity?: number | null;
  logoUploadRequired?: boolean | null;
  paperType?: string | null;
  printMethod?: string | null;
  machineType?: string | null;
  laminationType?: string | null;
  techFinishingOptions?: string[] | null;
  embossing?: boolean | null;
  spotUV?: boolean | null;
  goldFoiling?: boolean | null;
  velvetLamination?: boolean | null;
  paperGsm?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  sku?: string | null;
  inStock?: boolean | null;
  customizationNotes?: string | null;
  categoryRef?: string | null;
  collectionRef?: string | null;
  collection?: Pick<SanityCollection, "_id" | "title" | "slug"> | null;
  images?: SanityImage[] | null;
  image?: SanityImage | null;
  gallery?: SanityProductGalleryImage[] | null;
  availableSizes?: SanityProductSize[] | null;
  sizeLabels?: string[] | null;
  availableFrames?: SanityProductFrame[] | null;
  frameLabels?: string[] | null;
  variants?: SanityProductVariant[] | null;
};

export type SanityHomePageWithCatalog = {
  editorial: SanityHomePage | null;
  products: SanityProduct[] | null;
};

export type SanityHomePageQueryResult = SanityHomePageWithCatalog | null;
