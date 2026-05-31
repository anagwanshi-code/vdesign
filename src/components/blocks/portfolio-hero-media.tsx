"use client";

import { PortfolioMedia } from "@/components/blocks/portfolio-media";

type PortfolioHeroMediaProps = {
  title: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
};

export function PortfolioHeroMedia({
  title,
  imageUrl,
  videoUrl,
}: PortfolioHeroMediaProps) {
  return (
    <>
      <PortfolioMedia
        title={title}
        imageUrl={imageUrl}
        videoUrl={videoUrl}
        className="absolute inset-0"
        priority
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20"
        aria-hidden="true"
      />
    </>
  );
}
