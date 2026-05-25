import type { ProductShowcaseItem } from "@/types/home";
import type { HeroMedia } from "@/types/home";
import type {
  SanityHeroBlock,
  SanityHomePage,
  SanityHomePageWithCatalog,
  SanityImage,
  SanityProduct,
} from "@/types/sanity";
import type {
  HeroEditorialParams,
  ServiceAccent,
  ServiceStory,
  ServiceVertical,
} from "@/types/home";

function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

function mapSanityImageToHeroMedia(
  image: SanityImage | null | undefined,
  fallback: HeroMedia,
): HeroMedia {
  const url = image?.asset?.url;

  if (!url) {
    return fallback;
  }

  return {
    src: url,
    alt: image?.alt ?? fallback.alt,
    width: image?.asset?.metadata?.dimensions?.width ?? fallback.width,
    height: image?.asset?.metadata?.dimensions?.height ?? fallback.height,
  };
}

function isServiceVertical(value: string | null | undefined): value is ServiceVertical {
  return value === "packaging" || value === "ecommerce" || value === "agency";
}

function isServiceAccent(value: string | null | undefined): value is ServiceAccent {
  return value === "peacock" || value === "saffron" || value === "purple";
}

export function mapSanityHeroToEditorial(
  hero: SanityHeroBlock,
  fallback: HeroEditorialParams,
): HeroEditorialParams {
  return {
    eyebrow: hero.eyebrow ?? fallback.eyebrow,
    title: hero.headline,
    description: hero.subheadline ?? fallback.description,
    ctaPrimary: hero.ctaPrimary ?? fallback.ctaPrimary,
    ctaSecondary: hero.ctaSecondary ?? fallback.ctaSecondary,
    media: mapSanityImageToHeroMedia(hero.media, fallback.media),
  };
}

export function mapSanityServiceToStory(
  service: NonNullable<SanityHomePage["services"]>[number],
  fallbackMedia: HeroMedia,
): ServiceStory {
  return {
    id: service._key,
    vertical: isServiceVertical(service.vertical) ? service.vertical : "packaging",
    title: service.title,
    description: service.description,
    accent: isServiceAccent(service.accent) ? service.accent : "peacock",
    href: service.href ?? "/collections",
    coverImage: service.coverImage
      ? mapSanityImageToHeroMedia(service.coverImage, fallbackMedia)
      : undefined,
  };
}

export function mapSanityProductToShowcaseItem(
  product: SanityProduct,
  fallbackImage: HeroMedia,
): ProductShowcaseItem {
  return {
    id: product._id,
    handle: product.slug,
    title: product.title,
    subtitle: product.subtitle ?? "Curated by V Design Luxury",
    priceLabel: formatInr(product.priceInInr),
    priceInInr: product.priceInInr,
    source: "sanity",
    image: mapSanityImageToHeroMedia(product.image, fallbackImage),
  };
}

export function mapSanityHomePageToEditorial(
  content: SanityHomePage,
  fallback: {
    hero: HeroEditorialParams;
    services: ServiceStory[];
  },
): { hero: HeroEditorialParams; services: ServiceStory[] } | null {
  if (!content.hero?.headline) {
    return null;
  }

  const hero = mapSanityHeroToEditorial(content.hero, fallback.hero);
  const services =
    content.services && content.services.length > 0
      ? content.services.map((service) =>
          mapSanityServiceToStory(service, fallback.hero.media),
        )
      : fallback.services;

  return { hero, services };
}

export function mapSanityCatalogToShowcaseItems(
  products: SanityProduct[],
  fallbackImage: HeroMedia,
): ProductShowcaseItem[] {
  return products.map((product) =>
    mapSanityProductToShowcaseItem(product, fallbackImage),
  );
}

export function mapSanityHomePageWithCatalog(
  content: SanityHomePageWithCatalog,
  fallback: {
    hero: HeroEditorialParams;
    services: ServiceStory[];
    products: ProductShowcaseItem[];
  },
): {
  hero: HeroEditorialParams;
  services: ServiceStory[];
  products: ProductShowcaseItem[];
} | null {
  const editorial = content.editorial
    ? mapSanityHomePageToEditorial(content.editorial, fallback)
    : null;

  const products =
    content.products && content.products.length > 0
      ? mapSanityCatalogToShowcaseItems(
          content.products,
          fallback.hero.media,
        )
      : fallback.products;

  const hasEditorial = Boolean(content.editorial?.hero?.headline);
  const hasProducts = Boolean(content.products && content.products.length > 0);

  if (!hasEditorial && !hasProducts) {
    return null;
  }

  return {
    hero: editorial?.hero ?? fallback.hero,
    services: editorial?.services ?? fallback.services,
    products,
  };
}
