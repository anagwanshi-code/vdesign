import { ConsultationSidebar } from "@/components/blocks/consultation-sidebar";
import { ConsultationForm } from "@/components/forms/consultation-form";
import {
  Clock,
  Lightbulb,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Schedule a free consultation with V Design—expert guidance for packaging, branding, and premium print in Surat.",
};

const TRUST_BADGES = [
  {
    label: "Expert Guidance",
    icon: Lightbulb,
    accent: "bg-rose-50 text-royal-magenta",
  },
  {
    label: "Tailored Solutions",
    icon: Sparkles,
    accent: "bg-sky-50 text-peacock-blue",
  },
  {
    label: "Fast Response",
    icon: Clock,
    accent: "bg-amber-50 text-saffron-gold",
  },
  {
    label: "Confidential",
    icon: ShieldCheck,
    accent: "bg-purple-50 text-royal-magenta",
  },
] as const;

export default function ConsultationPage() {
  return (
    <div className="bg-luxury-bg">
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-16 pt-10 lg:grid-cols-2 lg:pt-16">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
            Book a Consultation
          </p>
          <h1 className="font-serif text-4xl leading-tight text-luxury-text md:text-5xl lg:text-6xl">
            Let&apos;s Create Something
            <br />
            <span className="font-dancing bg-gradient-to-r from-saffron-gold via-royal-magenta to-peacock-blue bg-clip-text text-5xl text-transparent md:text-7xl">
              Extraordinary
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-luxury-muted">
            Share your vision with our atelier team—we&apos;ll help you shape
            packaging, branding, and print experiences that feel unmistakably
            premium.
          </p>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {TRUST_BADGES.map((badge) => {
              const Icon = badge.icon;
              return (
                <li
                  key={badge.label}
                  className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-white px-4 py-3 shadow-sm"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${badge.accent}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-luxury-text">
                    {badge.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
          <div
            className="absolute inset-0 bg-gradient-to-br from-rose-100 via-luxury-surface to-peacock-blue/30"
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <span className="font-serif text-2xl text-luxury-text/40 md:text-3xl">
              Peacock & Packaging
            </span>
            <span className="mt-2 text-sm text-luxury-muted">
              Studio showcase image
            </span>
          </div>
        </div>
      </section>

      <section className="border-y border-luxury-border bg-white py-12">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-royal-magenta" />
            <span className="h-1.5 w-1.5 rounded-full bg-saffron-gold" />
            <span className="h-1.5 w-1.5 rounded-full bg-peacock-blue" />
          </div>
          <h2 className="font-serif text-3xl text-luxury-text md:text-4xl">
            Schedule Your Consultation
          </h2>
          <p className="mt-4 text-luxury-muted">
            Tell us about your project and we&apos;ll respond within one
            business day.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pb-24 pt-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ConsultationForm />
        </div>
        <div className="lg:col-span-4">
          <ConsultationSidebar />
        </div>
      </section>
    </div>
  );
}
