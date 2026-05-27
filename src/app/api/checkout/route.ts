import { createRazorpayClient } from "@/lib/razorpay/client";
import {
  getRazorpayPublicKey,
  isRazorpayConfigured,
} from "@/lib/razorpay/config";
import { buildCheckoutOrderNotes } from "@/lib/checkout/order-notes";
import {
  calculateOrderTotals,
  orderTotalsToPaise,
} from "@/lib/checkout/totals";
import { isQuantityValidForSaleType } from "@/lib/commerce/moq";
import { normalizeMoq } from "@/lib/commerce/moq";
import type {
  CheckoutErrorResponse,
  CheckoutOrderResponse,
  CheckoutRequestBody,
} from "@/types/checkout";
import { type NextRequest, NextResponse } from "next/server";

function validateItems(items: CheckoutRequestBody["items"]): string | null {
  if (!Array.isArray(items) || items.length === 0) {
    return "Cart is empty";
  }

  for (const item of items) {
    if (!item.productId || !item.title) {
      return "Each cart item requires a productId and title";
    }

    if (!Number.isFinite(item.quantity) || item.quantity < 1) {
      return "Invalid item quantity";
    }

    if (!Number.isFinite(item.priceInInr) || item.priceInInr <= 0) {
      return "Invalid item price";
    }

    const minOrderQuantity = normalizeMoq(item.minOrderQuantity);

    if (
      !isQuantityValidForSaleType(
        item.quantity,
        minOrderQuantity,
        item.saleType,
      )
    ) {
      return `Invalid quantity for ${item.title}`;
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json<CheckoutErrorResponse>(
      { error: "Razorpay is not configured on the server" },
      { status: 503 },
    );
  }

  let body: CheckoutRequestBody;

  try {
    body = (await req.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json<CheckoutErrorResponse>(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const validationError = validateItems(body.items);

  if (validationError) {
    return NextResponse.json<CheckoutErrorResponse>(
      { error: validationError },
      { status: 400 },
    );
  }

  const subtotalInInr = body.items.reduce(
    (sum, item) => sum + item.priceInInr * item.quantity,
    0,
  );
  const totals = calculateOrderTotals(subtotalInInr);
  const amountInPaise = orderTotalsToPaise(totals.grandTotalInInr);

  if (amountInPaise < 100) {
    return NextResponse.json<CheckoutErrorResponse>(
      { error: "Order total must be at least ₹1" },
      { status: 400 },
    );
  }

  const razorpay = createRazorpayClient();

  if (!razorpay) {
    return NextResponse.json<CheckoutErrorResponse>(
      { error: "Unable to initialize Razorpay client" },
      { status: 503 },
    );
  }

  try {
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `vdl_${Date.now()}`,
      notes: buildCheckoutOrderNotes(body.items, totals),
    });

    return NextResponse.json<CheckoutOrderResponse>({
      orderId: order.id,
      amount: Number(order.amount),
      currency: "INR",
      keyId: getRazorpayPublicKey(),
      totals,
    });
  } catch (error) {
    console.error("[Razorpay] Order creation failed:", error);

    return NextResponse.json<CheckoutErrorResponse>(
      { error: "Failed to create Razorpay order" },
      { status: 500 },
    );
  }
}
