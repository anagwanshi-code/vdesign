import { cn } from "@/lib/utils/cn";
import type { ServiceAccent, ServiceStory } from "@/types/home";
import Link from "next/link";

const accentClasses: Record<ServiceAccent, string> = {
  peacock: "text-peacock",
  saffron: "text-saffron",
  purple: "text-purple",
};

type ServiceStoryGridProps = {
  services: ServiceStory[];
};

export function ServiceStoryGrid({ services }: ServiceStoryGridProps) {
  return (
    <section
      className="border-t border-border bg-surface"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-content px-5 py-24 md:px-8 lg:px-20 lg:py-32">
        <div className="mb-16 max-w-prose">
          <p className="text-overline uppercase text-peacock">What We Do</p>
          <h2
            id="services-heading"
            className="mt-4 font-serif text-display-lg text-text-primary"
          >
            Three disciplines, one luxury standard
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {services.map((service) => (
            <li key={service.id}>
              <article className="flex h-full flex-col border border-border bg-surface p-8 shadow-soft transition-shadow duration-base ease-luxury hover:shadow-lift">
                <p
                  className={cn(
                    "text-overline uppercase",
                    accentClasses[service.accent],
                  )}
                >
                  {service.vertical}
                </p>
                <h3 className="mt-4 font-serif text-heading text-text-primary">
                  {service.title}
                </h3>
                <p className="mt-4 flex-1 text-body text-text-muted">
                  {service.description}
                </p>
                <Link
                  href={service.href}
                  className="mt-8 inline-flex text-caption font-sans uppercase tracking-widest text-text-primary transition-colors duration-base ease-luxury hover:text-peacock"
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
