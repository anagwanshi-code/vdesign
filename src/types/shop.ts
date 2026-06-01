export type ShopCategoryItem = {
  _id: string;
  title: string;
  slug: string;
};

export type ShopProductItem = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  rating?: number | null;
  reviewsCount?: number | null;
  isBestSeller?: boolean | null;
  occasion?: string[] | null;
  isNewArrival?: boolean | null;
  isOnSale?: boolean | null;
  isCustomizable?: boolean | null;
  imageUrl?: string | null;
  categoryName?: string | null;
  categoryId?: string | null;
  _createdAt?: string;
};

export type ShopCatalogData = {
  products: ShopProductItem[];
  categories: ShopCategoryItem[];
  source: "sanity" | "empty";
};
