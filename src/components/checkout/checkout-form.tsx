"use client";

import { CheckoutEmailVerify } from "@/components/checkout/checkout-email-verify";
import { CheckoutOrderSummary } from "@/components/checkout/checkout-order-summary";
import { customerDetailsToRazorpayNotes } from "@/lib/checkout/customer-notes";
import {
  getCitiesForState,
  INDIAN_STATES,
} from "@/lib/checkout/india-locations";
import { initiateRazorpayCheckout } from "@/lib/checkout/initiate-checkout";
import {
  selectMoqValidation,
  selectOrderTotals,
  selectSubtotalInInr,
  useCartStore,
} from "@/lib/store/useCartStore";
import { cn } from "@/lib/utils/cn";
import type { CheckoutCustomerDetails } from "@/types/checkout-customer";
import type { VerifyOtpProfile } from "@/types/auth-otp";
import type {
  CheckoutVerifyErrorResponse,
  CheckoutVerifySuccessResponse,
} from "@/types/checkout-verify";
import type { RazorpayHandlerResponse } from "@/types/razorpay";
import { Info, Loader2, Lock } from "lucide-react";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

const SELECT_CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;

const inputClass =
  "w-full border border-gray-200 bg-white px-3 py-2.5 font-sans text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-pink-600 focus:ring-1 focus:ring-pink-600/20 disabled:cursor-not-allowed disabled:opacity-60";

