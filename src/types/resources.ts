export type ResourcesPageContent = {
  heroTitle?: string | null;
  heroHighlight?: string | null;
  heroSuffix?: string | null;
  heroDescription?: string | null;
  heroImageUrl?: string | null;
};

export type ResourcePost = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  publishedAt?: string | null;
  excerpt?: string | null;
  imageUrl?: string | null;
  categoryName?: string | null;
};

export type DownloadResource = {
  _id: string;
  title?: string | null;
  subtitle?: string | null;
  fileUrl?: string | null;
  previewImageUrl?: string | null;
};
