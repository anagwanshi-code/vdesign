"use client";

import { FacebookIcon } from "@/components/icons/facebook-icon";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { PinterestIcon } from "@/components/icons/pinterest-icon";
import { useLenis } from "@studio-freight/react-lenis";
import { Link2, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

const DEFAULT_COPYRIGHT = "© 2026 V Design. All Rights Reserved.";

const DEFAULT_PHONE = "+91 99982 19882";
const DEFAULT_EMAIL = "vdesigner@yahoo.com";
const DEFAULT_ADDRESS =
  "6/78, Opp. Vigneshwar Mahadev, Kolsawad, B/s. Limra Hotel, Manchnharpura, Surat-395 003.";
const MAP_DIRECTIONS_URL =
  "https://www.google.com/maps/place/V+Design/@21.20226,72.836399,15z/data=!4m15!1m8!3m7!1s0x3be04ef649545a85:0xf8cda501c323ad22!2sManchharpura,+Mahidharpura,+Haripura,+Surat,+Gujarat+395003,+India!3b1!8m2!3d21.2022695!4d72.8364083!16s%2Fg%2F11c51w3xj1!3m5!1s0x3be04f8ae8129a2d:0x3ccd5d92341fd007!8m2!3d21.2042009!4d72.8366227!16s%2Fg%2F11tjlz2vrq";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/portfolio" },
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
] as const;

const INDUSTRIES_SERVE_LINKS = [
  { label: "Pharma", href: "/industries" },
  { label: "Fashion", href: "/industries" },
  { label: "Wedding", href: "/industries" },
  { label: "Corporate", href: "/industries" },
  { label: "Education", href: "/industries" },
  { label: "Real Estate", href: "/industries" },
  { label: "Retail", href: "/industries" },
] as const;

type SocialLink = {
  label: string;
  platform: string;
  href: string;
};

const DEFAULT_SOCIAL: SocialLink[] = [
  {
    label: "Instagram",
    platform: "instagram",
    href: "https://www.instagram.com/",
  },
  {
    label: "Facebook",
    platform: "facebook",
    href: "https://www.facebook.com/",
  },
  {
    label: "Pinterest",
    platform: "pinterest",
    href: "https://www.pinterest.com/",
  },
];

function normalizePlatformKey(platform: string): string {
  const key = platform.trim().toLowerCase();
  if (key.includes("instagram")) return "instagram";
  if (key.includes("facebook") || key === "fb") return "facebook";
  if (key.includes("pinterest")) return "pinterest";
  if (key.includes("linkedin")) return "linkedin";
  if (key.includes("twitter") || key === "x") return "twitter";
  return key;
}

function renderSocialIcon(platform: string) {
  const iconClass = "h-5 w-5";

  switch (normalizePlatformKey(platform)) {
    case "instagram":
      return <InstagramIcon className={iconClass} />;
    case "facebook":
      return <FacebookIcon className={iconClass} />;
    case "pinterest":
      return <PinterestIcon className={iconClass} />;
    default:
      return <Link2 className={iconClass} strokeWidth={1.5} />;
  }
}

export type FooterClientProps = {
  copyrightText: string;
  email: string;
  socialLinks: SocialLink[];
};

export function FooterClient({
  copyrightText,
  email,
  socialLinks,
}: FooterClientProps) {
  const pathname = usePathname();
  const lenis = useLenis();
  const phone = DEFAULT_PHONE;

  const handleHomeClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
        return;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-zinc-800 bg-[#0B1120] pt-12 pb-8 text-zinc-400 lg:pt-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
            <Link
              href="/"
              onClick={handleHomeClick}
              className="inline-block"
            >
              <Image
                src="/logo.png"
                alt="V Design"
                width={320}
                height={107}
                className="mb-4 h-auto w-44 object-contain md:w-48"
              />
            </Link>
            <p className="mb-5 max-w-sm text-sm leading-relaxed text-zinc-400">
              V Design is a creative branding, packaging, printing, and digital
              solutions company. We transform ideas into impactful experiences.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-zinc-400 transition-colors hover:text-royal-magenta"
                >
                  {renderSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-sans text-sm uppercase tracking-widest text-white">
              Quick Links
            </h3>
            <ul className="list-none space-y-2 p-0">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={link.href === "/" ? handleHomeClick : undefined}
                    className="block text-sm text-zinc-400 transition-colors hover:text-royal-magenta"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-sans text-sm uppercase tracking-widest text-white">
              Contact Info
            </h3>
            <ul className="space-y-2.5 text-sm leading-relaxed">
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="inline-flex items-start gap-3 text-zinc-400 transition-colors hover:text-royal-magenta"
                >
                  <Phone
                    className="mt-0.5 h-4 w-4 shrink-0 text-royal-magenta/80"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-start gap-3 text-zinc-400 transition-colors hover:text-royal-magenta"
                >
                  <Mail
                    className="mt-0.5 h-4 w-4 shrink-0 text-royal-magenta/80"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  {email}
                </a>
              </li>
              <li className="inline-flex items-start gap-3 text-zinc-400">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-royal-magenta/80"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span>{DEFAULT_ADDRESS}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-sans text-sm uppercase tracking-widest text-white">
              Industries We Serve
            </h3>
            <ul className="list-none space-y-2 p-0">
              {INDUSTRIES_SERVE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="block text-sm text-zinc-400 transition-colors hover:text-royal-magenta"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={MAP_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center text-sm font-medium text-royal-magenta transition-colors hover:text-white"
            >
              Visit Our Studio
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-800 py-5 md:flex-row">
          <p className="text-sm text-zinc-500">{copyrightText}</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-zinc-500 transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-zinc-500 transition-colors hover:text-white"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 transition-colors hover:text-royal-magenta"
            >
              Studio Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
