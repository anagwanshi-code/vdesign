import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms governing use of the V Design website and purchase of premium print, packaging, and branding services.",
};

const SECTIONS = [
  {
    title: "Introduction",
    body: "These Terms & Conditions (“Terms”) govern your use of the V Design website and your engagement with our studio for print, packaging, and related creative services. By accessing our site or placing an order, you agree to these Terms. This document is placeholder copy—replace with counsel-approved language before production use.",
  },
  {
    title: "Services & Quotations",
    body: "Project scope, materials, finishes, timelines, and pricing are confirmed in written quotations or order confirmations. Custom work is produced to approved specifications; changes after approval may incur additional fees and schedule adjustments.",
  },
  {
    title: "Intellectual Property",
    body: "Unless otherwise agreed in writing, V Design retains ownership of preliminary concepts, studio methodologies, and unused creative directions. Upon full payment, agreed deliverables are licensed or assigned as specified in your project agreement. You warrant that assets you supply do not infringe third-party rights.",
  },
  {
    title: "Payment Terms",
    body: "Deposits may be required to commence production. Balance is due per the payment schedule on your invoice. Online shop purchases are charged at checkout via our payment provider. Late payments may pause work and accrue interest where permitted by law.",
  },
  {
    title: "Production, Proofing & Approval",
    body: "You are responsible for reviewing proofs, color references, and structural samples before final production. Approved proofs constitute authorization to proceed; V Design is not liable for errors present in approved materials.",
  },
  {
    title: "Shipping & Delivery",
    body: "Delivery timelines are estimates unless guaranteed in writing. Risk of loss passes upon handover to the carrier or upon studio pickup, as applicable. Shipping costs, duties, and taxes are borne by the client unless stated otherwise.",
  },
  {
    title: "Returns, Cancellations & Defects",
    body: "Custom and made-to-order goods are generally non-returnable except for material defects or deviations from approved specifications reported promptly in writing. Cancellation fees may apply once production has begun. Remedies are limited to reprint, credit, or refund at our reasonable discretion.",
  },
  {
    title: "Limitation of Liability",
    body: "To the fullest extent permitted by law, V Design’s liability is limited to the fees paid for the specific order giving rise to the claim. We are not liable for indirect, consequential, or lost-profit damages arising from use of our products or site.",
  },
  {
    title: "Governing Law & Contact",
    body: "These Terms are governed by the laws of India, with courts in Surat, Gujarat having exclusive jurisdiction unless mandatory consumer protections apply elsewhere. Questions about these Terms may be directed through our website contact channels.",
  },
] as const;

export default function TermsPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-5 pb-24 pt-10 md:px-8 lg:pb-32 lg:pt-16">
      <p className="text-overline uppercase text-saffron">Legal</p>
      <h1 className="mt-4 font-serif text-display-lg text-text-primary">
        Terms & Conditions
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
