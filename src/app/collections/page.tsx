import { getCollectionsForIndex } from "@/lib/sanity/queries";
import type { CollectionIndexItem } from "@/types/collection";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Collections",
  description:
    "Explore the V Design atelier archive—curated luxury collections for wedding, retail, and corporate.",
};

function truncateDescription(text: string, maxLength = 100): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

function CollectionIndexCard({ collection }: { collection: CollectionIndexItem }) {
  const slug = collection.slug?.trim();
  if (!slug) {
    return null;
  }

  const imageUrl = collection.image?.trim();
  const descriptionSnippet = collection.description
    ? truncateDescription(collection.description)
    : null;

  return (
    <li>
      <Link
        href={`/collections/${slug}`}
        className="group relative block aspect-[4/5] overflow-hidden"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={collection.alt?.trim() || collection.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-200" aria-hidden="true" />
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
          aria-hidden="true"
        />

        <div className="absolute bottom-0 left-0 p-6">
          <h2 className="font-serif text-2xl font-light text-white md:text-3xl">
            {collection.title}
          </h2>
          {descriptionSnippet ? (
            <p className="mt-2 max-w-xs line-clamp-2 text-sm font-light text-gray-300">
              {descriptionSnippet}
            </p>
          ) : null}
        </div>
      </Link>
    </li>
  );
}

export default async function CollectionsIndexPage() {
  const collections = await getCollectionsForIndex();
  const items =
    collections?.filter(
      (collection) => Boolean(collection.slug?.trim() && collection.title),
    ) ?? [];

  return (
    <div className="bg-surface">
      <header className="px-6 pb-16 pt-32">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-[#D4AF37]">
            The Atelier Archive
          </p>
          <h1 className="mb-6 font-serif text-5xl font-light text-zinc-900 md:text-6xl">
            Our Collections
          </h1>
          <p className="max-w-2xl text-lg font-light text-zinc-600">
            Curated worlds of vibrant packaging, bespoke stationery, and tactile
            brand experiences. Designed with the precision of a luxury house,
            crafted to bring your vision to life in vivid color.
          </p>
        </div>
      </header>

      <section className="min-h-screen px-6 pb-24 pt-4">
        <div className="mx-auto max-w-7xl">
          {items.length > 0 ? (
            <ul className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
              {items.map((collection) => (
                <CollectionIndexCard
                  key={collection._id}
                  collection={collection}
                />
              ))}
            </ul>
          ) : (
            <p className="text-center text-zinc-500">
              No collections published yet. Add collections in Sanity Studio to
              populate this archive.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
