import { urlFor } from "@/sanity/lib/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import type { ReactNode } from "react";

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mb-6 mt-14 font-serif text-3xl text-luxury-text md:text-4xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 mt-10 font-serif text-2xl text-luxury-text">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="mb-6 text-lg leading-relaxed text-luxury-muted">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-10 border-l-2 border-royal-magenta pl-6 font-serif text-2xl italic leading-snug text-luxury-text">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-8 list-disc space-y-2 pl-6 text-lg text-luxury-muted">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-8 list-decimal space-y-2 pl-6 text-lg text-luxury-muted">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const isExternal = href.startsWith("http");

      return (
        <a
          href={href}
          className="font-medium text-royal-magenta underline decoration-royal-magenta/30 underline-offset-4 transition-colors hover:text-peacock-blue"
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-luxury-text">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) {
        return null;
      }

      const imageUrl = urlFor(value).width(1920).quality(85).url();
      const alt =
        (typeof value.alt === "string" && value.alt.trim()) ||
        "Case study image";
      const caption =
        typeof value.caption === "string" ? value.caption.trim() : "";

      return (
        <figure className="my-12 md:my-16">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-100 shadow-lg">
            <Image
              src={imageUrl}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 768px"
              unoptimized={!imageUrl.startsWith("http")}
            />
          </div>
          {caption ? (
            <figcaption className="mt-4 text-center text-sm text-luxury-muted">
              {caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

type SanityPortableTextProps = {
  value: PortableTextBlock[] | null | undefined;
  className?: string;
};

export function SanityPortableText({ value, className }: SanityPortableTextProps) {
  if (!value?.length) {
    return null;
  }

  return (
    <div className={className}>
      <PortableText value={value} components={portableTextComponents} />
    </div>
  );
}
