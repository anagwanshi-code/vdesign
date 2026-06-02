import { AnnouncementBarClient } from "@/components/layout/announcement-bar-client";
import { resolveAnnouncements } from "@/lib/data/announcements";
import { getAnnouncementMessages } from "@/lib/sanity/queries";

/** Server wrapper — fetch Sanity announcements with hardcoded fallback. */
export async function AnnouncementBar() {
  const fromSanity = await getAnnouncementMessages();
  const messages = resolveAnnouncements(fromSanity);
  return <AnnouncementBarClient messages={messages} />;
}

export { AnnouncementBarClient };
