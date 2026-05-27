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
import type { RazorpayHandlerResponse } from "@/types/razorpay";

type InitiateCheckoutOptions = {
  items: CheckoutCartItem[];
  description?: string;
  onSuccess?: (response: RazorpayHandlerResponse) => void;
  onDismiss?: () => void;
  onError?: (message: string) => void;
};

export async function initiateRazorpayCheckout({
  items,
  description = "V Design Luxury order",
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
    name: "V Design Luxury",
    description: `${description}\n${invoiceSummary}`,
    order_id: order.orderId,
    theme: { color: "#0088A9" },
    notes: {
      invoice: invoiceSummary,
    },
    handler(response: RazorpayHandlerResponse) {
      window.alert(
        `Payment successful!\n\n${invoiceSummary}\n\nPayment ID: ${response.razorpay_payment_id}`,
      );
      onSuccess?.(response);
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
