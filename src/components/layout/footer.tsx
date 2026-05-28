import { getSiteSettings } from "@/lib/sanity/queries";
import Link from "next/link";

const DEFAULT_COPYRIGHT = "© 2026 V Design. All rights reserved.";

const STUDIO_LINKS = [
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Careers", href: "/about" },
] as const;

const COLLECTION_LINKS = [
  { label: "Wedding", href: "/collections/wedding" },
  { label: "Retail", href: "/collections/retail" },
  { label: "Corporate", href: "/collections/corporate" },
] as const;

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterLinkColumnProps = {
  title: string;
  links: FooterLink[];
};

function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
  return (
    <div>
      <h3 className="mb-6 text-xs uppercase tracking-[0.2em] text-white">
        {title}
      </h3>
      <ul className="list-none p-0">
        {links.map((link, index) => (
          <li key={`${title}-${link.label}-${index}`}>
            {link.external ? (
              <a
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={
                  link.href.startsWith("mailto:")
                    ? undefined
                    : "noopener noreferrer"
                }
                className="mb-3 block text-sm text-gray-400 transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="mb-3 block text-sm text-gray-400 transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function buildConnectLinks(
  settings: Awaited<ReturnType<typeof getSiteSettings>>,
): FooterLink[] {
  const links = (settings?.socialLinks ?? [])
    .map((link): FooterLink | null => {
      const platform = link.platform?.trim();
      const url = link.url?.trim();
      if (!platform || !url) {
        return null;
      }
      return {
        label: platform,
        href: url,
        external: true,
      };
    })
    .filter((link): link is FooterLink => link !== null);

  const email = settings?.contactEmail?.trim();
  if (email) {
    links.push({
      label: "Email",
      href: `mailto:${email}`,
      external: true,
    });
  }

  return links;
}

export async function Footer() {
  const settings = await getSiteSettings();
  const connectLinks = buildConnectLinks(settings);
  const copyrightText =
    settings?.copyrightText?.trim() || DEFAULT_COPYRIGHT;

  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-serif text-3xl font-light md:text-4xl">
            Join the Atelier
          </h2>
          <p className="mt-4 text-gray-400">
            Receive quiet updates on new collections, atelier openings, and
            limited releases—curated, never crowded.
          </p>

          <form
            className="mx-auto mt-10 flex w-full max-w-md flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-center"
            action="#"
            aria-label="Newsletter subscription"
          >
            <label className="sr-only" htmlFor="footer-email">
              Email address
            </label>
            <input
              id="footer-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="your@email.com"
              className="w-full flex-1 border-0 border-b border-gray-600 bg-transparent px-0 py-2 text-white outline-none transition-colors placeholder:text-gray-500 focus:border-white"
            />
            <button
              type="submit"
              className="shrink-0 text-sm uppercase tracking-widest text-gray-400 transition-colors duration-300 hover:text-white"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 border-t border-white/10 px-6 py-16 md:grid-cols-4">
        <FooterLinkColumn
          title="Studio"
          links={[...STUDIO_LINKS]}
        />
        <FooterLinkColumn title="Collections" links={[...COLLECTION_LINKS]} />
        <FooterLinkColumn title="Legal" links={[...LEGAL_LINKS]} />
        <FooterLinkColumn title="Connect" links={connectLinks} />
      </section>

      <section className="border-t border-white/10 px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-gray-500 md:flex-row">
          <p>{copyrightText}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-end">
            <p className="text-gray-600">Crafted with precision.</p>
            <Link
              href="/studio"
              className="text-xs text-gray-600 transition-colors hover:text-white"
            >
              Studio Access
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
}
