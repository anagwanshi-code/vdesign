import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How V Design collects, uses, and protects your personal information when you browse, inquire, or shop with us.",
};

const SECTIONS = [
  {
    title: "Introduction",
    body: "V Design (“we,” “us,” or “our”) respects your privacy. This policy explains how we handle information when you visit our website, request a consultation, or purchase print and packaging services. This is placeholder copy—please replace with your final legal text before launch.",
  },
  {
    title: "Information We Collect",
    body: "We may collect contact details (name, email, phone), business information you provide in forms, order and billing details for commerce transactions, and technical data such as IP address, browser type, and pages visited. Payment card data is processed by our payment provider and is not stored on our servers.",
  },
  {
    title: "How We Use Your Information",
    body: "We use collected information to respond to inquiries, fulfill orders, improve our services, send service-related communications, and comply with legal obligations. Marketing messages are sent only where you have opted in or where permitted by applicable law.",
  },
  {
    title: "Cookies & Analytics",
    body: "Our site may use cookies and similar technologies to remember preferences, measure performance, and understand how visitors use our pages. You can adjust cookie settings in your browser; some features may not work correctly if essential cookies are disabled.",
  },
  {
    title: "Sharing & Third Parties",
    body: "We may share data with trusted service providers (hosting, CMS, payment processing, email delivery) who process information on our behalf under contractual safeguards. We do not sell your personal information to third parties for their own marketing.",
  },
  {
    title: "Data Retention & Security",
    body: "We retain information only as long as needed for the purposes described in this policy or as required by law. We implement reasonable technical and organizational measures to protect your data; no method of transmission over the internet is completely secure.",
  },
  {
    title: "Your Rights",
    body: "Depending on your location, you may have rights to access, correct, delete, or restrict processing of your personal data, and to withdraw consent where processing is consent-based. To exercise these rights, contact us using the details on our website.",
  },
  {
    title: "Updates & Contact",
    body: "We may update this policy from time to time; the “last updated” date below will change when we do. For privacy-related questions, reach out via the contact information on our Consultation or Contact pages.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-5 pb-24 pt-10 md:px-8 lg:px-20 lg:pb-32 lg:pt-16">
      <p className="text-overline uppercase text-saffron">Legal</p>
      <h1 className="mt-4 font-serif text-display-lg text-text-primary">
        Privacy Policy
      </h1>
      <p className="mt-4 text-body-sm text-text-muted">
        Last updated: May 2026 · Placeholder for review by your legal counsel.
      </p>

      <div className="mt-10 space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="font-serif text-heading-md text-text-primary">
              {section.title}
            </h2>
            <p className="mt-3 text-body-md leading-relaxed text-text-muted">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
