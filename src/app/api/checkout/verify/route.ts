import { generateOrderId } from "@/lib/checkout/generate-order-id";
import { formatShippingAddress } from "@/lib/checkout/customer-notes";
import { generateOrderReceiptHTML } from "@/lib/email/order-receipt";
import { createMailTransporter } from "@/lib/email/transporter";
import { isRazorpayConfigured } from "@/lib/razorpay/config";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay/verify-signature";
import { randomKey } from "@/sanity/lib/random-key";
import {
  getSanityAdminClient,
  isSanityAdminConfigured,
} from "@/sanity/lib/admin-client";
import type {
  CheckoutVerifyErrorResponse,
  CheckoutVerifyRequestBody,
  CheckoutVerifySuccessResponse,
} from "@/types/checkout-verify";
import { type NextRequest, NextResponse } from "next/server";

function validateOrderData(
  orderData: CheckoutVerifyRequestBody["orderData"],
): string | null {
  const { customer, items, totalAmount } = orderData ?? {};

  if (!customer?.fullName?.trim()) {
    return "Customer name is required";
  }
  if (!customer.email?.trim()) {
    return "Customer email is required";
  }
  if (!customer.phone?.trim()) {
    return "Customer phone is required";
  }
  if (!formatShippingAddress(customer).trim()) {
    return "Shipping address is required";
  }
  if (!Array.isArray(items) || items.length === 0) {
    return "Order items are required";
  }

  for (const item of items) {
    if (!item.productName?.trim()) {
      return "Each item requires a product name";
    }
    if (!Number.isFinite(item.quantity) || item.quantity < 1) {
      return "Invalid item quantity";
    }
    if (!Number.isFinite(item.price) || item.price < 0) {
      return "Invalid item price";
    }
  }

  if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
    return "Invalid order total";
  }

  return null;
}

export async function POST(req: NextRequest) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json<CheckoutVerifyErrorResponse>(
      { error: "Razorpay is not configured on the server" },
      { status: 503 },
    );
  }

  if (!isSanityAdminConfigured()) {
    return NextResponse.json<CheckoutVerifyErrorResponse>(
      { error: "Sanity write access is not configured (SANITY_API_TOKEN)" },
      { status: 503 },
    );
  }

  let body: CheckoutVerifyRequestBody;

  try {
    body = (await req.json()) as CheckoutVerifyRequestBody;
  } catch {
    return NextResponse.json<CheckoutVerifyErrorResponse>(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const {
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
    orderData,
  } = body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return NextResponse.json<CheckoutVerifyErrorResponse>(
      { error: "Missing Razorpay verification fields" },
      { status: 400 },
    );
  }

  const orderDataError = validateOrderData(orderData);
  if (orderDataError) {
    return NextResponse.json<CheckoutVerifyErrorResponse>(
      { error: orderDataError },
      { status: 400 },
    );
  }

  const secret = process.env.RAZORPAY_KEY_SECRET ?? "";
  const isValid = verifyRazorpayPaymentSignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
    secret,
  });

  if (!isValid) {
    return NextResponse.json<CheckoutVerifyErrorResponse>(
      { error: "Payment signature verification failed" },
      { status: 400 },
    );
  }

  const orderId = generateOrderId();
  const customer = orderData.customer;

  try {
    const sanity = getSanityAdminClient();
    const document = await sanity.create({
      _type: "order",
      orderId,
      customerName: customer.fullName.trim(),
      email: customer.email.trim(),
      phone: customer.phone.trim(),
      shippingAddress: formatShippingAddress(customer),
      totalAmount: orderData.totalAmount,
      items: orderData.items.map((item) => ({
        _key: randomKey(),
        productName: item.productName.trim(),
        quantity: item.quantity,
        price: item.price,
      })),
      paymentStatus: "Paid",
      razorpayOrderId,
      razorpayPaymentId,
    });

    try {
      const transporter = createMailTransporter();
      const fromAddress = process.env.GMAIL_USER;

      if (transporter && fromAddress) {
        await transporter.sendMail({
          from: `"V Design" <${fromAddress}>`,
          to: customer.email.trim(),
          replyTo: fromAddress,
          subject: `Order confirmed — ${orderId}`,
          html: generateOrderReceiptHTML({
            orderId,
            customer,
            items: orderData.items,
            totalAmount: orderData.totalAmount,
            paymentId: razorpayPaymentId,
          }),
        });
      } else {
        console.warn(
          "[checkout/verify] Mail not configured; skipping order receipt email",
        );
      }
    } catch (emailError) {
      console.error("[checkout/verify] Order receipt email failed:", emailError);
    }

    return NextResponse.json<CheckoutVerifySuccessResponse>({
      orderId,
      sanityDocumentId: document._id,
    });
  } catch (error) {
    console.error("[checkout/verify] Sanity order create failed:", error);

    return NextResponse.json<CheckoutVerifyErrorResponse>(
      { error: "Failed to save order. Please contact support with your payment ID." },
      { status: 500 },
    );
  }
}
