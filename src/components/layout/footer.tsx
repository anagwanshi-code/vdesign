import { FooterClient } from "@/components/layout/footer-client";
import { getSiteSettings } from "@/lib/sanity/queries";

const DEFAULT_COPYRIGHT = "© 2026 V Design. All Rights Reserved.";
const DEFAULT_EMAIL = "vdesigner@yahoo.com";

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

export async function Footer() {
  const settings = await getSiteSettings();
  const socialLinks = buildSocialLinks(settings);
  const copyrightText =
    settings?.copyrightText?.trim() || DEFAULT_COPYRIGHT;
  const email = settings?.contactEmail?.trim() || DEFAULT_EMAIL;

  return (
    <FooterClient
      copyrightText={copyrightText}
      email={email}
      socialLinks={socialLinks}
    />
  );
}
