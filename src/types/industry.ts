import type { PortableTextBlock } from "@portabletext/types";

export type IndustryDocument = {
  _id: string;
  industryName?: string | null;
  title?: string | null;
  slug?: string | null;
  shortDescription?: string | null;
  icon?: string | null;
  portraitImageUrl?: string | null;
  landscapeImageUrl?: string | null;
};

export type IndustryDetail = {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  landscapeImageUrl?: string | null;
  body?: PortableTextBlock[] | null;
};
