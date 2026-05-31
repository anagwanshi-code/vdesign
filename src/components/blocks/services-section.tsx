import { cn } from "@/lib/utils/cn";
import type { ServiceDocument } from "@/types/service";
import {
  Box,
  Globe,
  Layers,
  Megaphone,
  Palette,
  Printer,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ServiceCardStyle = {
  icon: LucideIcon;
  accentClass: string;
};

const CARD_STYLES: ServiceCardStyle[] = [
  { icon: Palette, accentClass: "text-royal-magenta" },
  { icon: Box, accentClass: "text-peacock-blue" },
  { icon: Printer, accentClass: "text-saffron-gold" },
  { icon: Megaphone, accentClass: "text-royal-magenta" },
  { icon: Globe, accentClass: "text-peacock-blue" },
  { icon: Layers, accentClass: "text-saffron-gold" },
];

type ServiceDisplayItem = ServiceCardStyle & {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
};

function mapCmsServices(services: ServiceDocument[]): ServiceDisplayItem[] {
  return services
    .filter((item) => item.title?.trim())
    .map((item, index) => {
      const style = CARD_STYLES[index % CARD_STYLES.length];
      return {
        id: item._id,
        title: item.title!.trim(),
        description: item.shortDescription?.trim() ?? "",
        imageUrl: item.imageUrl,
        icon: style.icon,
        accentClass: style.accentClass,
      };
    });
}

type ServicesSectionProps = {
  services?: ServiceDocument[] | null;
  className?: string;
};

export function ServicesSection({ services, className }: ServicesSectionProps) {
  const displayServices = mapCmsServices(
    services?.filter((item) => item.title?.trim()) ?? [],
  );

  return (
    <section
      id="services"
      className={cn(
        "relative isolate z-0 w-full scroll-mt-28 bg-luxury-bg py-24 md:py-32",
        className,
      )}
      aria-labelledby="services-section-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
            Our Services
          </p>
          <h2
            id="services-section-heading"
            className="mb-6 font-serif text-4xl text-luxury-text md:text-5xl"
          >
            Creative Solutions Designed for Modern Brands
          </h2>
          <p className="max-w-2xl text-lg text-luxury-muted">
            From luxury packaging to digital branding, we help businesses create
            impactful visual identities.
          </p>
        </div>

        {displayServices.length > 0 ? (
          <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayServices.map((service) => {
              const Icon = service.icon;

              return (
                <li key={service.id}>
                  <article className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
                    <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-zinc-100">
                      {service.imageUrl ? (
                        <Image
                          src={service.imageUrl}
                          alt={service.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          unoptimized={!service.imageUrl.startsWith("http")}
                        />
                      ) : (
                        <div
                          className="absolute inset-0 bg-gradient-to-br from-luxury-bg via-white to-peacock-blue/15"
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    <div className="p-8">
                      <div
                        className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-luxury-bg shadow-sm"
                        aria-hidden="true"
                      >
                        <Icon
                          className={cn("h-6 w-6", service.accentClass)}
                          strokeWidth={1.5}
                        />
                      </div>

                      <h3 className="mb-3 font-serif text-2xl text-luxury-text">
                        {service.title}
                      </h3>

                      <p className="text-sm leading-relaxed text-luxury-muted">
                        {service.description}
                      </p>

                      <Link
                        href="/services"
                        className="mt-6 inline-flex text-sm font-medium text-luxury-text transition-colors duration-300 group-hover:text-royal-magenta"
                      >
                        View Services →
                      </Link>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
