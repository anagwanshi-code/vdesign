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
  image: HeroMedia;
  source?: "sanity" | "mock";
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
