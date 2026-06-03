"use client";

type MessageSegment = {
  text: string;
  highlight?: "accent" | "emphasis";
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
    if (token === "Bespoke Packaging Collection") {
      segments.push({ text: token, highlight: "accent" });
    } else if (token === "✨" || token === "🌟" || token.startsWith("₹")) {
      segments.push({ text: token, highlight: "emphasis" });
    } else {
      segments.push({ text: token, highlight: "accent" });
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
    <span className="inline-flex items-center tracking-[0.12em] text-gray-900 sm:tracking-[0.18em]">
      {segments.map((segment, index) => (
        <span
          key={`${segment.text}-${index}`}
          className={
            segment.highlight === "accent"
              ? "font-bold text-pink-600"
              : segment.highlight === "emphasis"
                ? "font-semibold text-pink-600"
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
      className="relative z-[60] overflow-hidden border-b border-rose-100 bg-gradient-to-r from-rose-50 via-white to-rose-50"
      role="region"
      aria-label="Promotional announcements"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-rose-50 to-transparent sm:w-24"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-rose-50 to-transparent sm:w-24"
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
              className="mx-8 text-[10px] tracking-widest text-rose-200"
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
