"use client";

import {
  DEFAULT_CONTACT_EMAIL,
  DEFAULT_CONTACT_PHONE,
  DEFAULT_CONTACT_WHATSAPP,
  DEFAULT_CONTACT_ADDRESS,
  DEFAULT_WORKING_HOURS,
  telHref,
  whatsAppHref,
} from "@/lib/contact/defaults";
import type { ContactInfoCardsProps } from "@/types/contact";
import { cn } from "@/lib/utils/cn";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ContactCard = {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  href?: string;
};

function buildCards({
  email = DEFAULT_CONTACT_EMAIL,
  phone = DEFAULT_CONTACT_PHONE,
  address = DEFAULT_CONTACT_ADDRESS,
  whatsapp = DEFAULT_CONTACT_WHATSAPP,
  workingHours = DEFAULT_WORKING_HOURS,
}: ContactInfoCardsProps): ContactCard[] {
  const colonIndex = workingHours.indexOf(":");
  const hoursValue =
    colonIndex >= 0 ? workingHours.slice(0, colonIndex).trim() : "Mon – Sat";
  const hoursSubtitle =
    colonIndex >= 0
      ? workingHours.slice(colonIndex + 1).trim()
      : workingHours;

  return [
    {
      title: "Call Us",
      value: phone,
      subtitle: hoursSubtitle || "Mon–Sat, 10:00 AM – 7:00 PM",
      icon: Phone,
      iconBg: "bg-rose-50",
      iconColor: "text-royal-magenta",
      href: telHref(phone),
    },
    {
      title: "Email Us",
      value: email,
      subtitle: "We reply within 24 hours",
      icon: Mail,
      iconBg: "bg-sky-50",
      iconColor: "text-peacock-blue",
      href: `mailto:${email}`,
    },
    {
      title: "Our Address",
      value: "Surat, Gujarat",
      subtitle: address,
      icon: MapPin,
      iconBg: "bg-amber-50",
      iconColor: "text-saffron-gold",
    },
    {
      title: "WhatsApp Us",
      value: whatsapp,
      subtitle: "Quick chat for quotes & support",
      icon: MessageCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-peacock-blue",
      href: whatsAppHref(whatsapp),
    },
    {
      title: "Working Hours",
      value: hoursValue,
      subtitle: hoursSubtitle,
      icon: Clock,
      iconBg: "bg-purple-50",
      iconColor: "text-royal-magenta",
    },
  ];
}

export function ContactInfoCards(props: ContactInfoCardsProps) {
  const cards = buildCards(props);

  return (
    <section
      className="relative isolate z-0 mx-auto max-w-7xl scroll-mt-28 px-6 pb-4 pt-6 md:-mt-12 md:pb-8 md:pt-0"
      aria-label="Contact information"
    >
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          const content = (
            <>
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full",
                  card.iconBg,
                )}
              >
                <Icon
                  className={cn("h-6 w-6", card.iconColor)}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <h3 className="mb-2 mt-4 font-serif text-xl font-bold text-luxury-text">
                {card.title}
              </h3>
              <p className="text-lg font-semibold text-royal-magenta">
                {card.value}
              </p>
              <p className="mt-1 text-sm text-luxury-muted">{card.subtitle}</p>
            </>
          );

          return (
            <li key={card.title}>
              {card.href ? (
                <a
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    card.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="flex h-full flex-col items-center rounded-2xl border border-zinc-100 bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-transform hover:-translate-y-1"
                >
                  {content}
                </a>
              ) : (
                <div className="flex h-full flex-col items-center rounded-2xl border border-zinc-100 bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
