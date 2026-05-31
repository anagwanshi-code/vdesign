import { Calendar, FileText, MessageCircle, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Schedule",
    description: "Pick a time that works for you.",
    icon: Calendar,
    accent: "bg-rose-50 text-royal-magenta",
  },
  {
    step: "02",
    title: "Discuss",
    description: "Share goals with our creative team.",
    icon: MessageCircle,
    accent: "bg-sky-50 text-peacock-blue",
  },
  {
    step: "03",
    title: "Plan",
    description: "Receive a tailored project roadmap.",
    icon: FileText,
    accent: "bg-amber-50 text-saffron-gold",
  },
  {
    step: "04",
    title: "Deliver",
    description: "Launch with precision-crafted assets.",
    icon: Package,
    accent: "bg-purple-50 text-royal-magenta",
  },
] as const;

const PHONE = "+91 99982 19882";
const WHATSAPP_URL = "https://wa.me/919998219882";

function TimelineStep({
  item,
  isLast,
}: {
  item: (typeof STEPS)[number];
  isLast: boolean;
}) {
  const Icon = item.icon as LucideIcon;

  return (
    <li className="relative flex gap-4 pb-8 last:pb-0">
      {!isLast ? (
        <span
          className="absolute left-8 top-16 h-[calc(100%-3rem)] w-px bg-luxury-border"
          aria-hidden="true"
        />
      ) : null}

      <div
        className={`relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${item.accent}`}
      >
        <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
      </div>

      <div className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-luxury-muted">
          {item.step}
        </p>
        <h3 className="mt-1 font-serif text-xl text-luxury-text">{item.title}</h3>
        <p className="mt-1 text-sm text-luxury-muted">{item.description}</p>
      </div>
    </li>
  );
}

export function ConsultationSidebar() {
  return (
    <aside aria-label="Consultation process and contact">
      <div className="mb-6 rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
        <h2 className="mb-6 font-semibold text-royal-magenta">How It Works</h2>
        <ol>
          {STEPS.map((item, index) => (
            <TimelineStep
              key={item.step}
              item={item}
              isLast={index === STEPS.length - 1}
            />
          ))}
        </ol>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
        <h2 className="mb-3 font-semibold text-luxury-text">
          Need Immediate Help?
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-luxury-muted">
          Talk to our experts right now and get quick assistance.
        </p>
        <div className="flex flex-col gap-3">
          <a
            href={`tel:${PHONE.replace(/\s/g, "")}`}
            className="inline-flex items-center justify-center rounded-lg border-2 border-royal-magenta px-4 py-3 text-center text-sm font-medium text-royal-magenta transition-colors hover:bg-royal-magenta hover:text-white"
          >
            Call Now: {PHONE}
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
          >
            <MessageCircle className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            WhatsApp Us
          </a>
        </div>
      </div>
    </aside>
  );
}
