"use client";

import { cn } from "@/lib/utils/cn";
import {
  Building2,
  Check,
  Globe,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRef, useState, type FormEvent, type ReactNode } from "react";

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-luxury-text outline-none transition-colors focus:border-royal-magenta focus:ring-1 focus:ring-royal-magenta";

const selectClass = cn(inputClass, "appearance-none");

type FieldProps = {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

function Field({ label, required, children, className }: FieldProps) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-sm font-medium text-luxury-text">
        {label}
        {required ? <span className="text-royal-magenta"> *</span> : null}
      </span>
      {children}
    </label>
  );
}

type IconInputProps = {
  icon: LucideIcon;
  type?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
};

function IconInput({
  icon: Icon,
  type = "text",
  name,
  placeholder,
  required,
}: IconInputProps) {
  return (
    <div className="relative">
      <Icon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-luxury-muted"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className={cn(inputClass, "pl-10")}
      />
    </div>
  );
}

export function ConsultationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsSuccess(true);
        formRef.current?.reset();
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert(
          "Something went wrong while sending your request. Please try again or contact us directly.",
        );
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || isSuccess;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm"
      aria-label="Book a consultation"
    >
      <h2 className="mb-6 font-semibold text-royal-magenta">Your Details</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="Full Name" required>
          <IconInput icon={User} name="name" placeholder="Your name" required />
        </Field>
        <Field label="Company / Brand">
          <IconInput
            icon={Building2}
            name="company"
            placeholder="Company or brand name"
          />
        </Field>
        <Field label="Email Address">
          <IconInput
            icon={Mail}
            name="email"
            type="email"
            placeholder="you@company.com"
          />
        </Field>
        <Field label="Website">
          <IconInput icon={Globe} name="website" placeholder="https://" />
        </Field>
        <Field label="Contact Number" required>
          <IconInput
            icon={Phone}
            name="contactNumber"
            type="tel"
            placeholder="+91"
            required
          />
        </Field>
        <Field label="Preferred Contact Method" required>
          <select
            name="preferredMethod"
            required
            className={selectClass}
            defaultValue=""
          >
            <option value="" disabled>
              Select method
            </option>
            <option value="call">Call</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
          </select>
        </Field>
      </div>

      <h2 className="mb-6 mt-10 font-semibold text-royal-magenta">
        About Your Project
      </h2>

      <div className="space-y-6">
        <Field label="Select Service Interest" required>
          <select name="service" required className={selectClass} defaultValue="">
            <option value="" disabled>
              Choose a service
            </option>
            <option value="branding">Branding & Identity</option>
            <option value="packaging">Packaging Design</option>
            <option value="printing">Printing Solutions</option>
            <option value="digital">Digital Marketing</option>
            <option value="web">Web Design</option>
            <option value="consultancy">Consultancy</option>
          </select>
        </Field>

        <Field label="Tell us about your project" required>
          <div className="relative">
            <MessageSquare
              className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-luxury-muted"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <textarea
              name="details"
              rows={4}
              required
              placeholder="Share your goals, timeline, and vision..."
              className={cn(inputClass, "resize-none pl-10")}
            />
          </div>
        </Field>

        <div>
          <p className="mb-2 text-sm font-medium text-luxury-text">
            Attach Reference Files (Optional)
          </p>
          <input
            type="file"
            name="attachment"
            accept="image/*,.pdf"
            className="w-full text-sm text-zinc-500 transition-all file:mr-4 file:rounded-full file:border-0 file:bg-royal-magenta/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-royal-magenta hover:file:bg-royal-magenta/20"
          />
          <p className="mt-2 text-xs text-luxury-muted">
            Max file size: 5MB (JPG, PNG, PDF)
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Estimated Budget">
            <select name="budget" className={selectClass} defaultValue="">
              <option value="" disabled>
                Select range
              </option>
              <option value="under-50k">Under ₹50,000</option>
              <option value="50k-2l">₹50,000 – ₹2,00,000</option>
              <option value="2l-5l">₹2,00,000 – ₹5,00,000</option>
              <option value="5l-plus">₹5,00,000+</option>
            </select>
          </Field>

          <Field label="When do you want to start?">
            <select name="startTimeline" className={selectClass} defaultValue="">
              <option value="" disabled>
                Select timeline
              </option>
              <option value="asap">As soon as possible</option>
              <option value="2-weeks">Within 2 weeks</option>
              <option value="1-month">Within 1 month</option>
              <option value="flexible">Flexible</option>
            </select>
          </Field>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <button
          type="submit"
          disabled={isDisabled}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-90",
            isSuccess
              ? "bg-emerald-600 hover:bg-emerald-600"
              : "bg-royal-magenta hover:bg-peacock-blue",
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending...
            </>
          ) : isSuccess ? (
            <>
              <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
              Request Sent Successfully!
            </>
          ) : (
            "Book My Consultation"
          )}
        </button>
        <p className="flex items-center gap-2 text-xs text-luxury-muted">
          <Lock className="h-4 w-4 shrink-0 text-royal-magenta/70" strokeWidth={1.5} />
          Your information is safe and confidential
        </p>
      </div>
    </form>
  );
}
