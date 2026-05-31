"use client";

import { cn } from "@/lib/utils/cn";
import Image from "next/image";

type PortfolioMediaProps = {
  title: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  className?: string;
  mediaClassName?: string;
  sizes?: string;
  priority?: boolean;
};

export function PortfolioMedia({
  title,
  imageUrl,
  videoUrl,
  className,
  mediaClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: PortfolioMediaProps) {
  const video = videoUrl?.trim();
  const image = imageUrl?.trim();

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-zinc-100", className)}>
      {video ? (
        <video
          src={video}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={image || undefined}
          className={cn("h-full w-full object-cover", mediaClassName)}
          aria-label={`${title} preview`}
        />
      ) : image ? (
        <Image
          src={image}
          alt={title}
          fill
          priority={priority}
          className={cn("object-cover", mediaClassName)}
          sizes={sizes}
          unoptimized={!image.startsWith("http")}
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-luxury-bg via-white to-peacock-blue/20"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
