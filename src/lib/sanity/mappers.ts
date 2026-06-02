import { formatProductPriceWithMoq } from "@/lib/commerce/pricing";
import { resolveProductMoq } from "@/lib/commerce/product-pricing";
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
import type {
  AboutStudioContent,
  CollectionCard,
  HomeStatItem,
  HeroEditorialParams,
  ProductShowcaseItem,
} from "@/types/home";
import type { HeroMedia } from "@/types/home";
import type { ProductDetail, PremiumAddonOption, VolumeDiscountTier } from "@/types/product";
import type {
  SanityAboutStudio,
  SanityCollectionSummary,
  SanityHeroBlock,
  SanityHomePage,
  SanityHomePageWithCatalog,
  SanityImage,
  SanityProduct,
} from "@/types/sanity";

const DEFAULT_HOME_STATS: HomeStatItem[] = [
  { value: "18+", label: "Years Experience" },
  { value: "5000+", label: "Projects Delivered" },
  { value: "100+", label: "Business Partners" },
  { value: "25+", label: "Awards & Recognition" },
];

function mapSanityHomeStats(
  stats: SanityHomePage["homeStats"],
): HomeStatItem[] {
  const items =
    stats
      ?.map((item) => ({
        value: (item.numberValue ?? item.value)?.trim() || "",
        label: item.label?.trim() || "",
      }))
      .filter((item) => item.value || item.label)
      .slice(0, 4)
      .map((item) => ({
        value: item.value || "—",
        label: item.label || "—",
      })) ?? [];

  return items.length > 0 ? items : DEFAULT_HOME_STATS;
}

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

