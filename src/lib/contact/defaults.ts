import type { ContactOffice, ContactOfficeItem } from "@/types/contact";

export const DEFAULT_CONTACT_EMAIL = "vdesigner@yahoo.com";
export const DEFAULT_CONTACT_PHONE = "+91 99982 19882";
export const DEFAULT_CONTACT_WHATSAPP = "+91 99982 19882";
export const DEFAULT_CONTACT_ADDRESS =
  "6/78, Opp. Vigneshwar Mahadev, Kolsawad, B/s. Limra Hotel, Manchnharpura, Surat-395 003.";
export const DEFAULT_WORKING_HOURS = "Mon - Sat: 10:00 AM - 7:00 PM";

/** Google Maps embed `src` for V Design Surat (head office). */
export const DEFAULT_GOOGLE_MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.363!2d72.834428!3d21.204201!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f8ae8129a2d%3A0x3ccd5d92341fd007!2sV%20Design!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin";

export function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function telHref(phone: string): string {
  const digits = digitsOnly(phone);
  return digits ? `tel:+${digits}` : "tel:+919998219882";
}

export function whatsAppHref(whatsapp: string): string {
  const digits = digitsOnly(whatsapp);
  return digits ? `https://wa.me/${digits}` : "https://wa.me/919998219882";
}

export const DEFAULT_OFFICES: ContactOfficeItem[] = [
  {
    id: "office-0",
    title: "Head Office — Surat",
    address:
      "6/78, Opp. Vigneshwar Mahadev, Kolsawad, B/s. Limra Hotel, Manchnharpura, Surat-395 003.",
    mapLabel: "V Design — Surat",
  },
  {
    id: "office-1",
    title: "Branch Office — Mumbai",
    address:
      "Office No. 12, 3rd Floor, Kupar Estate, Andheri East, Mumbai-400 069.",
    mapLabel: "V Design — Mumbai",
  },
  {
    id: "office-2",
    title: "Branch Office — Ahmedabad",
    address: "A-301, Safal Profitare, S.G. Highway, Ahmedabad-380 054.",
    mapLabel: "V Design — Ahmedabad",
  },
];

function officeMapLabel(title: string): string {
  const segment = title.split("—").pop()?.trim();
  return segment ? `V Design — ${segment}` : title;
}

export function resolveContactOffices(
  offices?: ContactOffice[] | null,
): ContactOfficeItem[] {
  const fromCms =
    offices?.filter((office) => office.title?.trim() && office.address?.trim()) ??
    [];

  if (fromCms.length === 0) {
    return DEFAULT_OFFICES;
  }

  return fromCms.map((office, index) => {
    const title = office.title!.trim();
    return {
      id: `office-${index}`,
      title,
      address: office.address!.trim(),
      mapLabel: officeMapLabel(title),
    };
  });
}
