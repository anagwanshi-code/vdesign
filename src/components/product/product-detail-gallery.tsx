"use client";

import type { HeroMedia } from "@/types/home";
import Image from "next/image";
import { useMemo, useState } from "react";

type ProductDetailGalleryProps = {
  primary: HeroMedia;
  gallery?: HeroMedia[];
  title: string;
};

export function ProductDetailGallery({
  primary,
  gallery = [],
  title,
}: ProductDetailGalleryProps) {
  const images = useMemo(() => {
    const candidates = [primary, ...gallery];
    const seen = new Set<string>();

    return candidates.filter((image) => {
      const src = image.src?.trim();
      if (!src || seen.has(src)) {
        return false;
      }
      seen.add(src);
      return true;
    });
  }, [primary, gallery]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? primary;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-border bg-border/30">
        {activeImage?.src ? (
          <Image
            src={activeImage.src}
            alt={activeImage.alt || "Product"}
            width={activeImage.width}
            height={activeImage.height}
            className="h-full w-full object-cover"
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
        <ul className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <li key={`${image.src}-${index}`}>
              <button
                type="button"
                aria-label={`View ${title} image ${index + 1}`}
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={`relative aspect-square overflow-hidden rounded-md border transition-colors duration-base ease-luxury ${
                  index === activeIndex
                    ? "border-peacock"
                    : "border-border hover:border-peacock/60"
                }`}
              >
                {image?.src ? (
                  <Image
                    src={image.src}
                    alt={image.alt || "Product"}
                    width={image.width}
                    height={image.height}
                    className="h-full w-full object-cover"
                    sizes="120px"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200" aria-hidden="true" />
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
