import { ContactInfoCards } from "@/components/blocks/contact-info-cards";
import { ContactLayout } from "@/components/blocks/contact-layout";
import { PremiumCta } from "@/components/blocks/premium-cta";
import { TrustBadges } from "@/components/blocks/trust-badges";
import {
  DEFAULT_CONTACT_ADDRESS,
  DEFAULT_CONTACT_EMAIL,
  DEFAULT_CONTACT_PHONE,
  DEFAULT_CONTACT_WHATSAPP,
  DEFAULT_GOOGLE_MAP_EMBED_URL,
  DEFAULT_WORKING_HOURS,
} from "@/lib/contact/defaults";
import { client } from "@/sanity/lib/client";
import { CONTACT_PAGE_QUERY } from "@/sanity/lib/queries";
import type { ContactPageContent } from "@/types/contact";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Contact & Book Consultation",
  description:
    "Get in touch with V Design—Surat head office, Mumbai & Ahmedabad branches. Call, email, or send a message for quotes and consultations.",
};

export default async function ContactPage() {
  const content = await client.fetch<ContactPageContent | null>(CONTACT_PAGE_QUERY);

  const heroImageUrl = content?.heroImageUrl?.trim() || null;
  const email = content?.email?.trim() || DEFAULT_CONTACT_EMAIL;
  const phone = content?.phone?.trim() || DEFAULT_CONTACT_PHONE;
  const address = content?.address?.trim() || DEFAULT_CONTACT_ADDRESS;
  const whatsapp = content?.whatsapp?.trim() || DEFAULT_CONTACT_WHATSAPP;
  const workingHours =
    content?.workingHours?.trim() || DEFAULT_WORKING_HOURS;
  const googleMapUrl =
    content?.googleMapUrl?.trim() || DEFAULT_GOOGLE_MAP_EMBED_URL;

  return (
    <div className="overflow-x-hidden bg-white">
      <section className="relative overflow-hidden bg-luxury-bg pb-28 pt-10 md:pb-32 lg:pt-16">
        <div
          className="pointer-events-none absolute -right-20 top-16 h-96 w-96 rounded-full bg-royal-magenta/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-0 top-1/4 h-72 w-72 rounded-full bg-saffron-gold/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-royal-magenta">
              GET IN TOUCH
            </p>
            <h1 className="mb-6 font-serif text-5xl leading-tight text-luxury-text md:text-7xl">
              Let&apos;s Create Something{" "}
              <span className="font-dancing bg-gradient-to-r from-saffron-gold to-orange-500 bg-clip-text text-transparent">
                Extraordinary
              </span>
            </h1>
            <p className="mb-8 max-w-xl text-lg text-luxury-muted">
              Whether you need a quote, a creative partner, or production
              support—we&apos;re here to help you build a brand that feels truly
              premium.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#contact-form"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 text-sm font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Send Message
              </Link>
              <Link
                href="/consultation"
                className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-8 py-3 text-sm font-medium text-luxury-text transition-colors hover:border-royal-magenta hover:text-royal-magenta"
              >
                Book Consultation
              </Link>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-peacock-blue/20 via-transparent to-royal-magenta/15 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xl">
              {heroImageUrl ? (
                <Image
                  src={heroImageUrl}
                  alt="V Design studio and contact"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <>
                  <div className="grid h-full grid-cols-2 gap-2 p-3">
                    <div className="rounded-xl bg-gradient-to-br from-peacock-blue/30 to-zinc-100" />
                    <div className="mt-6 rounded-xl bg-gradient-to-br from-royal-magenta/25 to-amber-50" />
                    <div className="rounded-xl bg-gradient-to-br from-saffron-gold/30 to-rose-50" />
                    <div className="rounded-xl bg-gradient-to-br from-zinc-100 to-peacock-blue/20" />
                  </div>
                  <Image
                    src="/logo.png"
                    alt=""
                    width={64}
                    height={64}
                    className="absolute left-1/2 top-1/2 h-14 w-auto -translate-x-1/2 -translate-y-1/2 opacity-25"
                    aria-hidden="true"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="relative isolate z-0 bg-white">
        <ContactInfoCards
          email={email}
          phone={phone}
          address={address}
          whatsapp={whatsapp}
          workingHours={workingHours}
        />
      </div>

      <ContactLayout
        googleMapUrl={googleMapUrl}
        offices={content?.offices}
      />
      <TrustBadges variant="contact" />
      <PremiumCta
        title="Ready to Start Your Project?"
        description="Book a consultation or send us your brief—we'll respond with ideas, timelines, and a clear path forward."
      />
    </div>
  );
}
