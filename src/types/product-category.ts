export type ProductCategoryDocument = {
  _id: string;
  title: string;
  slug?: string | null;
  description?: string | null;
  imageUrl?: string | null;
};
