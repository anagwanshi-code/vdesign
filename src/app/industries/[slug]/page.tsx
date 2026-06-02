import { PremiumCta } from "@/components/blocks/premium-cta";
import { SanityPortableText } from "@/components/sanity/portable-text";
import { client } from "@/sanity/lib/client";
import {
  INDUSTRY_BY_SLUG_QUERY,
  INDUSTRY_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import type { IndustryDetail } from "@/types/industry";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
export const revalidate = 30;

type IndustryDetailPageProps = {
  params: Promise<{ slug: string }>;
};

async function getIndustry(slug: string): Promise<IndustryDetail | null> {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const industry = await client.fetch<
    (IndustryDetail & { title?: string | null; slug?: string | null }) | null
  >(INDUSTRY_BY_SLUG_QUERY, { slug: normalized });

  const title = industry?.title?.trim();
  if (!industry || !title) {
    return null;
  }

  return {
    _id: industry._id,
    title,
    slug: industry.slug?.trim() || normalized,
    shortDescription: industry.shortDescription,
    landscapeImageUrl: industry.landscapeImageUrl,
    body: industry.body,
  };
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(INDUSTRY_SLUGS_QUERY);
  return (slugs ?? [])
    .map((entry) => entry.slug?.trim())
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: IndustryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustry(slug);

  if (!industry) {
    return { title: "Industry Not Found" };
  }

  return {
    title: industry.title,
    description:
      industry.shortDescription?.trim() ||
      `Branding, packaging, and print solutions for ${industry.title} by V Design Surat.`,
  };
}

export default async function IndustryDetailPage({
  params,
}: IndustryDetailPageProps) {
  const { slug } = await params;
  const industry = await getIndustry(slug);

  if (!industry?.slug) {
    notFound();
  }

  const landscapeImageUrl = industry.landscapeImageUrl?.trim();
  const hasBody = Boolean(industry.body?.length);

  return (
    <article className="bg-white pt-10 lg:pt-16">
      <section className="border-b border-zinc-100">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 lg:min-h-[min(70vh,720px)]">
          <div className="flex flex-col justify-center px-6 py-16 lg:px-10 lg:py-24">
            <Link
              href="/industries"
              className="mb-8 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-luxury-muted transition-colors hover:text-royal-magenta"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              All Industries
            </Link>

            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
              Industry Solutions
            </p>

            <h1 className="font-serif text-4xl leading-tight text-luxury-text md:text-5xl lg:text-6xl">
              {industry.title}
            </h1>

            {industry.shortDescription ? (
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-luxury-muted">
                {industry.shortDescription}
              </p>
            ) : null}
          </div>

          <div className="relative min-h-[280px] bg-luxury-bg lg:min-h-0">
            {landscapeImageUrl ? (
              <Image
                src={landscapeImageUrl}
                alt={industry.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                unoptimized={!landscapeImageUrl.startsWith("http")}
              />
            ) : (
              <div
                className="absolute inset-0 bg-gradient-to-br from-peacock-blue/20 via-luxury-bg to-royal-magenta/15"
                aria-hidden="true"
              />
            )}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent lg:bg-gradient-to-l lg:from-white/40 lg:via-transparent lg:to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      {hasBody ? (
        <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <SanityPortableText value={industry.body!} />
        </section>
      ) : null}

      <PremiumCta
        title={`Ready to elevate your brand in the ${industry.title} space?`}
        description="Partner with V Design for sector-specific branding, packaging, and print that converts attention into trust."
        href="/consultation"
        buttonLabel="Start Your Project →"
      />
    </article>
  );
}
