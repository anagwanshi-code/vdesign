"use client";

import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils/cn";
import type { ShopProductItem } from "@/types/shop";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type EcommerceGridProps = {
  products: ShopProductItem[];
  totalCount?: number;
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
    <div className="mb-2 flex items-center gap-1">
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
      <span className="ml-1 text-xs text-luxury-muted">
        ({reviewCount} reviews)
      </span>
    </div>
  );
}

export default function EcommerceGrid({
  products,
  totalCount,
}: EcommerceGridProps) {
  const { addItem, openCart } = useCart();
  const [sortBy, setSortBy] = useState("popularity");

  const sortedProducts = useMemo(() => {
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
        return list.sort(
          (a, b) => (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0),
        );
    }
  }, [products, sortBy]);

  const catalogTotal = totalCount ?? products.length;
  const showingFrom = sortedProducts.length > 0 ? 1 : 0;
  const showingTo = sortedProducts.length;

  const handleAddToCart = (product: ShopProductItem) => {
    const priceInInr = product.price ?? 0;
    addItem({
      productId: product._id,
      title: product.title,
      priceLabel: `₹${priceInInr}`,
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
    <div className="w-full lg:w-3/4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-luxury-muted">
          {sortedProducts.length > 0
            ? `Showing ${showingFrom}–${showingTo} of ${catalogTotal} results`
            : "No products match your filters"}
        </p>
        <label className="flex items-center gap-2 text-sm text-luxury-text">
          <span className="text-luxury-muted">Sort by:</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-md border border-zinc-200 px-3 py-1 text-sm outline-none focus:border-royal-magenta focus:ring-1 focus:ring-royal-magenta"
          >
            <option value="popularity">Popularity</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </label>
      </div>

      {sortedProducts.length === 0 ? (
        <p className="mt-12 text-center text-luxury-muted">
          No products found. Add products in Sanity Studio or adjust your
          filters.
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {sortedProducts.map((product) => (
            <li key={product._id}>
              <article className="group flex flex-col overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
                <Link
                  href={product.slug ? `/products/${product.slug}` : "/shop"}
                  className="relative block aspect-square overflow-hidden bg-zinc-50"
                >
                  <Image
                    src={product.imageUrl || "/images/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized={!product.imageUrl?.startsWith("http")}
                  />
                </Link>
                <div className="flex flex-grow flex-col p-4">
                  <Link href={product.slug ? `/products/${product.slug}` : "/shop"}>
                    <h3 className="mb-1 line-clamp-1 text-sm font-bold text-luxury-text transition-colors hover:text-royal-magenta">
                      {product.title}
                    </h3>
                  </Link>
                  <StarRating
                    rating={product.rating || 5}
                    reviewCount={product.reviewsCount || 0}
                  />
                  <div className="mt-auto flex items-center justify-between">
                    <p className="text-lg font-bold text-royal-magenta">
                      ₹{product.price || 0}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="rounded-full border border-zinc-200 p-1.5 text-luxury-muted transition-colors hover:bg-royal-magenta hover:text-white"
                      aria-label={`Add ${product.title} to cart`}
                    >
                      <ShoppingCart className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
