import { formatShippingAddress } from "@/lib/checkout/customer-notes";
import { formatInr } from "@/lib/checkout/totals";
import type { CheckoutCustomerDetails } from "@/types/checkout-customer";
import type { CheckoutVerifyOrderItem } from "@/types/checkout-verify";

export type OrderReceiptData = {
  orderId: string;
  customer: CheckoutCustomerDetails;
  items: CheckoutVerifyOrderItem[];
  totalAmount: number;
  paymentId?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return vercel.startsWith("http") ? vercel.replace(/\/$/, "") : `https://${vercel}`;
  }

  return "https://vdesignluxury.com";
}

function formatLineTotal(item: CheckoutVerifyOrderItem): string {
  return formatInr(item.price * item.quantity);
}

export function generateOrderReceiptHTML(orderData: OrderReceiptData): string {
  const { orderId, customer, items, totalAmount, paymentId } = orderData;
  const siteUrl = getSiteUrl();
  const logoUrl = `${siteUrl}/logo.png`;
  const shippingAddress = formatShippingAddress(customer);

  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #E9E1D8;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#1A1A1A;">
            ${escapeHtml(item.productName)}
          </td>
          <td align="center" style="padding:14px 8px;border-bottom:1px solid #E9E1D8;font-family:system-ui,sans-serif;font-size:14px;color:#666666;">
            ${item.quantity}
          </td>
          <td align="right" style="padding:14px 0;border-bottom:1px solid #E9E1D8;font-family:system-ui,sans-serif;font-size:14px;color:#666666;">
            ${formatInr(item.price)}
          </td>
          <td align="right" style="padding:14px 0;border-bottom:1px solid #E9E1D8;font-family:system-ui,sans-serif;font-size:14px;font-weight:600;color:#1A1A1A;">
            ${formatLineTotal(item)}
          </td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order confirmed — ${escapeHtml(orderId)}</title>
</head>
<body style="margin:0;padding:0;background-color:#FCFAF7;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#FCFAF7;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#FFFFFF;border:1px solid #E9E1D8;border-radius:12px;overflow:hidden;box-shadow:0 8px 40px -8px rgba(26,26,26,0.12);">
          <tr>
            <td style="padding:32px 32px 24px;text-align:center;background:radial-gradient(ellipse at top, rgba(233,30,99,0.08), #FFFFFF 55%);">
              <img src="${logoUrl}" alt="V Design" width="140" style="display:block;margin:0 auto 20px;max-width:140px;height:auto;" />
              <p style="margin:0 0 8px;font-family:system-ui,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#E2A03F;">
                Order confirmed
              </p>
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:500;line-height:1.2;color:#1A1A1A;">
                Thank you, ${escapeHtml(customer.fullName)}
              </h1>
              <p style="margin:12px 0 0;font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#666666;">
                Your payment was received. Our studio will contact you shortly regarding proofing and dispatch.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#FFF7F2;border:1px solid #E9E1D8;border-radius:8px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;font-family:system-ui,sans-serif;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#0088A9;">
                      Order reference
                    </p>
                    <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#1A1A1A;">
                      ${escapeHtml(orderId)}
                    </p>
                    ${
                      paymentId
                        ? `<p style="margin:10px 0 0;font-family:system-ui,sans-serif;font-size:12px;color:#666666;">Payment ID: ${escapeHtml(paymentId)}</p>`
                        : ""
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 8px;">
              <h2 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:500;color:#1A1A1A;">
                Customer &amp; shipping
              </h2>
              <p style="margin:0 0 6px;font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;color:#666666;">
                <strong style="color:#1A1A1A;">${escapeHtml(customer.fullName)}</strong><br />
                ${escapeHtml(customer.email)}<br />
                ${escapeHtml(customer.phone)}
              </p>
              <p style="margin:12px 0 0;font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;color:#666666;">
                ${escapeHtml(shippingAddress)}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 8px;">
              <h2 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:500;color:#1A1A1A;">
                Your order
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <thead>
                  <tr>
                    <th align="left" style="padding:0 0 10px;font-family:system-ui,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#999999;font-weight:600;">
                      Item
                    </th>
                    <th align="center" style="padding:0 8px 10px;font-family:system-ui,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#999999;font-weight:600;">
                      Qty
                    </th>
                    <th align="right" style="padding:0 0 10px;font-family:system-ui,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#999999;font-weight:600;">
                      Unit
                    </th>
                    <th align="right" style="padding:0 0 10px;font-family:system-ui,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#999999;font-weight:600;">
                      Line total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="right" style="padding:16px 0 0;border-top:2px solid #1A1A1A;">
                    <p style="margin:0;font-family:system-ui,sans-serif;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#666666;">
                      Total paid
                    </p>
                    <p style="margin:6px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:26px;color:#D91E63;">
                      ${formatInr(totalAmount)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;text-align:center;">
              <a href="${siteUrl}/shop" style="display:inline-block;padding:14px 28px;background:linear-gradient(90deg,#E91E63,#9333ea);color:#FFFFFF;text-decoration:none;border-radius:999px;font-family:system-ui,sans-serif;font-size:15px;font-weight:500;">
                Continue shopping
              </a>
              <p style="margin:20px 0 0;font-family:system-ui,sans-serif;font-size:12px;line-height:1.5;color:#999999;">
                Questions? Reply to this email or visit
                <a href="${siteUrl}/consultation" style="color:#0088A9;text-decoration:none;">our consultation page</a>.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:24px 0 0;font-family:system-ui,sans-serif;font-size:11px;color:#999999;">
          © ${new Date().getFullYear()} V Design · Premium print &amp; packaging
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
