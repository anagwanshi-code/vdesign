import { SimilarProducts } from "@/components/catalog/similar-products";
import { ProductDetailGallery } from "@/components/product/product-detail-gallery";
import { ProductDetails } from "@/components/product/product-details";
import { resolveProductByHandle } from "@/lib/data/product";
import { getSimilarProducts } from "@/lib/product/similar-products";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
export const revalidate = 30;

type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const routeParams = await params;

  const slug = (
    (routeParams as { slug?: string }).slug || routeParams.handle
  )
    .toString()
    .toLowerCase()
    .trim();

  const product = await resolveProductByHandle(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const description =
    product.description ??
    product.subtitle ??
    "Curated luxury product from V Design Luxury.";
  const imageUrl = product.image?.src ?? "/opengraph-image.png";

  return {
    title: product.title,
    description,
    openGraph: {
      title: `${product.title} — V Design`,
      description,
      type: "website",
      locale: "en_IN",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: product.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} — V Design`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const routeParams = await params;

  const slug = (
    (routeParams as { slug?: string }).slug || routeParams.handle
  )
    .toString()
    .toLowerCase()
    .trim();

  const product = await resolveProductByHandle(slug);

  if (!product) {
    notFound();
  }

  const similarProducts = await getSimilarProducts(
    product.id,
    product.categoryRef,
    product.collectionRef,
  );

  return (
    <article className="mx-auto w-full max-w-content px-4 pb-20 pt-10 md:px-8 lg:px-20 lg:pb-28 lg:pt-16">
      <nav
        className="mb-12 font-sans text-sm text-gray-500"
        aria-label="Breadcrumb"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href="/collections"
              className="transition-colors duration-300 hover:text-royal-magenta"
            >
              Collections
            </Link>
          </li>
          {product.collection ? (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/collections/${product.collection.slug}`}
                  className="transition-colors duration-300 hover:text-royal-magenta"
                >
                  {product.collection.title}
                </Link>
              </li>
            </>
          ) : null}
          <li aria-hidden="true">/</li>
          <li className="font-medium text-gray-900">{product.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <div className="z-10 lg:sticky lg:top-36">
          <ProductDetailGallery
            images={product.images}
            primary={product.image}
            gallery={product.gallery}
            title={product.title}
          />
        </div>

        <ProductDetails product={product} />
      </div>

      <SimilarProducts
        products={similarProducts}
        collectionTitle={product.collection?.title}
      />
    </article>
  );
}
