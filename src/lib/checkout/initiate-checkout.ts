import { loadRazorpayScript } from "@/lib/razorpay/load-script";
import {
  formatOrderConfirmationSummary,
  labelOrderTotals,
} from "@/lib/checkout/totals";
import type {
  CheckoutCartItem,
  CheckoutErrorResponse,
  CheckoutOrderResponse,
} from "@/types/checkout";
import { normalizePhoneForRazorpay } from "@/lib/checkout/customer-notes";
import type { RazorpayHandlerResponse } from "@/types/razorpay";

export type RazorpayCheckoutPrefill = {
  name: string;
  email: string;
  contact: string;
};

type InitiateCheckoutOptions = {
  items: CheckoutCartItem[];
  description?: string;
  prefill?: RazorpayCheckoutPrefill;
  extraNotes?: Record<string, string>;
  onSuccess?: (
    response: RazorpayHandlerResponse,
  ) => void | Promise<void>;
  onDismiss?: () => void;
  onError?: (message: string) => void;
};

export async function initiateRazorpayCheckout({
  items,
  description = "V Design order",
  prefill,
  extraNotes,
  onSuccess,
  onDismiss,
  onError,
}: InitiateCheckoutOptions): Promise<void> {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  const payload = (await response.json()) as
    | CheckoutOrderResponse
    | CheckoutErrorResponse;

  if (!response.ok) {
    const message =
      "error" in payload ? payload.error : "Unable to initiate checkout";
    onError?.(message);
    throw new Error(message);
  }

  const order = payload as CheckoutOrderResponse;

  await loadRazorpayScript();

  if (!window.Razorpay) {
    const message = "Razorpay checkout failed to initialize";
    onError?.(message);
    throw new Error(message);
  }

  const totals = labelOrderTotals(order.totals);
  const invoiceSummary = formatOrderConfirmationSummary(totals);

  const razorpay = new window.Razorpay({
    key: order.keyId,
    amount: order.amount,
    currency: order.currency,
    name: "V Design",
    description: `${description}\n${invoiceSummary}`,
    order_id: order.orderId,
    theme: { color: "#0088A9" },
    notes: {
      invoice: invoiceSummary,
      ...extraNotes,
    },
    ...(prefill
      ? {
          prefill: {
            name: prefill.name,
            email: prefill.email,
            contact: normalizePhoneForRazorpay(prefill.contact),
          },
        }
      : {}),
    handler(response: RazorpayHandlerResponse) {
      Promise.resolve(onSuccess?.(response)).catch((error) => {
        console.error("Error in Razorpay success handler:", error);
        onError?.("Payment processing failed after checkout.");
      });
    },
    modal: {
      ondismiss() {
        onDismiss?.();
      },
    },
  });

  razorpay.on("payment.failed", () => {
    onError?.("Payment failed. Please try again.");
  });

  razorpay.open();
}
