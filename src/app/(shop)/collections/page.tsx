import { CollectionGrid } from "@/components/catalog/collection-grid";
import { resolveAllCollections } from "@/lib/data/collections";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections",
  description: "Discover luxury collections curated by V Design Luxury.",
};

export default async function CollectionsPage() {
  const { collections, source } = await resolveAllCollections();

  return (
    <section className="mx-auto w-full max-w-content px-5 py-24 md:px-8 lg:px-20">
      <header className="mb-16 max-w-prose">
        <p className="text-overline uppercase text-saffron">Shop</p>
        <h1 className="mt-4 font-serif text-display-lg text-text-primary">
          Collections
        </h1>
        <p className="mt-6 text-body text-text-muted">
          {source === "sanity"
            ? "Live collections from Sanity CMS—each edit links to its published product catalog."
            : "Preview collections—configure Sanity environment variables to load live CMS content."}
        </p>
      </header>

      <CollectionGrid collections={collections} />
    </section>
  );
}