const selectClass = cn(
  inputClass,
  "appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-9",
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
        className="mb-1.5 block font-sans text-xs font-semibold uppercase tracking-wider text-gray-700"
      >
        {label}
        <span className="text-pink-600"> *</span>
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
  const cartItems = useCartStore((state) => state.items);
  const shippingConfig = useCartStore((state) => state.shippingConfig);
  const closeCart = useCartStore((state) => state.closeCart);

  const subtotalInInr = useMemo(
    () => selectSubtotalInInr(cartItems),
    [cartItems],
  );

  const { meetsMoqForCheckout, moqMessage } = useMemo(
    () => selectMoqValidation(cartItems),
    [cartItems],
  );

  const orderTotals = useMemo(
    () => selectOrderTotals(cartItems, shippingConfig),
    [cartItems, shippingConfig],
  );

  const [isPaying, setIsPaying] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isValid, isDirty },
  } = useForm<CheckoutFormValues>({
    mode: "onChange",
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

  const watchedEmail = useWatch({ control, name: "email" });
  const selectedState = useWatch({ control, name: "state" });
  const cityOptions = getCitiesForState(selectedState ?? "");

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    (watchedEmail ?? "").trim(),
  );

  const canProceedToPayment =
    cartItems.length > 0 && meetsMoqForCheckout && isValid && !isPaying;

  const applyVerifiedProfile = useCallback(
    (profile: VerifyOtpProfile | null) => {
      if (!profile) return;

      if (profile.customerName) {
        setValue("fullName", profile.customerName, { shouldValidate: true });
      }
      if (profile.phone) {
        setValue("phone", profile.phone, { shouldValidate: true });
      }
      if (profile.street) {
        setValue("street", profile.street, { shouldValidate: true });
      }
      if (profile.state) {
        setValue("state", profile.state, { shouldValidate: true });
      }
      if (profile.city) {
        const cities = getCitiesForState(profile.state ?? "");
        const cityValue =
          cities.includes(profile.city) || cities.length === 0
            ? profile.city
            : "";
        if (cityValue) {
          setValue("city", cityValue, { shouldValidate: true });
        }
      } else if (profile.shippingAddress && !profile.street) {
        setValue("street", profile.shippingAddress, { shouldValidate: true });
      }
      if (profile.pinCode) {
        setValue("pinCode", profile.pinCode, { shouldValidate: true });
      }
    },
    [setValue],
  );

  const handleModalDismiss = useCallback(() => {
    setIsPaying(false);
    toast.error("Payment cancelled");
  }, []);

  const handleCheckoutError = useCallback((message: string) => {
    setIsPaying(false);
    toast.error(message);
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    if (!canProceedToPayment) {
      return;
    }

    const customer = formValuesToCustomer(values);
    const totals = selectOrderTotals(cartItems, shippingConfig);
    setIsPaying(true);

    const handlePaymentSuccess = async (response: RazorpayHandlerResponse) => {
      const toastId = toast.loading("Verifying payment and generating order…");

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
                premiumAddons: item.premiumAddons?.map((a) => a.addonName),
                volumeDiscountPercent: item.volumeDiscountPercent,
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
        useCartStore.getState().clearCart();
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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-start">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
        <section className="border border-gray-200 bg-white p-5 md:p-6">
          <h2 className="font-serif text-2xl font-medium text-gray-950">
            Contact &amp; Shipping Details
          </h2>
          <p className="mt-2 font-sans text-sm text-gray-600">
            Guest checkout — enter your details to receive your receipt and
            delivery updates.
          </p>

          <fieldset className="mt-6 border-0 p-0">
            <legend className="sr-only">Contact information</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" htmlFor="fullName" className="sm:col-span-2">
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  className={inputClass}
                  placeholder="Your full name"
                  {...register("fullName", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Enter your full name",
                    },
                  })}
                />
                {errors.fullName ? (
                  <p className="mt-1 font-sans text-xs text-pink-700">
                    {errors.fullName.message}
                  </p>
                ) : null}
              </Field>

              <div className="flex flex-col gap-2">
                <Field label="Email Address" htmlFor="email">
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
                        message: "Enter a valid email address",
                      },
                    })}
                  />
                  {errors.email ? (
                    <p className="mt-1 font-sans text-xs text-pink-700">
                      {errors.email.message}
                    </p>
                  ) : null}
                </Field>
                <CheckoutEmailVerify
                  email={(watchedEmail ?? getValues("email") ?? "").trim()}
                  isEmailValid={isEmailValid}
                  onVerified={applyVerifiedProfile}
                />
              </div>

              <Field label="Mobile Number" htmlFor="phone">
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  className={inputClass}
                  placeholder="+91 98765 43210"
                  {...register("phone", {
                    required: "Mobile number is required",
                    minLength: {
                      value: 10,
                      message: "Enter at least 10 digits",
                    },
                    pattern: {
                      value: /^[\d\s+\-()]{10,15}$/,
                      message: "Enter a valid mobile number",
                    },
                  })}
                />
                {errors.phone ? (
                  <p className="mt-1 font-sans text-xs text-pink-700">
                    {errors.phone.message}
                  </p>
                ) : null}
              </Field>
            </div>
          </fieldset>

          <fieldset className="mt-8 border-0 border-t border-gray-100 p-0 pt-8">
            <legend className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Delivery Address
            </legend>
            <div className="grid gap-4">
              <Field label="Street Address" htmlFor="street">
                <input
                  id="street"
                  type="text"
                  autoComplete="street-address"
                  className={inputClass}
                  placeholder="Building, street, area"
                  {...register("street", {
                    required: "Delivery address is required",
                  })}
                />
                {errors.street ? (
                  <p className="mt-1 font-sans text-xs text-pink-700">
                    {errors.street.message}
                  </p>
                ) : null}
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
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
                    <p className="mt-1 font-sans text-xs text-pink-700">
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
                    <p className="mt-1 font-sans text-xs text-pink-700">
                      {errors.city.message}
                    </p>
                  ) : null}
                </Field>
              </div>

              <Field label="PIN Code" htmlFor="pinCode" className="sm:max-w-[10rem]">
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
                  <p className="mt-1 font-sans text-xs text-pink-700">
                    {errors.pinCode.message}
                  </p>
                ) : null}
              </Field>
            </div>

            <div
              className="mt-5 flex gap-3 border border-gray-200 bg-gray-50 px-4 py-3"
              role="note"
            >
              <Info
                className="mt-0.5 h-4 w-4 shrink-0 text-gray-500"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="font-sans text-xs leading-relaxed text-gray-600">
                Please ensure your shipping details are accurate. All
                consignments will be delivered exclusively to the address
                provided above.
              </p>
            </div>
          </fieldset>
        </section>

        {moqMessage ? (
          <p className="font-sans text-sm text-pink-700">{moqMessage}</p>
        ) : null}

        {!isValid && isDirty ? (
          <p className="font-sans text-sm text-gray-600">
            Complete all contact and shipping fields to proceed to payment.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!canProceedToPayment}
          className={cn(
            "flex w-full items-center justify-center gap-2 bg-pink-600 bg-gradient-to-r from-rose-600 to-pink-600 py-4 font-sans text-sm font-bold uppercase tracking-[0.2em] text-white transition-all duration-500 ease-out",
            "hover:-translate-y-0.5 hover:from-pink-500 hover:to-rose-400 hover:shadow-[0_8px_25px_rgb(225,29,72,0.4)]",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none",
          )}
        >
          {isPaying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Opening payment…
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" aria-hidden="true" />
              Proceed to Payment ·{" "}
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(orderTotals.grandTotalInInr)}
            </>
          )}
        </button>
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
