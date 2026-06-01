import { cn } from "@/lib/utils/cn";
import {
  Layers,
  Palette,
  Printer,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";

const STUDIO_FEATURES: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Advanced Equipment",
    description: "State-of-the-art printing and finishing for premium output.",
    icon: Printer,
  },
  {
    title: "Creative Environment",
    description: "An inspiring space where concepts evolve into refined design.",
    icon: Palette,
  },
  {
    title: "Skilled Team",
    description: "Designers, strategists, and craftspeople working in harmony.",
    icon: Users,
  },
  {
    title: "End-to-End Solution",
    description: "From brand strategy to production under one trusted roof.",
    icon: Layers,
  },
];

const COLLAGE_TILES = [
  {
    className: "aspect-square",
    gradient: "from-peacock-blue/30 via-zinc-100 to-rose-50",
    label: "Studio Detail",
  },
  {
    className: "aspect-[4/3] lg:mt-8",
    gradient: "from-royal-magenta/20 via-amber-50 to-zinc-100",
    label: "Packaging Craft",
  },
  {
    className: "aspect-[3/4]",
    gradient: "from-saffron-gold/25 via-white to-peacock-blue/20",
    label: "Print Production",
  },
  {
    className: "aspect-square lg:mt-4",
    gradient: "from-zinc-900/10 via-rose-50 to-purple-50",
    label: "Creative Floor",
  },
] as const;

type AboutStudioProps = {
  heading: string;
  description: string;
  imageUrls: string[];
};

export function AboutStudio({
  heading,
  description,
  imageUrls,
}: AboutStudioProps) {
  const cmsImages = imageUrls.filter((url) => url.trim());

  return (
    <section
      className="relative isolate scroll-mt-28 w-full overflow-hidden bg-white py-24"
      aria-labelledby="about-studio-heading"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 px-6 lg:grid-cols-2">
        {/* Left: copy + feature grid only */}
        <div className="flex min-w-0 flex-col">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
            OUR STUDIO
          </p>
          <h2
            id="about-studio-heading"
            className="mb-6 font-serif text-4xl text-luxury-text md:text-5xl"
          >
            {heading}
          </h2>
          <p className="mb-10 max-w-xl text-lg leading-relaxed text-luxury-muted">
            {description}
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {STUDIO_FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-royal-magenta/10 text-royal-magenta">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="mb-1 font-medium text-luxury-text">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-luxury-muted">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: studio image collage only */}
        <div className="relative min-w-0 lg:pl-4">
          <div
            className="pointer-events-none absolute -right-8 top-1/2 z-0 h-72 w-72 -translate-y-1/2 rounded-full bg-royal-magenta/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative z-10 grid grid-cols-2 gap-4">
            {COLLAGE_TILES.map((tile, index) => {
              const imageSrc = cmsImages[index];

              return (
                <div
                  key={tile.label}
                  className={cn(
                    "relative overflow-hidden rounded-xl",
                    tile.className,
                  )}
                >
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={`${heading} — ${tile.label}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      unoptimized={!imageSrc.startsWith("http")}
                    />
                  ) : (
                    <div
                      className={cn(
                        "absolute inset-0 flex items-center justify-center bg-gradient-to-br",
                        tile.gradient,
                      )}
                    >
                      <span className="font-serif text-sm text-luxury-text/30">
                        {tile.label}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-white shadow-xl">
              <Image
                src="/logo.png"
                alt="V Design"
                width={72}
                height={72}
                className="h-14 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
