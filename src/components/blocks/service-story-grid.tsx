import { cn } from "@/lib/utils/cn";
import type { ServiceAccent, ServiceStory } from "@/types/home";
import Image from "next/image";
import Link from "next/link";

const accentClasses: Record<ServiceAccent, string> = {
  peacock: "text-peacock",
  saffron: "text-saffron",
  purple: "text-purple",
  gold: "text-[#D4AF37]",
};

function resolveAccentClass(accent: ServiceAccent | string): string {
  const normalized = accent.trim().toLowerCase();
  if (normalized in accentClasses) {
    return accentClasses[normalized as ServiceAccent];
  }
  return accentClasses.gold;
}

type ServiceStoryGridProps = {
  services: ServiceStory[];
};

export function ServiceStoryGrid({ services }: ServiceStoryGridProps) {
  if (!services.length) {
    return null;
  }

  return (
    <section
      className="border-t border-white/10 bg-black"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-content px-5 py-24 md:px-8 lg:px-20 lg:py-32">
        <div className="mb-16 max-w-prose text-center md:mx-auto md:text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
            What We Do
          </p>
          <h2
            id="services-heading"
            className="mt-4 font-serif text-4xl font-light leading-tight tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Crafted for luxury brands
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {services.map((service) => (
            <li key={service.id}>
              <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:bg-white/10">
                {service.coverImage?.src ? (
                  <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-lg border border-white/10">
                    <Image
                      src={service.coverImage.src}
                      alt={service.coverImage.alt || service.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                      aria-hidden="true"
                    />
                  </div>
                ) : null}

                {service.vertical ? (
                  <p
                    className={cn(
                      "text-xs uppercase tracking-[0.25em]",
                      resolveAccentClass(service.accent),
                    )}
                  >
                    {service.vertical}
                  </p>
                ) : null}

                <h3 className="mt-4 font-serif text-2xl font-light text-white">
                  {service.title}
                </h3>

                <p className="mt-4 flex-1 text-base leading-relaxed text-gray-400">
                  {service.description}
                </p>

                <Link
                  href={service.href}
                  className="mt-8 inline-flex font-sans text-xs uppercase tracking-widest text-white transition-colors duration-300 hover:text-[#D4AF37]"
                >
                  Discover →
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
