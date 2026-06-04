"use client";

import { useCart } from "@/hooks/use-cart";
import {
  getProductCardCompareAtPrice,
  getProductCardDiscount,
  getProductTrustDisplay,
} from "@/lib/shop/product-card-display";
import { cn } from "@/lib/utils/cn";
import type { ShopProductItem } from "@/types/shop";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

type EcommerceGridProps = {
  products: ShopProductItem[];
  totalCount?: number;
  sortBy?: string;
  onSortChange?: (value: string) => void;
  hideMobileSort?: boolean;
};

function StarRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  const filled = Math.min(5, Math.max(0, Math.round(rating)));

  return (
    <div className="mb-2 flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "h-3 w-3",
            index < filled
              ? "fill-saffron-gold text-saffron-gold"
              : "fill-zinc-200 text-zinc-200",
          )}
          strokeWidth={0}
          aria-hidden="true"
        />
      ))}
      <span className="ml-1 text-[11px] tabular-nums text-luxury-muted">
        {rating.toFixed(1)} ({reviewCount})
      </span>
    </div>
  );
}

function sortProducts(
  products: ShopProductItem[],
  sortBy: string,
): ShopProductItem[] {
  const list = [...products];

  switch (sortBy) {
    case "price-low":
      return list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    case "price-high":
      return list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    case "newest":
      return list.sort(
        (a, b) =>
          new Date(b._createdAt ?? 0).getTime() -
          new Date(a._createdAt ?? 0).getTime(),
      );
    default:
      return list;
  }
}

export default function EcommerceGrid({
  products,
  totalCount,
  sortBy: controlledSortBy,
  onSortChange,
  hideMobileSort = false,
}: EcommerceGridProps) {
  const { addItem, openCart } = useCart();
  const sortBy = controlledSortBy ?? "popularity";

  const sortedProducts = useMemo(
    () => sortProducts(products, sortBy),
    [products, sortBy],
  );

  const catalogTotal = totalCount ?? products.length;
  const showingFrom = sortedProducts.length > 0 ? 1 : 0;
  const showingTo = sortedProducts.length;

  const handleAddToCart = (product: ShopProductItem) => {
    const priceInInr = product.price ?? 0;
    addItem({
      productId: product._id,
      title: product.title,
      priceLabel: `₹${priceInInr.toLocaleString("en-IN")}`,
      priceInInr,
      quantity: 1,
      saleType: "flexible",
      minOrderQuantity: 1,
      image: product.imageUrl
        ? { src: product.imageUrl, alt: product.title }
        : undefined,
    });
    openCart();
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-luxury-muted">
          {sortedProducts.length > 0
            ? `Showing ${showingFrom}–${showingTo} of ${catalogTotal} results`
            : "No products match your filters"}
        </p>
        {onSortChange ? (
          <label
            className={cn(
              "flex items-center gap-2 text-sm text-luxury-text",
              hideMobileSort && "hidden lg:flex",
            )}
          >
            <span className="text-luxury-muted">Sort by:</span>
            <select
              value={sortBy}
              onChange={(event) => onSortChange(event.target.value)}
              className="rounded-md border border-zinc-200 px-3 py-1 text-sm outline-none focus:border-royal-magenta focus:ring-1 focus:ring-royal-magenta"
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </label>
        ) : null}
      </div>

      {sortedProducts.length === 0 ? (
        <p className="mt-12 text-center text-luxury-muted">
          No products found. Add products in Sanity Studio or adjust your
          filters.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 md:mt-6 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {sortedProducts.map((product) => {
            const trust = getProductTrustDisplay(product);
            const discount = getProductCardDiscount(product);
            const compareAt = getProductCardCompareAtPrice(product);
            const price = product.price ?? 0;

            return (
              <li key={product._id} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
                  <Link
                    href={product.slug ? `/products/${product.slug}` : "/shop"}
                    className="relative block aspect-square shrink-0 overflow-hidden bg-zinc-50"
                  >
                    <Image
                      src={product.imageUrl || "/images/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      unoptimized={!product.imageUrl?.startsWith("http")}
                    />
                    {discount ? (
                      <span className="absolute left-2 top-2 rounded-sm bg-red-100 px-2 py-1 text-[10px] font-bold uppercase text-red-600">
                        {discount.label}
                      </span>
                    ) : null}
                  </Link>
                  <div className="flex flex-1 flex-col p-4 md:p-5">
                    <Link
                      href={product.slug ? `/products/${product.slug}` : "/shop"}
                    >
                      <h3 className="mb-1 line-clamp-2 text-xs font-bold leading-snug text-luxury-text transition-colors hover:text-royal-magenta md:text-sm">
                        {product.title}
                      </h3>
                    </Link>
                    <StarRating
                      rating={trust.rating}
                      reviewCount={trust.reviewCount}
                    />
                    <div className="mt-auto flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-bold tabular-nums text-royal-magenta md:text-lg">
                          ₹{price.toLocaleString("en-IN")}
                        </p>
                        {compareAt ? (
                          <p className="text-[11px] text-gray-400 line-through tabular-nums">
                            ₹{compareAt.toLocaleString("en-IN")}
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="shrink-0 rounded-full border border-zinc-200 p-1.5 text-luxury-muted transition-colors hover:bg-royal-magenta hover:text-white"
                        aria-label={`Add ${product.title} to cart`}
                      >
                        <ShoppingCart className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
