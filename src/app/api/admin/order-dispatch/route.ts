import { sendDispatchEmail } from "@/lib/email/send-dispatch-email";
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
  if (!body.sanityDocumentId?.trim()) return "sanityDocumentId is required";
  if (!body.awbNumber?.trim()) return "awbNumber is required";
  if (!body.courierName?.trim()) return "courierName is required";
  if (!body.customerEmail?.trim() || !EMAIL_PATTERN.test(body.customerEmail)) {
    return "A valid customerEmail is required";
  }
  if (!body.customerName?.trim()) return "customerName is required";
  if (!body.orderId?.trim()) return "orderId is required";
  return null;
}

export async function POST(req: NextRequest) {
  if (!isSanityAdminConfigured()) {
    return NextResponse.json<OrderDispatchErrorResponse>(
      { error: "Sanity write access is not configured (SANITY_API_TOKEN)" },
      { status: 503 },
    );
  }

  // ── 1. Parse body ────────────────────────────────────────────────────────
  let body: OrderDispatchRequestBody;
  try {
    body = (await req.json()) as OrderDispatchRequestBody;
  } catch {
    return NextResponse.json<OrderDispatchErrorResponse>(
      { error: "Invalid JSON in request body" },
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

  // ── 2. Verify order exists in Sanity ────────────────────────────────────
  const sanity = getSanityAdminClient();

  let existing: { _id: string; _type: string } | null;
  try {
    existing = await sanity.fetch<{ _id: string; _type: string } | null>(
      `*[_id == $id][0]{ _id, _type }`,
      { id: sanityDocumentId },
    );
  } catch (fetchErr) {
    console.error(
      `[order-dispatch] Sanity fetch failed for id ${sanityDocumentId}:`,
      fetchErr instanceof Error ? fetchErr.message : JSON.stringify(fetchErr),
    );
    return NextResponse.json<OrderDispatchErrorResponse>(
      { error: "Failed to look up order in database" },
      { status: 500 },
    );
  }

  if (!existing?._id || existing._type !== "order") {
    return NextResponse.json<OrderDispatchErrorResponse>(
      { error: `Order document not found or is not of type 'order' (id: ${sanityDocumentId})` },
      { status: 404 },
    );
  }

  // ── 3. Patch order status ────────────────────────────────────────────────
  try {
    await sanity
      .patch(sanityDocumentId)
      .set({ orderStatus: "Dispatched", awbNumber, courierName })
      .commit();
  } catch (patchErr) {
    console.error(
      `[order-dispatch] Sanity patch failed for order ${orderId}:`,
      patchErr instanceof Error ? patchErr.message : JSON.stringify(patchErr),
    );
    return NextResponse.json<OrderDispatchErrorResponse>(
      { error: "Failed to update order status in database" },
      { status: 500 },
    );
  }

  // ── 4. Send dispatch notification email ─────────────────────────────────
  const emailResult = await sendDispatchEmail({
    customerEmail,
    customerName,
    orderId,
    awbNumber,
    courierName,
  });

  if ("skipped" in emailResult) {
    // mail env not configured — order is updated, email not sent
    return NextResponse.json<OrderDispatchSuccessResponse>({
      success: true,
      message:
        "Order marked as Dispatched. Notification email was not sent (mail not configured on server).",
      sanityDocumentId,
      orderStatus: "Dispatched",
    });
  }

  if (!emailResult.sent) {
    // SMTP/template error — order IS updated, email failed
    return NextResponse.json<OrderDispatchSuccessResponse>({
      success: true,
      message: `Order marked as Dispatched. Notification email could not be sent: ${emailResult.error}`,
      sanityDocumentId,
      orderStatus: "Dispatched",
    });
  }

  // ── 5. Full success ──────────────────────────────────────────────────────
  return NextResponse.json<OrderDispatchSuccessResponse>({
    success: true,
    message: "Order dispatched and customer notified by email.",
    sanityDocumentId,
    orderStatus: "Dispatched",
  });
}
