import Image from "next/image";
import type { ReactNode } from "react";

type SplitPageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  heroImageUrl?: string | null;
  actions?: ReactNode;
};

export function SplitPageHero({
  eyebrow,
  title,
  description,
  heroImageUrl,
  actions,
}: SplitPageHeroProps) {
  const imageUrl = heroImageUrl?.trim();

  return (
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
            {eyebrow}
          </p>
          <h1 className="mb-6 font-serif text-5xl leading-tight text-luxury-text md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mb-8 max-w-xl text-lg text-luxury-muted">{description}</p>
          {actions ? (
            <div className="flex flex-wrap items-center gap-4">{actions}</div>
          ) : null}
        </div>

        <div className="relative">
          <div
            className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-peacock-blue/20 via-transparent to-royal-magenta/15 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xl">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={typeof title === "string" ? title : "Page hero"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div
                className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-peacock-blue/30 via-zinc-50 to-royal-magenta/25 p-8 text-center"
                aria-hidden="true"
              >
                <span className="font-serif text-2xl text-peacock-blue/80 md:text-3xl">
                  V Design
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