export function mapSanityHeroToEditorial(
  hero: SanityHeroBlock,
  fallback: HeroEditorialParams,
): HeroEditorialParams {
  const fallbackMedia = fallback.media;

  const cmsUrls =
    hero.heroImageUrls?.map((url) => url?.trim()).filter((url): url is string =>
      Boolean(url),
    ) ?? [];

  const mappedImages = (hero.heroImages ?? [])
    .map((image) => mapSanityImageToHeroMedia(image, fallbackMedia))
    .filter((image) => Boolean(image.src));

  const slidesFromUrls: HeroMedia[] =
    cmsUrls.length > 0
      ? cmsUrls.map((url, index) => ({
          src: url,
          alt:
            hero.heroImages?.[index]?.alt?.trim() ||
            fallbackMedia.alt ||
            `V Design showcase ${index + 1}`,
          width:
            hero.heroImages?.[index]?.asset?.metadata?.dimensions?.width ??
            fallbackMedia.width,
          height:
            hero.heroImages?.[index]?.asset?.metadata?.dimensions?.height ??
            fallbackMedia.height,
        }))
      : mappedImages;

  const legacyMedia = mapSanityImageToHeroMedia(hero.media, fallbackMedia);
  const slides =
    slidesFromUrls.length > 0
      ? slidesFromUrls
      : legacyMedia.src
        ? [legacyMedia]
        : fallback.heroImages.length > 0
          ? fallback.heroImages
          : fallbackMedia.src
            ? [fallbackMedia]
            : [];

  const media = slides[0] ?? fallbackMedia;

  return {
    eyebrow: hero.eyebrow ?? fallback.eyebrow,
    title: hero.headline,
    description: hero.subheadline ?? fallback.description,
    ctaPrimary: hero.ctaPrimary ?? fallback.ctaPrimary,
    ctaSecondary: hero.ctaSecondary ?? fallback.ctaSecondary,
    media,
    heroImages: slides,
    heroImageUrls: cmsUrls.length > 0 ? cmsUrls : slides.map((s) => s.src),
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

function resolveGalleryEntryImage(
  entry: NonNullable<SanityProduct["gallery"]>[number],
): SanityImage | null | undefined {
  if (entry.image?.asset?.url) {
    return entry.image;
  }

  const direct = entry as SanityImage;
  if (direct.asset?.url) {
    return direct;
  }

  return null;
}

function dedupeImageUrls(urls: (string | null | undefined)[]): string[] {
  const seen = new Set<string>();

  return urls
    .map((url) => url?.trim())
    .filter((url): url is string => {
      if (!url || seen.has(url)) {
        return false;
      }
      seen.add(url);
      return true;
    });
}

function urlToHeroMedia(
  url: string,
  alt: string,
  fallback: HeroMedia,
): HeroMedia {
  return {
    src: url,
    alt,
    width: fallback.width,
    height: fallback.height,
  };
}

function resolveProductDetailMedia(
  product: SanityProduct,
  fallbackImage: HeroMedia,
): { image: HeroMedia; gallery: HeroMedia[]; images: string[] } {
  const fromUrls = dedupeImageUrls([
    product.imageUrl,
    ...(product.galleryUrls ?? []),
  ]);

  const alt =
    product.image?.alt?.trim() || product.title?.trim() || fallbackImage.alt;

  if (fromUrls.length > 0) {
    const [primaryUrl, ...restUrls] = fromUrls;

    return {
      images: fromUrls,
      image: urlToHeroMedia(primaryUrl, alt, fallbackImage),
      gallery: restUrls.map((url) => urlToHeroMedia(url, alt, fallbackImage)),
    };
  }

  const image = mapSanityImageToHeroMedia(
    resolvePrimaryProductImage(product),
    fallbackImage,
  );
  const gallery = resolveProductGalleryImages(product)
    .map((entry) => mapSanityImageToHeroMedia(entry, fallbackImage))
    .filter((entry) => Boolean(entry.src));

  const images = dedupeImageUrls([
    image.src,
    ...gallery.map((entry) => entry.src),
  ]);

  return {
    images,
    image,
    gallery,
  };
}

function resolveProductGalleryImages(
  product: SanityProduct,
): SanityImage[] {
  if (product.gallery?.length) {
    return product.gallery
      .map((entry) => resolveGalleryEntryImage(entry))
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
    (product.gallery?.[0]
      ? resolveGalleryEntryImage(product.gallery[0])
      : undefined) ?? product.images?.[1] ?? undefined;

  if (!galleryImage) {
    return undefined;
  }

  return mapSanityImageToHeroMedia(galleryImage, fallbackImage);
}

function mapVolumeDiscounts(product: SanityProduct): VolumeDiscountTier[] {
  return (product.volumeDiscounts ?? [])
    .map((tier) => ({
      minQuantity: tier?.minQuantity,
      discountPercentage: tier?.discountPercentage,
    }))
    .filter(
      (
        tier,
      ): tier is { minQuantity: number; discountPercentage: number } =>
        Number.isFinite(tier.minQuantity) &&
        Number.isFinite(tier.discountPercentage) &&
        tier.minQuantity! >= 2 &&
        tier.discountPercentage! >= 0 &&
        tier.discountPercentage! <= 100,
    )
    .map((tier) => ({
      minQuantity: Math.floor(tier.minQuantity),
      discountPercentage: tier.discountPercentage,
    }))
    .sort((a, b) => a.minQuantity - b.minQuantity);
}

function mapPremiumAddons(product: SanityProduct): PremiumAddonOption[] {
  return (product.premiumAddons ?? [])
    .map((addon) => ({
      addonName: addon?.addonName?.trim() ?? "",
      extraPrice: addon?.extraPrice,
    }))
    .filter(
      (addon): addon is PremiumAddonOption =>
        Boolean(addon.addonName) &&
        Number.isFinite(addon.extraPrice) &&
        addon.extraPrice! >= 0,
    )
    .map((addon) => ({
      addonName: addon.addonName,
      extraPrice: addon.extraPrice,
    }));
}

function resolveProductMrp(product: SanityProduct): number | undefined {
  const value = product.mrp ?? product.compareAtPrice;

  if (typeof value === "number" && value > 0) {
    return value;
  }

  return undefined;
}

export function mapSanityProductToDetail(
  product: SanityProduct,
  fallbackImage: HeroMedia,
): ProductDetail {
  const startingPrice = resolveProductStartingPrice(product);
  const media = resolveProductDetailMedia(product, fallbackImage);
  const moq = resolveProductMoq(product.moq, product.minOrderQuantity);

  return {
    id: product._id,
    handle: product.slug,
    title: product.title,
    subtitle: product.subtitle ?? undefined,
    description: product.description ?? undefined,
    priceInInr: startingPrice,
    mrp: resolveProductMrp(product),
    saleType: normalizeSaleType(product.saleType),
    moq,
    minOrderQuantity: moq,
    allowCustomUpload: Boolean(product.allowCustomUpload),
    logoUploadRequired: Boolean(product.logoUploadRequired),
    volumeDiscounts: mapVolumeDiscounts(product),
    premiumAddons: mapPremiumAddons(product),
    image: media.image,
    images: media.images,
    gallery: media.gallery,
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
  const minOrderQuantity = resolveProductMoq(product.moq, product.minOrderQuantity);
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

export function mapSanityFeaturedProducts(
  products: SanityProduct[] | null | undefined,
  fallbackImage: HeroMedia,
): ProductShowcaseItem[] {
  if (!products?.length) {
    return [];
  }

  return mapSanityCatalogToShowcaseItems(products, fallbackImage).filter(
    (product) => Boolean(product.handle?.trim()),
  );
}

export function mapSanityFeaturedCollections(
  collections: SanityCollectionSummary[] | null | undefined,
  fallbackImage: HeroMedia,
): CollectionCard[] {
  if (!collections?.length) {
    return [];
  }

  return collections
    .filter((collection) => Boolean(collection.slug?.trim()))
    .map((collection) =>
      mapSanityCollectionToCard(
        { ...collection, productCount: collection.productCount ?? 0 },
        fallbackImage,
      ),
    );
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
  },
): { hero: HeroEditorialParams } | null {
  if (!content.hero?.headline) {
    return null;
  }

  const hero = mapSanityHeroToEditorial(content.hero, fallback.hero);

  return { hero };
}

const ABOUT_STUDIO_IMAGE_FALLBACK: HeroMedia = {
  src: "",
  alt: "V Design atelier craftsmanship",
  width: 1600,
  height: 1200,
};

export function mapSanityAboutStudio(
  aboutStudio: SanityAboutStudio | null | undefined,
): AboutStudioContent | null {
  if (!aboutStudio) {
    return null;
  }

  const eyebrow = aboutStudio.eyebrow?.trim() ?? "";
  const headline = aboutStudio.headline?.trim() ?? "";
  const description = aboutStudio.description?.trim() ?? "";
  const ctaLabel = aboutStudio.ctaLabel?.trim() ?? "";
  const ctaLink = aboutStudio.ctaLink?.trim() || "/about";

  const image = mapSanityImageToHeroMedia(aboutStudio.image, {
    ...ABOUT_STUDIO_IMAGE_FALLBACK,
    alt:
      aboutStudio.image?.alt?.trim() || ABOUT_STUDIO_IMAGE_FALLBACK.alt,
  });
  const hasImage = Boolean(image.src);

  if (!eyebrow && !headline && !description && !hasImage) {
    return null;
  }

  return {
    eyebrow,
    headline,
    description,
    ctaLabel,
    ctaLink,
    image: hasImage ? image : null,
  };
}

export function hasAboutStudioContent(
  content: AboutStudioContent | null | undefined,
): content is AboutStudioContent {
  if (!content) {
    return false;
  }

  return Boolean(
    content.eyebrow ||
      content.headline ||
      content.description ||
      content.image?.src,
  );
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
    products: ProductShowcaseItem[];
  },
): {
  hero: HeroEditorialParams;
  brandLogosTitle: string;
  brandLogoUrls: string[];
  homeStats: HomeStatItem[];
  featuredCollections: CollectionCard[];
  featuredProducts: ProductShowcaseItem[];
  aboutStudio: AboutStudioContent | null;
  products: ProductShowcaseItem[];
} | null {
  const editorial = content.editorial;
  const brandLogosTitle =
    editorial?.trustStripHeading?.trim() ||
    editorial?.brandLogosTitle?.trim() ||
    "TRUSTED BY GROWING BRANDS";
  const brandLogoUrls =
    (editorial?.clientLogoUrls ?? editorial?.brandLogoUrls)?.filter(
      (url): url is string => Boolean(url?.trim()),
    ) ?? [];
  const homeStats = mapSanityHomeStats(
    editorial?.heroStats?.length
      ? editorial.heroStats
      : editorial?.homeStats,
  );

  const heroFromBlock = editorial?.hero
    ? mapSanityHeroToEditorial(editorial.hero, fallback.hero)
    : fallback.hero;

  const hero: HeroEditorialParams = {
    ...heroFromBlock,
    heroHeadingRegular:
      editorial?.heroHeadingRegular?.trim() ||
      editorial?.heroHeading?.trim() ||
      heroFromBlock.heroHeadingRegular,
    heroHeadingCursive:
      editorial?.heroHeadingCursive?.trim() ||
      heroFromBlock.heroHeadingCursive,
    title:
      [
        editorial?.heroHeadingRegular?.trim() ||
          editorial?.heroHeading?.trim() ||
          editorial?.hero?.headline?.trim(),
        editorial?.heroHeadingCursive?.trim(),
      ]
        .filter(Boolean)
        .join(" ") ||
      heroFromBlock.title,
    description:
      editorial?.heroSubheading?.trim() ||
      editorial?.hero?.subheadline?.trim() ||
      heroFromBlock.description,
  };

  const hasHeroContent = Boolean(
    editorial?.heroHeadingRegular ||
      editorial?.heroHeadingCursive ||
      editorial?.heroHeading ||
      editorial?.heroSubheading ||
      editorial?.hero?.headline ||
      editorial?.hero?.heroImages?.length,
  );
  const featuredCollections = mapSanityFeaturedCollections(
    editorial?.featuredCollections,
    fallback.hero.media,
  );
  const featuredProducts = mapSanityFeaturedProducts(
    editorial?.featuredProducts,
    fallback.hero.media,
  );
  const aboutStudio = mapSanityAboutStudio(editorial?.aboutStudio);

  const sanityProducts =
    content.products && content.products.length > 0
      ? mapSanityCatalogToShowcaseItems(
          content.products,
          fallback.hero.media,
        )
      : [];

  const hasFeaturedCollections = featuredCollections.length > 0;
  const hasFeaturedProducts = featuredProducts.length > 0;
  const hasProducts = sanityProducts.length > 0;

  const hasTrustContent =
    brandLogoUrls.length > 0 ||
    Boolean(editorial?.trustStripHeading?.trim()) ||
    Boolean(editorial?.heroStats?.length) ||
    Boolean(editorial?.homeStats?.length);

  if (
    !editorial ||
    (!hasHeroContent &&
      !hasFeaturedCollections &&
      !hasFeaturedProducts &&
      !hasProducts &&
      !hasTrustContent)
  ) {
    return null;
  }

  return {
    hero,
    brandLogosTitle,
    brandLogoUrls,
    homeStats,
    featuredCollections,
    featuredProducts,
    aboutStudio,
    products: sanityProducts,
  };
}
