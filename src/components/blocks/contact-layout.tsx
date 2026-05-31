"use client";

import { SectionDivider } from "@/components/blocks/section-divider";
import {
  DEFAULT_GOOGLE_MAP_EMBED_URL,
  resolveContactOffices,
} from "@/lib/contact/defaults";
import { cn } from "@/lib/utils/cn";
import type { ContactLayoutProps } from "@/types/contact";
import { CheckCircle2, Loader2, MapPin, Send, X } from "lucide-react";
import { useCallback, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";

const PREFERRED_CONTACT_OPTIONS = [
  { value: "phone", label: "Phone" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
] as const;

const inputClass =
  "mb-4 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-luxury-text outline-none transition-colors focus:border-royal-magenta focus:ring-1 focus:ring-royal-magenta";

const selectClass =
  "mb-4 w-full appearance-none rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-luxury-text outline-none transition-colors focus:border-royal-magenta focus:ring-1 focus:ring-royal-magenta";

export function ContactLayout({
  googleMapUrl,
  offices,
}: ContactLayoutProps = {}) {
  const mapSrc =
    googleMapUrl?.trim() || DEFAULT_GOOGLE_MAP_EMBED_URL;
  const officeList = useMemo(
    () => resolveContactOffices(offices),
    [offices],
  );
  const [activeOfficeId, setActiveOfficeId] = useState(
    () => officeList[0]?.id ?? "office-0",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const selectedOffice =
    officeList.find((office) => office.id === activeOfficeId) ?? officeList[0];

  const closeSuccessModal = useCallback(() => {
    setShowSuccessModal(false);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      preferredContactMode: String(
        formData.get("preferredContactMode") ?? "",
      ).trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: { success?: boolean; error?: string } = {};
      try {
        data = (await response.json()) as { success?: boolean; error?: string };
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to send message");
      }

      form.reset();
      setIsSubmitting(false);
      setShowSuccessModal(true);
      toast.success(
        "Your message has been sent successfully! We will contact you soon.",
        { duration: 6000 },
      );
    } catch (error) {
      setIsSubmitting(false);
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again or call us directly.";
      toast.error(message);
    }
  };

  return (
    <>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-16 lg:grid-cols-2">
        <div id="contact-form">
          <h2 className="font-serif text-3xl text-luxury-text md:text-4xl">
            Send Us a Message
          </h2>
          <SectionDivider />

          <form onSubmit={handleSubmit} className="mt-8" aria-label="Contact form">
            <input
              type="text"
              name="name"
              placeholder="Your Name *"
              required
              autoComplete="name"
              disabled={isSubmitting}
              className={inputClass}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              required
              autoComplete="email"
              disabled={isSubmitting}
              className={inputClass}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              required
              autoComplete="tel"
              disabled={isSubmitting}
              className={inputClass}
            />
            <label className="sr-only" htmlFor="preferredContactMode">
              Preferred Mode of Contact
            </label>
            <select
              id="preferredContactMode"
              name="preferredContactMode"
              required
              defaultValue=""
              disabled={isSubmitting}
              className={selectClass}
            >
              <option value="" disabled>
                Preferred Mode of Contact *
              </option>
              {PREFERRED_CONTACT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="subject"
              placeholder="Subject *"
              required
              disabled={isSubmitting}
              className={inputClass}
            />
            <textarea
              name="message"
              rows={5}
              placeholder="Your Message *"
              required
              disabled={isSubmitting}
              className={cn(inputClass, "resize-none")}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-80 sm:w-auto sm:px-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        <div>
          <h2 className="font-serif text-3xl text-luxury-text md:text-4xl">
            Our Office
          </h2>
          <SectionDivider />

          <ul className="mt-8 space-y-4">
            {officeList.map((office) => (
              <li key={office.id}>
                <button
                  type="button"
                  onClick={() => setActiveOfficeId(office.id)}
                  className={cn(
                    "flex w-full gap-4 rounded-xl border p-4 text-left transition-colors",
                    activeOfficeId === office.id
                      ? "border-royal-magenta/20 bg-royal-magenta/5"
                      : "border-zinc-100 bg-white hover:border-zinc-200",
                  )}
                >
                  <MapPin
                    className={cn(
                      "mt-0.5 h-5 w-5 shrink-0",
                      activeOfficeId === office.id
                        ? "text-royal-magenta"
                        : "text-luxury-muted",
                    )}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-luxury-text">{office.title}</p>
                    <p className="mt-1 text-sm text-luxury-muted">
                      {office.address}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          <div className="relative mt-6 aspect-[16/10] min-h-64 w-full overflow-hidden rounded-xl border border-zinc-100 bg-zinc-100 shadow-sm">
            <iframe
              src={mapSrc}
              title={`Map — ${selectedOffice?.mapLabel ?? "V Design"}`}
              className="absolute inset-0 h-full w-full rounded-xl border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      {showSuccessModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-success-title"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
            <button
              type="button"
              onClick={closeSuccessModal}
              className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
              aria-label="Close success message"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <CheckCircle2
              className="mx-auto mb-4 h-14 w-14 text-emerald-500"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <h3
              id="contact-success-title"
              className="mb-2 font-serif text-2xl text-luxury-text"
            >
              Message Sent!
            </h3>
            <p className="text-sm leading-relaxed text-luxury-muted">
              Your message has been sent successfully! We will contact you soon.
            </p>
            <button
              type="button"
              onClick={closeSuccessModal}
              className="mt-6 inline-flex rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
