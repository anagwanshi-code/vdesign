import { IndustriesGrid } from "@/components/blocks/industries-grid";
import { PremiumCta } from "@/components/blocks/premium-cta";
import { WhyChooseUs } from "@/components/blocks/why-choose-us";
import { client } from "@/sanity/lib/client";
import { INDUSTRIES_QUERY } from "@/sanity/lib/queries";
import type { IndustryDocument } from "@/types/industry";
import { Download } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Industry-specific branding and packaging by V Design—pharma, jewelry, wedding, fashion, corporate, and more.",
};

export default async function IndustriesPage() {
  const industries = await client.fetch<IndustryDocument[]>(INDUSTRIES_QUERY);

  return (
    <div className="bg-white pt-32">
      <section className="relative overflow-hidden bg-luxury-bg pb-12 md:pb-16">
        <div
          className="pointer-events-none absolute -right-16 top-10 h-80 w-80 rounded-full bg-peacock-blue/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-0 top-1/3 h-72 w-72 rounded-full bg-saffron-gold/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
              INDUSTRIES WE SERVE
            </p>
            <h1 className="mb-6 font-serif text-5xl leading-tight text-luxury-text md:text-7xl">
              Creative Solutions
              <br />
              for Every{" "}
              <span className="font-dancing bg-gradient-to-r from-saffron-gold to-orange-500 bg-clip-text text-transparent">
                Industry.
              </span>
            </h1>
            <p className="mb-8 max-w-xl text-lg text-luxury-muted">
              We understand that every industry is unique. That&apos;s why we
              create customized branding, packaging, and print solutions
              tailored to your sector&apos;s standards and ambitions.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/consultation"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 text-sm font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Let&apos;s Work Together
              </Link>
              <Link
                href="/consultation"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-8 py-3 text-sm font-medium text-luxury-text transition-colors hover:border-royal-magenta hover:text-royal-magenta"
              >
                <Download className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                Download Brochure
              </Link>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-peacock-blue/20 via-transparent to-royal-magenta/15 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xl">
              <div className="grid h-full grid-cols-2 gap-2 p-3">
                <div className="rounded-xl bg-gradient-to-br from-peacock-blue/30 to-zinc-100" />
                <div className="mt-8 rounded-xl bg-gradient-to-br from-royal-magenta/20 to-amber-50" />
                <div className="rounded-xl bg-gradient-to-br from-saffron-gold/25 to-rose-50" />
                <div className="rounded-xl bg-gradient-to-br from-zinc-100 to-peacock-blue/25" />
              </div>
              <Image
                src="/logo.png"
                alt=""
                width={64}
                height={64}
                className="absolute left-1/2 top-1/2 h-14 w-auto -translate-x-1/2 -translate-y-1/2 opacity-25"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      <IndustriesGrid industries={industries} />
      <WhyChooseUs variant="industries" />
      <PremiumCta
        title="Every Industry Has a Story."
        description="Let's craft packaging and branding that speaks yours—with precision, passion, and premium craft."
      />
    </div>
  );
}
