export const ALL_PRODUCTS_LABEL = "All Products";

export const TYPE_FILTERS = [
  { label: "Best Sellers", key: "bestSellers" as const },
  { label: "New Arrivals", key: "newArrivals" as const },
  { label: "On Sale", key: "onSale" as const },
  { label: "Customizable", key: "customizable" as const },
] as const;

export type ShopTypeFilterKey = (typeof TYPE_FILTERS)[number]["key"];

export type ShopTypeFilters = Record<ShopTypeFilterKey, boolean>;

export const EMPTY_TYPE_FILTERS: ShopTypeFilters = {
  bestSellers: false,
  newArrivals: false,
  onSale: false,
  customizable: false,
};

export const OCCASION_OPTIONS = [
  { title: "Wedding", value: "wedding" },
  { title: "Corporate", value: "corporate" },
  { title: "Festival", value: "festival" },
  { title: "Personal", value: "personal" },
] as const;
