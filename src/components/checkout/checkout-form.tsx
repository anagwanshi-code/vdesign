"use client";

import { CheckoutOrderSummary } from "@/components/checkout/checkout-order-summary";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/use-cart";
import { customerDetailsToRazorpayNotes } from "@/lib/checkout/customer-notes";
import { initiateRazorpayCheckout } from "@/lib/checkout/initiate-checkout";
import { cn } from "@/lib/utils/cn";
import type { CheckoutCustomerDetails } from "@/types/checkout-customer";
import type { RazorpayHandlerResponse } from "@/types/razorpay";
import { Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { toast } from "sonner";

const inputClass =
  "w-full rounded-md border border-border bg-surface px-4 py-3 text-body text-text-primary outline-none transition-colors duration-base ease-luxury placeholder:text-text-muted/70 focus:border-peacock focus:ring-1 focus:ring-peacock";

type FieldProps = {
  label: string;
  htmlFor: string;
  children: ReactNode;
  className?: string;
};

function Field({ label, htmlFor, children, className }: FieldProps) {
  return (
    <div className={cn("block", className)}>
      <label htmlFor={htmlFor} className="mb-2 block text-body font-medium text-text-primary">
        {label}
        <span className="text-magenta"> *</span>
      </label>
      {children}
    </div>
  );
}

function readCustomerFromForm(form: HTMLFormElement): CheckoutCustomerDetails {
  const data = new FormData(form);
  return {
    fullName: String(data.get("fullName") ?? "").trim(),
    email: String(data.get("email") ?? "").trim(),
    phone: String(data.get("phone") ?? "").trim(),
    street: String(data.get("street") ?? "").trim(),
    city: String(data.get("city") ?? "").trim(),
    state: String(data.get("state") ?? "").trim(),
    pinCode: String(data.get("pinCode") ?? "").trim(),
  };
}

export function CheckoutForm() {
  const router = useRouter();
  const {
    cartItems,
    clearCart,
    closeCart,
    subtotalInInr,
    meetsMoqForCheckout,
    moqMessage,
  } = useCart();
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      router.replace("/shop");
    }
  }, [cartItems.length, router]);

  const handlePaymentSuccess = useCallback(
    (_response: RazorpayHandlerResponse) => {
      try {
        if (typeof clearCart === "function") {
          clearCart();
        }
        closeCart();
        router.push("/checkout/success");
      } catch (error) {
        console.error("Error in Razorpay success handler:", error);
        window.location.href = "/checkout/success";
      }
    },
    [clearCart, closeCart, router],
  );

  const handleModalDismiss = useCallback(() => {
    setIsPaying(false);
    toast.error("Payment cancelled");
  }, []);

  const handleCheckoutError = useCallback((message: string) => {
    setIsPaying(false);
    toast.error(message);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cartItems.length === 0 || !meetsMoqForCheckout || isPaying) {
      return;
    }

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const customer = readCustomerFromForm(form);
    setIsPaying(true);

    try {
      await initiateRazorpayCheckout({
        items: cartItems.map((item) => ({
          productId: item.productId,
          title: item.title,
          quantity: item.quantity,
          priceInInr: item.priceInInr,
          sku: item.sku,
          saleType: item.saleType,
          minOrderQuantity: item.minOrderQuantity,
          logoFileName: item.logoFileName,
          uploadInstructions: item.uploadInstructions,
        })),
        description: "V Design · Checkout",
        prefill: {
          name: customer.fullName,
          email: customer.email,
          contact: customer.phone,
        },
        extraNotes: customerDetailsToRazorpayNotes(customer),
        onSuccess: handlePaymentSuccess,
        onDismiss: handleModalDismiss,
        onError: handleCheckoutError,
      });
    } catch (error) {
      handleCheckoutError(
        error instanceof Error
          ? error.message
          : "Checkout unavailable. Please try again.",
      );
    }
  };

  if (cartItems.length === 0) {
    return (
      <p className="text-body text-text-muted">
        Redirecting to shop…{" "}
        <Link href="/shop" className="text-peacock underline">
          Continue shopping
        </Link>
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:gap-12 lg:items-start">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-surface/60 p-6 md:p-8"
      >
        <h2 className="font-serif text-heading-md text-text-primary">
          Customer details
        </h2>
        <p className="mt-2 text-caption text-text-muted">
          All fields are required. Your details will prefill the secure Razorpay
          payment window.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <Field label="Full name" htmlFor="fullName" className="sm:col-span-2">
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              autoComplete="name"
              className={inputClass}
              placeholder="Your full name"
            />
          </Field>

          <Field label="Email address" htmlFor="email">
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputClass}
              placeholder="you@example.com"
            />
          </Field>

          <Field label="Phone number" htmlFor="phone">
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              minLength={10}
              maxLength={15}
              pattern="[\d\s+\-()]{10,15}"
              className={inputClass}
              placeholder="+91 98765 43210"
            />
          </Field>
        </div>

        <h3 className="mt-10 font-serif text-heading text-text-primary">
          Shipping address
        </h3>

        <div className="mt-6 grid gap-6">
          <Field label="Street address" htmlFor="street">
            <input
              id="street"
              name="street"
              type="text"
              required
              autoComplete="street-address"
              className={inputClass}
              placeholder="Building, street, area"
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="City" htmlFor="city">
              <input
                id="city"
                name="city"
                type="text"
                required
                autoComplete="address-level2"
                className={inputClass}
                placeholder="City"
              />
            </Field>

            <Field label="State" htmlFor="state">
              <input
                id="state"
                name="state"
                type="text"
                required
                autoComplete="address-level1"
                className={inputClass}
                placeholder="State"
              />
            </Field>
          </div>

          <Field label="PIN code" htmlFor="pinCode" className="sm:max-w-xs">
            <input
              id="pinCode"
              name="pinCode"
              type="text"
              required
              autoComplete="postal-code"
              inputMode="numeric"
              pattern="[0-9]{6}"
              minLength={6}
              maxLength={6}
              className={inputClass}
              placeholder="395007"
            />
          </Field>
        </div>

        {moqMessage ? (
          <p className="mt-6 text-caption text-magenta">{moqMessage}</p>
        ) : null}

        <Button
          type="submit"
          variant="accent"
          className="mt-8 w-full sm:w-auto sm:min-w-[240px]"
          disabled={!meetsMoqForCheckout || isPaying}
        >
          {isPaying ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Opening payment…
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Lock className="h-4 w-4" aria-hidden="true" />
              Pay securely with Razorpay
            </span>
          )}
        </Button>
      </form>

      <CheckoutOrderSummary
        cartItems={cartItems}
        subtotalInInr={subtotalInInr}
        moqMessage={moqMessage}
      />
    </div>
  );
}
