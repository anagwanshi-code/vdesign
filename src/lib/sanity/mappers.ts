import { formatProductPriceWithMoq } from "@/lib/commerce/pricing";
import { normalizeMoq } from "@/lib/commerce/moq";
import { normalizeSaleType } from "@/lib/commerce/sale-type";
import { buildFinishingTags } from "@/lib/product/finishing-tags";
import { mapSanityProductSpecifications } from "@/lib/product/specifications";
import {
  buildFrameOptions,
  buildSizeOptions,
  formatInr,
  mapSanityVariantsToDetail,
} from "@/lib/product/variants";
import type { CollectionCard, ProductShowcaseItem } from "@/types/home";
import type { HeroMedia } from "@/types/home";
import type { ProductDetail } from "@/types/product";
import type {
  SanityCollectionSummary,
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

function mapSanityImageToHeroMedia(
  image: SanityImage | null | undefined,
  fallback: HeroMedia,
): HeroMedia {
  const url = image?.asset?.url?.trim();

  if (!url || url.includes("unsplash.com")) {
    return {
      src: "",
      alt: image?.alt ?? fallback.alt,
      width: fallback.width,
      height: fallback.height,
    };
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

function resolveProductStartingPrice(product: SanityProduct): number {
  if (Number.isFinite(product.priceInInr) && product.priceInInr > 0) {
    return product.priceInInr;
  }

  const variantPrices =
    product.variants
      ?.map((variant) => variant.priceInInr)
      .filter((price) => Number.isFinite(price) && price > 0) ?? [];

  if (variantPrices.length === 0) {
    return product.priceInInr;
  }

  return Math.min(...variantPrices);
}

function resolvePrimaryProductImage(
  product: SanityProduct,
): SanityImage | null | undefined {
  return product.image ?? product.images?.[0] ?? null;
}

function resolveProductGalleryImages(
  product: SanityProduct,
): SanityImage[] {
  if (product.gallery?.length) {
    return product.gallery
      .map((entry) => entry.image)
      .filter((image): image is SanityImage => Boolean(image?.asset?.url));
  }

  return (
    product.images?.slice(1).filter((image) => Boolean(image?.asset?.url)) ??
    []
  );
}

function resolveProductHoverImage(
  product: SanityProduct,
  fallbackImage: HeroMedia,
): HeroMedia | undefined {
  const galleryImage =
    product.gallery?.[0]?.image ?? product.images?.[1] ?? undefined;

  if (!galleryImage) {
    return undefined;
  }

  return mapSanityImageToHeroMedia(galleryImage, fallbackImage);
}

export function mapSanityProductToDetail(
  product: SanityProduct,
  fallbackImage: HeroMedia,
): ProductDetail {
  const startingPrice = resolveProductStartingPrice(product);

  return {
    id: product._id,
    handle: product.slug,
    title: product.title,
    subtitle: product.subtitle ?? undefined,
    description: product.description ?? undefined,
    priceInInr: startingPrice,
    saleType: normalizeSaleType(product.saleType),
    minOrderQuantity: normalizeMoq(product.minOrderQuantity),
    logoUploadRequired: Boolean(product.logoUploadRequired),
    image: mapSanityImageToHeroMedia(
      resolvePrimaryProductImage(product),
      fallbackImage,
    ),
    gallery: resolveProductGalleryImages(product).map((image) =>
      mapSanityImageToHeroMedia(image, fallbackImage),
    ),
    sizes: buildSizeOptions(product),
    frames: buildFrameOptions(product),
    variants: mapSanityVariantsToDetail(product.variants),
    specifications: mapSanityProductSpecifications(product),
    categoryRef: product.categoryRef ?? undefined,
    collectionRef:
      product.collectionRef ?? product.collection?._id ?? undefined,
    collection: product.collection
      ? {
          title: product.collection.title,
          slug: product.collection.slug,
        }
      : undefined,
  };
}

export function mapSanityProductToShowcaseItem(
  product: SanityProduct,
  fallbackImage: HeroMedia,
): ProductShowcaseItem {
  const startingPrice = resolveProductStartingPrice(product);
  const minOrderQuantity = normalizeMoq(product.minOrderQuantity);
  const saleType = normalizeSaleType(product.saleType);
  const hoverImage = resolveProductHoverImage(product, fallbackImage);

  return {
    id: product._id,
    handle: product.slug,
    title: product.title,
    subtitle: product.subtitle ?? "Curated by V Design Luxury",
    priceLabel: formatProductPriceWithMoq(startingPrice, minOrderQuantity),
    priceInInr: startingPrice,
    saleType,
    minOrderQuantity,
    logoUploadRequired: Boolean(product.logoUploadRequired),
    finishingTags: buildFinishingTags(product),
    searchDescription: product.description ?? undefined,
    source: "sanity",
    image: mapSanityImageToHeroMedia(
      resolvePrimaryProductImage(product),
      fallbackImage,
    ),
    hoverImage,
    collectionHandle: product.collection?.slug ?? undefined,
  };
}

export function mapSanityCollectionToCard(
  collection: SanityCollectionSummary,
  fallbackImage: HeroMedia,
): CollectionCard {
  return {
    id: collection._id,
    slug: (collection.slug ?? "").trim(),
    title: collection.title,
    description: collection.description ?? undefined,
    image: mapSanityImageToHeroMedia(
      collection.coverImage ?? collection.heroImage,
      fallbackImage,
    ),
    heroImage: collection.heroImage ?? undefined,
    coverImage: collection.coverImage ?? undefined,
    firstProductImage: collection.firstProductImage ?? undefined,
    coverImageUrl: collection.coverImageUrl ?? undefined,
    heroImageUrl: collection.heroImageUrl ?? undefined,
    productCount: collection.productCount ?? 0,
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

  const sanityProducts =
    content.products && content.products.length > 0
      ? mapSanityCatalogToShowcaseItems(
          content.products,
          fallback.hero.media,
        )
      : [];

  const hasEditorial = Boolean(content.editorial?.hero?.headline);
  const hasProducts = sanityProducts.length > 0;

  if (!hasEditorial && !hasProducts) {
    return null;
  }

  return {
    hero: editorial?.hero ?? fallback.hero,
    services: editorial?.services ?? fallback.services,
    products: sanityProducts,
  };
}
