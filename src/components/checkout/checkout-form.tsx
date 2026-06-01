"use client";

import { CheckoutOrderSummary } from "@/components/checkout/checkout-order-summary";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/use-cart";
import { customerDetailsToRazorpayNotes } from "@/lib/checkout/customer-notes";
import {
  getCitiesForState,
  INDIAN_STATES,
} from "@/lib/checkout/india-locations";
import { initiateRazorpayCheckout } from "@/lib/checkout/initiate-checkout";
import { calculateOrderTotals } from "@/lib/checkout/totals";
import { cn } from "@/lib/utils/cn";
import type { CheckoutCustomerDetails } from "@/types/checkout-customer";
import type {
  CheckoutVerifyErrorResponse,
  CheckoutVerifySuccessResponse,
} from "@/types/checkout-verify";
import type { RazorpayHandlerResponse } from "@/types/razorpay";
import { Info, Loader2, Lock } from "lucide-react";
import { useCallback, useState, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

const SELECT_CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;

const inputClass =
  "w-full h-9 rounded-md border border-border bg-surface px-3 text-body-sm text-text-primary outline-none transition-colors duration-base ease-luxury placeholder:text-text-muted/70 focus:border-peacock focus:ring-1 focus:ring-peacock disabled:cursor-not-allowed disabled:opacity-60";

const selectClass = cn(
  inputClass,
  "appearance-none bg-[length:1rem] bg-[right_0.5rem_center] bg-no-repeat pr-8",
);

type CheckoutFormValues = {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  state: string;
  city: string;
  pinCode: string;
};

function getVerifyFailureMessage(
  status: number,
  payload: CheckoutVerifySuccessResponse | CheckoutVerifyErrorResponse,
): string {
  if (status >= 500 || status === 401 || status === 403) {
    return "Payment captured, but failed to save order to database. Please contact support.";
  }

  if ("error" in payload && payload.error) {
    return payload.error;
  }

  return "Payment verification failed. Please contact support.";
}

type FieldProps = {
  label: string;
  htmlFor: string;
  children: ReactNode;
  className?: string;
};

function Field({ label, htmlFor, children, className }: FieldProps) {
  return (
    <div className={cn("block", className)}>
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-caption font-medium text-text-primary"
      >
        {label}
        <span className="text-magenta"> *</span>
      </label>
      {children}
    </div>
  );
}

function formValuesToCustomer(values: CheckoutFormValues): CheckoutCustomerDetails {
  return {
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    street: values.street.trim(),
    city: values.city.trim(),
    state: values.state.trim(),
    pinCode: values.pinCode.trim(),
  };
}

export function CheckoutForm() {
  const {
    cartItems,
    clearCart,
    closeCart,
    subtotalInInr,
    meetsMoqForCheckout,
    moqMessage,
  } = useCart();
  const [isPaying, setIsPaying] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      street: "",
      state: "Gujarat",
      city: "Surat",
      pinCode: "",
    },
  });

  const selectedState = useWatch({ control, name: "state" });
  const cityOptions = getCitiesForState(selectedState ?? "");

  const handleModalDismiss = useCallback(() => {
    setIsPaying(false);
    toast.error("Payment cancelled");
  }, []);

  const handleCheckoutError = useCallback((message: string) => {
    setIsPaying(false);
    toast.error(message);
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    if (cartItems.length === 0 || !meetsMoqForCheckout || isPaying) {
      return;
    }

    const customer = formValuesToCustomer(values);
    const totals = calculateOrderTotals(subtotalInInr);
    setIsPaying(true);

    const handlePaymentSuccess = async (response: RazorpayHandlerResponse) => {
      const toastId = toast.loading(
        "Verifying payment and generating order…",
      );

      try {
        const verifyResponse = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderData: {
              customer,
              items: cartItems.map((item) => ({
                productName: item.title,
                quantity: item.quantity,
                price: item.priceInInr,
              })),
              totalAmount: totals.grandTotalInInr,
            },
          }),
        });

        const payload = (await verifyResponse.json()) as
          | CheckoutVerifySuccessResponse
          | CheckoutVerifyErrorResponse;

        if (!verifyResponse.ok) {
          const message = getVerifyFailureMessage(
            verifyResponse.status,
            payload,
          );
          toast.error(
            `${message} Payment ID: ${response.razorpay_payment_id}`,
            { id: toastId, duration: 12000 },
          );
          setIsPaying(false);
          return;
        }

        toast.dismiss(toastId);

        if (typeof clearCart === "function") {
          clearCart();
        }
        closeCart();
        window.location.assign("/checkout/success");
      } catch (error) {
        console.error("[checkout] Payment verification failed:", error);
        toast.error(
          `Payment captured, but failed to save order to database. Please contact support. Payment ID: ${response.razorpay_payment_id}`,
          { id: toastId, duration: 12000 },
        );
        setIsPaying(false);
      }
    };

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
  });

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:items-start lg:gap-5">
      <form
        onSubmit={onSubmit}
        noValidate
        className="rounded-lg border border-border bg-surface/60 p-4 md:p-5"
      >
        <h2 className="font-serif text-heading text-text-primary">Checkout</h2>

        <fieldset className="mt-3 border-0 p-0">
          <legend className="sr-only">Customer details</legend>
          <p className="text-caption font-medium uppercase tracking-wider text-peacock">
            Customer
          </p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <Field label="Full name" htmlFor="fullName" className="sm:col-span-2">
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                className={inputClass}
                placeholder="Your full name"
                {...register("fullName", { required: "Full name is required" })}
              />
              {errors.fullName ? (
                <p className="mt-1 text-[11px] text-magenta">
                  {errors.fullName.message}
                </p>
              ) : null}
            </Field>
            <Field label="Email" htmlFor="email">
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={inputClass}
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email ? (
                <p className="mt-1 text-[11px] text-magenta">
                  {errors.email.message}
                </p>
              ) : null}
            </Field>
            <Field label="Phone" htmlFor="phone">
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                className={inputClass}
                placeholder="+91 98765 43210"
                {...register("phone", {
                  required: "Phone is required",
                  minLength: { value: 10, message: "Enter at least 10 digits" },
                  pattern: {
                    value: /^[\d\s+\-()]{10,15}$/,
                    message: "Enter a valid phone number",
                  },
                })}
              />
              {errors.phone ? (
                <p className="mt-1 text-[11px] text-magenta">
                  {errors.phone.message}
                </p>
              ) : null}
            </Field>
          </div>
        </fieldset>

        <fieldset className="mt-4 border-0 p-0">
          <legend className="sr-only">Shipping address</legend>
          <p className="text-caption font-medium uppercase tracking-wider text-peacock">
            Shipping
          </p>
          <div className="mt-2 grid gap-3">
            <Field label="Street address" htmlFor="street">
              <input
                id="street"
                type="text"
                autoComplete="street-address"
                className={inputClass}
                placeholder="Building, street, area"
                {...register("street", { required: "Street address is required" })}
              />
              {errors.street ? (
                <p className="mt-1 text-[11px] text-magenta">
                  {errors.street.message}
                </p>
              ) : null}
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="State" htmlFor="state">
                <select
                  id="state"
                  autoComplete="address-level1"
                  className={selectClass}
                  style={{ backgroundImage: SELECT_CHEVRON }}
                  {...register("state", {
                    required: "State is required",
                    onChange: () => {
                      setValue("city", "", {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    },
                  })}
                >
                  <option value="" disabled>
                    Select state
                  </option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state ? (
                  <p className="mt-1 text-[11px] text-magenta">
                    {errors.state.message}
                  </p>
                ) : null}
              </Field>

              <Field label="City" htmlFor="city">
                <select
                  id="city"
                  autoComplete="address-level2"
                  className={selectClass}
                  style={{ backgroundImage: SELECT_CHEVRON }}
                  disabled={cityOptions.length === 0}
                  {...register("city", { required: "City is required" })}
                >
                  <option value="" disabled>
                    {cityOptions.length === 0
                      ? "Select state first"
                      : "Select city"}
                  </option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city ? (
                  <p className="mt-1 text-[11px] text-magenta">
                    {errors.city.message}
                  </p>
                ) : null}
              </Field>
            </div>

            <Field label="PIN code" htmlFor="pinCode" className="sm:max-w-[10rem]">
              <input
                id="pinCode"
                type="text"
                autoComplete="postal-code"
                inputMode="numeric"
                className={inputClass}
                placeholder="395007"
                {...register("pinCode", {
                  required: "PIN code is required",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "Enter a 6-digit PIN code",
                  },
                })}
              />
              {errors.pinCode ? (
                <p className="mt-1 text-[11px] text-magenta">
                  {errors.pinCode.message}
                </p>
              ) : null}
            </Field>
          </div>

          <div
            className="mt-3 flex gap-3 rounded-md border border-border/80 bg-zinc-50/90 px-3.5 py-3"
            role="note"
          >
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-peacock"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <p className="font-sans text-caption leading-relaxed text-text-muted">
              Please ensure your shipping details are accurate. All
              consignments will be delivered exclusively to the address
              provided below.
            </p>
          </div>
        </fieldset>

        {moqMessage ? (
          <p className="mt-3 text-caption text-magenta">{moqMessage}</p>
        ) : null}

        <Button
          type="submit"
          variant="accent"
          className="mt-4 h-9 w-full text-body-sm text-white sm:w-auto sm:min-w-[220px] [&_svg]:text-white"
          disabled={!meetsMoqForCheckout || isPaying}
        >
          {isPaying ? (
            <span className="inline-flex items-center gap-2 text-white">
              <Loader2
                className="h-3.5 w-3.5 animate-spin text-white"
                aria-hidden="true"
              />
              Opening payment…
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 text-white">
              <Lock className="h-3.5 w-3.5 text-white" aria-hidden="true" />
              Pay securely with Razorpay
            </span>
          )}
        </Button>
      </form>

      <CheckoutOrderSummary
        cartItems={cartItems}
        subtotalInInr={subtotalInInr}
        moqMessage={moqMessage}
        compact
      />
    </div>
  );
}
