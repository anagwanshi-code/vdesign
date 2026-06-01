"use client";

import type { HeroMedia } from "@/types/home";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type ProductDetailGalleryProps = {
  /** Flat image URLs from Sanity (primary first). */
  images?: string[];
  primary?: HeroMedia;
  gallery?: HeroMedia[];
  title: string;
};

function resolveUrl(value: string | HeroMedia | undefined): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }

  const src = value.src?.trim();
  return src || null;
}

export function ProductDetailGallery({
  images: imageUrls,
  primary,
  gallery = [],
  title,
}: ProductDetailGalleryProps) {
  const images = useMemo(() => {
    if (imageUrls?.length) {
      const seen = new Set<string>();
      return imageUrls
        .map((url) => url.trim())
        .filter((url) => {
          if (!url || seen.has(url)) {
            return false;
          }
          seen.add(url);
          return true;
        });
    }

    const seen = new Set<string>();
    return [primary, ...gallery]
      .map((item) => resolveUrl(item))
      .filter((url): url is string => {
        if (!url || seen.has(url)) {
          return false;
        }
        seen.add(url);
        return true;
      });
  }, [imageUrls, primary, gallery]);

  const [mainImage, setMainImage] = useState(images[0] ?? "");

  useEffect(() => {
    setMainImage(images[0] ?? "");
  }, [images]);

  return (
    <div className="flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-border bg-border/30">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={primary?.alt?.trim() || title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : (
          <div
            className="aspect-[4/5] w-full bg-gray-200"
            aria-hidden="true"
          />
        )}
      </div>

      {images.length > 1 ? (
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {images.map((url, idx) => (
            <button
              key={`${url}-${idx}`}
              type="button"
              aria-label={`View ${title} image ${idx + 1}`}
              aria-pressed={mainImage === url}
              onClick={() => setMainImage(url)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                mainImage === url
                  ? "border-zinc-900"
                  : "border-transparent hover:border-zinc-300"
              }`}
            >
              <Image
                src={url}
                alt={`Gallery image ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
