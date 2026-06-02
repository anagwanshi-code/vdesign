"use client";

type MessageSegment = {
  text: string;
  highlight?: "gold" | "rose";
};

function parseAnnouncementMessage(message: string): MessageSegment[] {
  const segments: MessageSegment[] = [];
  const pattern = /(✨|🌟|₹[\d,]+|Bespoke Packaging Collection)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(message)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: message.slice(lastIndex, match.index) });
    }

    const token = match[0];
    if (token === "✨" || token === "🌟") {
      segments.push({ text: token, highlight: "gold" });
    } else if (token.startsWith("₹")) {
      segments.push({ text: token, highlight: "gold" });
    } else {
      segments.push({ text: token, highlight: "rose" });
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < message.length) {
    segments.push({ text: message.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ text: message }];
}

function AnnouncementMessage({ message }: { message: string }) {
  const segments = parseAnnouncementMessage(message);

  return (
    <span className="inline-flex items-center tracking-[0.12em] text-white/90 drop-shadow-[0_0_12px_rgba(255,255,255,0.15)] sm:tracking-[0.18em]">
      {segments.map((segment, index) => (
        <span
          key={`${segment.text}-${index}`}
          className={
            segment.highlight === "gold"
              ? "text-saffron-gold/95 [text-shadow:0_0_20px_rgba(226,160,63,0.45)]"
              : segment.highlight === "rose"
                ? "font-medium text-rose-200 [text-shadow:0_0_18px_rgba(233,30,99,0.35)]"
                : undefined
          }
        >
          {segment.text}
        </span>
      ))}
    </span>
  );
}

function buildMarqueeItems(messages: string[]): string[] {
  if (messages.length === 0) {
    return [];
  }
  let items = [...messages];
  while (items.length < 4) {
    items = [...items, ...messages];
  }
  return [...items, ...items];
}

type AnnouncementBarClientProps = {
  messages: string[];
};

export function AnnouncementBarClient({ messages }: AnnouncementBarClientProps) {
  const marqueeItems = buildMarqueeItems(messages);

  if (marqueeItems.length === 0) {
    return null;
  }

  return (
    <div
      className="relative z-[60] overflow-hidden bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900"
      role="region"
      aria-label="Promotional announcements"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.07] via-transparent to-black/20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-slate-900 to-transparent sm:w-24"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-gray-800 to-transparent sm:w-24"
        aria-hidden="true"
      />

      <div className="relative flex w-max animate-marquee items-center motion-reduce:animate-none">
        {marqueeItems.map((message, index) => (
          <span
            key={`${message}-${index}`}
            className="flex shrink-0 items-center whitespace-nowrap px-8 py-2.5 font-sans text-xs font-medium sm:text-sm"
          >
            <AnnouncementMessage message={message} />
            <span
              className="mx-8 text-[10px] tracking-widest text-white/25"
              aria-hidden="true"
            >
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
