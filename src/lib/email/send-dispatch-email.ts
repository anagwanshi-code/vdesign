import { generateOrderDispatchHTML } from "@/lib/email/order-dispatch-template";
import { createMailTransporter, isMailConfigured } from "@/lib/email/transporter";

export type DispatchEmailPayload = {
  customerEmail: string;
  customerName: string;
  orderId: string;
  awbNumber: string;
  courierName: string;
};

export type DispatchEmailResult =
  | { sent: true }
  | { sent: false; skipped: true; reason: string }
  | { sent: false; error: string };

function formatError(err: unknown): string {
  if (err instanceof Error) {
    return `${err.name}: ${err.message}${err.cause ? ` (cause: ${String(err.cause)})` : ""}`;
  }
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export async function sendDispatchEmail(
  payload: DispatchEmailPayload,
): Promise<DispatchEmailResult> {
  const { customerEmail, customerName, orderId, awbNumber, courierName } = payload;

  // --- guard: mail not configured ---
  if (!isMailConfigured()) {
    const reason = "GMAIL_USER or GMAIL_APP_PASSWORD env var is missing";
    console.warn(`[dispatch-email] Skipped for order ${orderId}: ${reason}`);
    return { sent: false, skipped: true, reason };
  }

  const fromAddress = process.env.GMAIL_USER as string;

  const transporter = createMailTransporter();
  if (!transporter) {
    const reason = "createMailTransporter() returned null despite isMailConfigured() passing";
    console.error(`[dispatch-email] ${reason} for order ${orderId}`);
    return { sent: false, error: reason };
  }

  // --- verify SMTP connection before attempting send ---
  try {
    await transporter.verify();
  } catch (verifyErr) {
    const reason = `SMTP verify failed: ${formatError(verifyErr)}`;
    console.error(`[dispatch-email] ${reason} for order ${orderId}`);
    return { sent: false, error: reason };
  }

  const subject = `Your order has been dispatched — ${orderId}`;
  const html = generateOrderDispatchHTML({ customerName, orderId, awbNumber, courierName });

  try {
    const info = await transporter.sendMail({
      from: `"V Design" <${fromAddress}>`,
      to: customerEmail,
      replyTo: fromAddress,
      subject,
      html,
    });

    console.info(
      `[dispatch-email] Sent to ${customerEmail} for order ${orderId} — messageId: ${info.messageId}`,
    );
    return { sent: true };
  } catch (sendErr) {
    const reason = formatError(sendErr);
    console.error(`[dispatch-email] sendMail failed for order ${orderId}: ${reason}`);
    return { sent: false, error: reason };
  }
}
