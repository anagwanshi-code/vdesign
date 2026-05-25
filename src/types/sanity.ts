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

/** E-commerce catalog product managed entirely in Sanity. */
export type SanityProduct = {
  _id: string;
  title: string;
  slug: string;
  priceInInr: number;
  subtitle?: string | null;
  image?: SanityImage | null;
};

export type SanityHomePageWithCatalog = {
  editorial: SanityHomePage | null;
  products: SanityProduct[] | null;
};

export type SanityHomePageQueryResult = SanityHomePageWithCatalog | null;
