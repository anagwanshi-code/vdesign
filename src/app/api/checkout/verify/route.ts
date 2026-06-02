import { generateOrderId } from "@/lib/checkout/generate-order-id";
import { formatShippingAddress } from "@/lib/checkout/customer-notes";
import { generateOrderReceiptHTML } from "@/lib/email/order-receipt-template";
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

/** Studio copy of every order confirmation email */
const ORDER_RECEIPT_ADMIN_BCC = "vdesign.viky@gmail.com";

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
      orderStatus: "Paid",
      razorpayOrderId,
      razorpayPaymentId,
    });

    try {
      const transporter = createMailTransporter();
      const fromAddress = process.env.GMAIL_USER;
      const customerEmail = orderData.customer.email.trim();

      if (transporter && fromAddress && customerEmail) {
        await transporter.sendMail({
          from: `"V Design" <${fromAddress}>`,
          to: customerEmail,
          bcc: ORDER_RECEIPT_ADMIN_BCC,
          replyTo: fromAddress,
          subject: "Order Confirmation - V Design",
          html: generateOrderReceiptHTML({
            orderId,
            orderDate: new Date(),
            email: customerEmail,
            customerName: customer.fullName.trim(),
            phone: customer.phone.trim(),
            shippingAddress: formatShippingAddress(customer),
            items: orderData.items.map((item) => ({
              productName: item.productName.trim(),
              quantity: item.quantity,
              price: item.price,
            })),
            totalAmount: orderData.totalAmount,
            paymentId: razorpayPaymentId,
          }),
        });
      } else {
        console.warn(
          "[checkout/verify] Mail not configured or missing customer email; skipping receipt",
        );
      }
    } catch (emailError) {
      console.error("[checkout/verify] Order receipt email failed:", emailError);
    }

    try {
      const webhookUrl = process.env.MAKE_WEBHOOK_URL?.trim();

      if (webhookUrl) {
        const makePayload = {
          orderId,
          sanityDocumentId: document._id,
          paymentStatus: "Paid" as const,
          razorpayOrderId,
          razorpayPaymentId,
          shippingAddress: formatShippingAddress(customer),
          customer: orderData.customer,
          items: orderData.items,
          totalAmount: orderData.totalAmount,
        };

        const webhookResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(makePayload),
        });

        if (!webhookResponse.ok) {
          console.error(
            "[checkout/verify] Make.com webhook failed:",
            webhookResponse.status,
            await webhookResponse.text().catch(() => ""),
          );
        }
      }
    } catch (webhookError) {
      console.error("[checkout/verify] Make.com webhook error:", webhookError);
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
