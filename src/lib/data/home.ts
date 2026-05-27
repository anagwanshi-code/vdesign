import { DEFAULT_MINIMUM_ORDER_QUANTITY } from "@/lib/commerce/moq";
import { formatProductPriceWithMoq } from "@/lib/commerce/pricing";
import type { HomePageContentResult, HomePageData } from "@/types/home";
import { isSanityConfigured } from "@/lib/sanity/client";
import {
  mapSanityCatalogToShowcaseItems,
  mapSanityHomePageWithCatalog,
} from "@/lib/sanity/mappers";
import { getHomePageWithCatalog } from "@/lib/sanity/queries";

export const MOCK_HOME_PAGE_DATA: HomePageData = {
  hero: {
    eyebrow: "Luxury Design Studio",
    title: "Silence, Then Revelation",
    description:
      "Premium packaging, curated commerce, and cinematic creative agency work—rooted in modern Indian artistic excellence and engineered for the world stage.",
    ctaPrimary: {
      label: "Explore Collections",
      href: "/collections",
    },
    ctaSecondary: {
      label: "View Agency Work",
      href: "/work",
    },
    media: {
      src: "",
      alt: "Luxury packaging materials with warm surface tones and refined typography",
      width: 1600,
      height: 2000,
    },
  },
  services: [
    {
      id: "service-packaging",
      vertical: "packaging",
      title: "Packaging Architecture",
      description:
        "Rigid boxes, tactile papers, and structural design systems built for unboxing moments that feel inevitable—not improvised.",
      accent: "saffron",
      href: "/collections",
    },
    {
      id: "service-ecommerce",
      vertical: "ecommerce",
      title: "Curated Commerce",
      description:
        "Sanity-managed catalog with native UPI checkout—editorial product storytelling without platform lock-in.",
      accent: "peacock",
      href: "/collections",
    },
    {
      id: "service-agency",
      vertical: "agency",
      title: "Creative Agency",
      description:
        "Case studies, brand films, and immersive digital narratives with cinematic scroll choreography and AI-native asset pipelines.",
      accent: "purple",
      href: "/work",
    },
  ],
  products: [
    {
      id: "product-malabar-candle",
      handle: "malabar-candle-archive",
      title: "Malabar Candle Archive",
      subtitle: "Coconut wax · brass lid · Kochi atelier",
      priceLabel: formatProductPriceWithMoq(4800, DEFAULT_MINIMUM_ORDER_QUANTITY),
      priceInInr: 4800,
      saleType: "bulk",
      minOrderQuantity: DEFAULT_MINIMUM_ORDER_QUANTITY,
      logoUploadRequired: false,
      finishingTags: ["Gold Foiling", "Velvet Lamination"],
      source: "mock",
      image: {
        src: "",
        alt: "Malabar Candle Archive luxury candle in brass-lidded vessel",
        width: 800,
        height: 1000,
      },
    },
    {
      id: "product-jaipur-box",
      handle: "jaipur-rigid-box",
      title: "Jaipur Rigid Box",
      subtitle: "Saffron-dyed cotton paper · magnetic closure",
      priceLabel: formatProductPriceWithMoq(2200, DEFAULT_MINIMUM_ORDER_QUANTITY),
      priceInInr: 2200,
      saleType: "bulk",
      minOrderQuantity: DEFAULT_MINIMUM_ORDER_QUANTITY,
      logoUploadRequired: false,
      finishingTags: ["Spot UV", "350 GSM Ivory"],
      source: "mock",
      image: {
        src: "",
        alt: "Jaipur Rigid Box in saffron-toned luxury packaging",
        width: 800,
        height: 1000,
      },
    },
    {
      id: "product-peacock-stationery",
      handle: "peacock-stationery-set",
      title: "Peacock Stationery Set",
      subtitle: "Cotton rag · foil deboss · limited run",
      priceLabel: formatProductPriceWithMoq(3600, DEFAULT_MINIMUM_ORDER_QUANTITY),
      priceInInr: 3600,
      saleType: "bulk",
      minOrderQuantity: DEFAULT_MINIMUM_ORDER_QUANTITY,
      logoUploadRequired: false,
      finishingTags: ["Embossing", "350 GSM Ivory"],
      source: "mock",
      image: {
        src: "",
        alt: "Peacock Stationery Set with foil deboss detailing",
        width: 800,
        height: 1000,
      },
    },
  ],
};

export function getMockHomePageData(): HomePageData {
  return MOCK_HOME_PAGE_DATA;
}

export async function resolveHomePageContent(): Promise<HomePageContentResult> {
  const mock = getMockHomePageData();

  if (!isSanityConfigured()) {
    return { ...mock, source: "mock" };
  }

  try {
    const content = await getHomePageWithCatalog();

    if (!content) {
      return { ...mock, source: "mock" };
    }

    const sanityProducts =
      content.products && content.products.length > 0
        ? mapSanityCatalogToShowcaseItems(
            content.products,
            mock.hero.media,
          )
        : [];

    const mapped = mapSanityHomePageWithCatalog(content, {
      hero: mock.hero,
      services: mock.services,
      products: [],
    });

    if (sanityProducts.length > 0 || mapped) {
      return {
        hero: mapped?.hero ?? mock.hero,
        services: mapped?.services ?? mock.services,
        products: sanityProducts,
        source: "sanity",
      };
    }

    return { ...mock, source: "mock" };
  } catch (error) {
    console.error("[Sanity] Home page fallback to mock data:", error);
    return { ...mock, source: "mock" };
  }
}

/** @deprecated Use resolveHomePageContent */
export async function getHomePageData(): Promise<HomePageData> {
  const { source: _source, ...data } = await resolveHomePageContent();
  return data;
}
