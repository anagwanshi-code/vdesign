export const FALLBACK_ANNOUNCEMENTS = [
  "✨ Free Premium Shipping on all orders above ₹5,000",
  "🌟 Explore our new Bespoke Packaging Collection",
] as const;

export function resolveAnnouncements(messages: string[]): string[] {
  const trimmed = messages.map((line) => line.trim()).filter(Boolean);
  return trimmed.length > 0 ? trimmed : [...FALLBACK_ANNOUNCEMENTS];
}
