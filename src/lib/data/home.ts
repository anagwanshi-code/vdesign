import type { HomePageContentResult, HomePageData } from "@/types/home";
import { isSanityConfigured } from "@/lib/sanity/client";
import { mapSanityHomePageWithCatalog } from "@/lib/sanity/mappers";
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
      src: "https://images.unsplash.com/photo-1604719312566-8912a922af0c?auto=format&fit=crop&w=1600&q=80",
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
      priceLabel: "₹4,800",
      priceInInr: 4800,
      source: "mock",
      image: {
        src: "https://images.unsplash.com/photo-1603006905003-2c4f57c74e5a?auto=format&fit=crop&w=800&q=80",
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
      priceLabel: "₹2,200",
      priceInInr: 2200,
      source: "mock",
      image: {
        src: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
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
      priceLabel: "₹3,600",
      priceInInr: 3600,
      source: "mock",
      image: {
        src: "https://images.unsplash.com/photo-1586075010923-2dd457fbcc78?auto=format&fit=crop&w=800&q=80",
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

    const mapped = mapSanityHomePageWithCatalog(content, mock);

    if (!mapped) {
      return { ...mock, source: "mock" };
    }

    return {
      ...mapped,
      source: "sanity",
    };
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
