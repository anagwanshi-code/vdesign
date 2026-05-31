import { FacebookIcon } from "@/components/icons/facebook-icon";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { PinterestIcon } from "@/components/icons/pinterest-icon";
import { getSiteSettings } from "@/lib/sanity/queries";
import { Link2, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

function buildSocialLinks(
  settings: Awaited<ReturnType<typeof getSiteSettings>>,
): SocialLink[] {
  const sanityUrls = new Map<string, string>();

  settings?.socialLinks?.forEach((link) => {
    const platform = link.platform?.trim();
    const url = link.url?.trim();
    if (!platform || !url) return;
    sanityUrls.set(normalizePlatformKey(platform), url);
  });

  return DEFAULT_SOCIAL.map((social) => ({
    ...social,
    href: sanityUrls.get(normalizePlatformKey(social.label)) ?? social.href,
  }));
}

function renderSocialIcon(platform: string) {
  const iconClass = "h-5 w-5";
  const stroke = 1.5;

  switch (normalizePlatformKey(platform)) {
    case "instagram":
      return <InstagramIcon className={iconClass} />;
    case "facebook":
      return <FacebookIcon className={iconClass} />;
    case "pinterest":
      return <PinterestIcon className={iconClass} />;
    default:
      return <Link2 className={iconClass} strokeWidth={stroke} />;
  }
}

export async function Footer() {
  const settings = await getSiteSettings();
  const socialLinks = buildSocialLinks(settings);
  const copyrightText =
    settings?.copyrightText?.trim() || DEFAULT_COPYRIGHT;
  const phone = DEFAULT_PHONE;
  const email = settings?.contactEmail?.trim() || DEFAULT_EMAIL;

  return (
    <footer className="border-t border-zinc-800 bg-[#0B1120] pt-20 pb-10 text-gray-400">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1 — Brand */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="V Design"
                width={240}
                height={80}
                className="mb-6 h-12 w-auto object-contain md:h-16"
              />
            </Link>
            <p className="mb-8 max-w-sm text-sm leading-relaxed text-gray-400">
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
                  className="text-gray-400 transition-colors hover:text-royal-magenta"
                >
                  {renderSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="mb-6 font-sans text-sm uppercase tracking-widest text-white">
              Quick Links
            </h3>
            <ul className="list-none p-0">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="mb-3 block text-sm text-gray-400 transition-colors hover:text-royal-magenta"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <h3 className="mb-6 font-sans text-sm uppercase tracking-widest text-white">
              Contact Info
            </h3>
            <ul className="space-y-4 text-sm leading-relaxed">
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="inline-flex items-start gap-3 text-gray-400 transition-colors hover:text-royal-magenta"
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
                  className="inline-flex items-start gap-3 text-gray-400 transition-colors hover:text-royal-magenta"
                >
                  <Mail
                    className="mt-0.5 h-4 w-4 shrink-0 text-royal-magenta/80"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  {email}
                </a>
              </li>
              <li className="inline-flex items-start gap-3 text-gray-400">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-royal-magenta/80"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span>{DEFAULT_ADDRESS}</span>
              </li>
            </ul>
          </div>

          {/* Column 4 — Industries We Serve */}
          <div>
            <h3 className="mb-6 font-sans text-sm uppercase tracking-widest text-white">
              Industries We Serve
            </h3>
            <ul className="list-none p-0">
              {INDUSTRIES_SERVE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="mb-3 block text-sm text-gray-400 transition-colors hover:text-royal-magenta"
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
              className="mt-4 inline-flex items-center text-sm font-medium text-royal-magenta transition-colors hover:text-white"
            >
              Visit Our Studio
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 md:flex-row">
          <p className="text-sm text-gray-500">{copyrightText}</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-gray-500 transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 transition-colors hover:text-white"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 transition-colors hover:text-royal-magenta"
            >
              Studio Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
