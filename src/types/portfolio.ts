import type { PortableTextBlock } from "@portabletext/types";

export type PortfolioCardProject = {
  _id: string;
  title: string;
  slug?: string | null;
  category?: string | null;
  shortDescription?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  clientName?: string | null;
};

export type PortfolioListItem = PortfolioCardProject;

export type PortfolioGalleryImage = {
  _key: string;
  url?: string | null;
  alt?: string | null;
};

export type PortfolioCaseStudy = {
  _id: string;
  title: string;
  slug: string;
  category?: string | null;
  clientName?: string | null;
  timeline?: string | null;
  servicesProvided?: string[] | null;
  shortDescription?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  body?: PortableTextBlock[] | null;
  gallery?: PortfolioGalleryImage[] | null;
};
