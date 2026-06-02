import { generateOrderDispatchHTML } from "@/lib/email/order-dispatch-template";
import { createMailTransporter, isMailConfigured } from "@/lib/email/transporter";
import {
  getSanityAdminClient,
  isSanityAdminConfigured,
} from "@/sanity/lib/admin-client";
import type {
  OrderDispatchErrorResponse,
  OrderDispatchRequestBody,
  OrderDispatchSuccessResponse,
} from "@/types/order-dispatch";
import { type NextRequest, NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateBody(
  body: Partial<OrderDispatchRequestBody>,
): string | null {
  if (!body.sanityDocumentId?.trim()) {
    return "sanityDocumentId is required";
  }
  if (!body.awbNumber?.trim()) {
    return "awbNumber is required";
  }
  if (!body.courierName?.trim()) {
    return "courierName is required";
  }
  if (!body.customerEmail?.trim() || !EMAIL_PATTERN.test(body.customerEmail)) {
    return "A valid customerEmail is required";
  }
  if (!body.customerName?.trim()) {
    return "customerName is required";
  }
  if (!body.orderId?.trim()) {
    return "orderId is required";
  }
  return null;
}

export async function POST(req: NextRequest) {
  if (!isSanityAdminConfigured()) {
    return NextResponse.json<OrderDispatchErrorResponse>(
      { error: "Sanity write access is not configured (SANITY_API_TOKEN)" },
      { status: 503 },
    );
  }

  let body: OrderDispatchRequestBody;

  try {
    body = (await req.json()) as OrderDispatchRequestBody;
  } catch {
    return NextResponse.json<OrderDispatchErrorResponse>(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const validationError = validateBody(body);
  if (validationError) {
    return NextResponse.json<OrderDispatchErrorResponse>(
      { error: validationError },
      { status: 400 },
    );
  }

  const sanityDocumentId = body.sanityDocumentId.trim();
  const awbNumber = body.awbNumber.trim();
  const courierName = body.courierName.trim();
  const customerEmail = body.customerEmail.trim();
  const customerName = body.customerName.trim();
  const orderId = body.orderId.trim();

  try {
    const sanity = getSanityAdminClient();

    const existing = await sanity.fetch<{ _id: string; _type: string } | null>(
      `*[_id == $id][0]{ _id, _type }`,
      { id: sanityDocumentId },
    );

    if (!existing?._id || existing._type !== "order") {
      return NextResponse.json<OrderDispatchErrorResponse>(
        { error: "Order document not found" },
        { status: 404 },
      );
    }

    await sanity
      .patch(sanityDocumentId)
      .set({
        orderStatus: "Dispatched",
        awbNumber,
        courierName,
      })
      .commit();

    try {
      if (!isMailConfigured()) {
        console.warn(
          "[admin/order-dispatch] Mail not configured; dispatch email skipped",
        );
      } else {
        const transporter = createMailTransporter();
        const fromAddress = process.env.GMAIL_USER;

        if (transporter && fromAddress) {
          await transporter.sendMail({
            from: `"V Design" <${fromAddress}>`,
            to: customerEmail,
            replyTo: fromAddress,
            subject: `Your order has been dispatched — ${orderId}`,
            html: generateOrderDispatchHTML({
              customerName,
              orderId,
              awbNumber,
              courierName,
            }),
          });
        }
      }
    } catch (emailError) {
      console.error("[admin/order-dispatch] Dispatch email failed:", emailError);

      return NextResponse.json<OrderDispatchSuccessResponse>({
        success: true,
        message:
          "Order updated to Dispatched; dispatch notification email could not be sent",
        sanityDocumentId,
        orderStatus: "Dispatched",
      });
    }

    return NextResponse.json<OrderDispatchSuccessResponse>({
      success: true,
      message: "Order dispatched and customer notified",
      sanityDocumentId,
      orderStatus: "Dispatched",
    });
  } catch (error) {
    console.error("[admin/order-dispatch] Failed:", error);

    return NextResponse.json<OrderDispatchErrorResponse>(
      { error: "Failed to update order dispatch status" },
      { status: 500 },
    );
  }
}
