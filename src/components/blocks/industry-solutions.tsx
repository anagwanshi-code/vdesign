import type { IndustryDocument } from "@/types/industry";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function industryDetailHref(slug: string | null | undefined): string {
  const normalized = slug?.trim();
  return normalized ? `/industries/${normalized}` : "/industries";
}

function resolveIndustryName(industry: IndustryDocument): string {
  return (industry.industryName ?? industry.title)?.trim() ?? "";
}

type IndustrySolutionsProps = {
  industries: IndustryDocument[];
};

export function IndustrySolutions({ industries }: IndustrySolutionsProps) {
  const items = industries
    .filter((item) => resolveIndustryName(item))
    .slice(0, 8);

  return (
    <section
      className="w-full border-t border-luxury-border bg-luxury-surface py-24 md:py-32"
      aria-labelledby="industry-solutions-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
            Industries We Serve
          </p>
          <h2
            id="industry-solutions-heading"
            className="font-serif text-4xl text-luxury-text md:text-5xl"
          >
            Creative Solutions For Every Industry
          </h2>
        </header>

        {items.length === 0 ? (
          <p className="text-center text-luxury-muted">
            No industries yet. Add industry documents in Sanity Studio to
            showcase them here.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((industry) => {
              const industryName = resolveIndustryName(industry);
              const description = industry.shortDescription?.trim();
              const portraitImageUrl = industry.portraitImageUrl?.trim();
              const href = industryDetailHref(industry.slug);

              return (
                <li key={industry._id}>
                  <Link
                    href={href}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    {portraitImageUrl ? (
                      <Image
                        src={portraitImageUrl}
                        alt={industryName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-peacock-blue/40 transition-transform duration-700 group-hover:scale-105"
                        aria-hidden="true"
                      />
                    )}

                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                      aria-hidden="true"
                    />

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <Sparkles
                        className="mb-3 h-7 w-7 text-white/90"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />

                      <h3 className="font-serif text-2xl text-white">
                        {industryName}
                      </h3>

                      {description ? (
                        <p className="mt-3 max-h-0 translate-y-4 overflow-hidden text-sm leading-relaxed text-white/85 opacity-0 transition-all duration-500 group-hover:max-h-32 group-hover:translate-y-0 group-hover:opacity-100">
                          {description}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
