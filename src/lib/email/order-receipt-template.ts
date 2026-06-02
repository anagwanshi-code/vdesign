import {
  calculateOrderTotals,
  formatInr,
  labelOrderTotals,
} from "@/lib/checkout/totals";

export type OrderReceiptEmailItem = {
  productName: string;
  quantity: number;
  price: number;
};

/** Payload for order confirmation emails (verify API + Sanity). */
export type OrderReceiptEmailOrder = {
  orderId: string;
  orderDate?: string | Date;
  email: string;
  customerName: string;
  phone?: string;
  shippingAddress: string;
  items: OrderReceiptEmailItem[];
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
    return vercel.startsWith("http")
      ? vercel.replace(/\/$/, "")
      : `https://${vercel}`;
  }

  return "https://vdesign-surat.vercel.app";
}

/**
 * Public HTTPS logo for order receipt emails.
 *
 * Gmail, Yahoo, and Outlook cannot load images from localhost (127.0.0.1:3000) or
 * relative paths (/logo.png). During local checkout testing you must use a fully
 * public URL below.
 *
 * Replace with a direct .png link when needed, e.g.:
 * - Imgur direct image URL (https://i.imgur.com/….png)
 * - Sanity CDN (https://cdn.sanity.io/images/<projectId>/<dataset>/<file>.png)
 * - Live site after deploy (https://yourdomain.com/logo.png)
 *
 * Optional override: set ORDER_RECEIPT_LOGO_URL in .env.local
 */
const ORDER_EMAIL_LOGO_FALLBACK =
  "https://vdesignluxury.com/logo.png";

function isLocalSiteUrl(siteUrl: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(siteUrl);
}

function getLogoUrl(): string {
  const envLogo = process.env.ORDER_RECEIPT_LOGO_URL?.trim();
  if (envLogo) {
    return envLogo;
  }

  const siteUrl = getSiteUrl();

  // Always use a public fallback when developing locally so Gmail shows the logo
  if (isLocalSiteUrl(siteUrl) || process.env.NODE_ENV === "development") {
    return ORDER_EMAIL_LOGO_FALLBACK;
  }

  return `${siteUrl}/logo.png`;
}

function formatOrderDate(value?: string | Date): string {
  const date = value ? new Date(value) : new Date();
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function sumItemsSubtotal(items: OrderReceiptEmailItem[]): number {
  return items.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  );
}

function renderSummaryRow(
  label: string,
  value: string,
  options?: { emphasize?: boolean; grand?: boolean },
): string {
  const labelStyle = options?.grand
    ? "font-family:Georgia,'Times New Roman',serif;font-size:15px;font-weight:500;color:#1A1A1A;"
    : "font-family:'Segoe UI',system-ui,sans-serif;font-size:13px;color:#5C5C5C;";
  const valueStyle = options?.grand
    ? "font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:500;color:#1A1A1A;"
    : options?.emphasize
      ? "font-family:'Segoe UI',system-ui,sans-serif;font-size:13px;font-weight:600;color:#1A1A1A;"
      : "font-family:'Segoe UI',system-ui,sans-serif;font-size:13px;color:#1A1A1A;";

  const padding = options?.grand ? "padding-top:14px;" : "padding:6px 0;";

  return `
    <tr>
      <td style="${padding}">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="${labelStyle}">${label}</td>
            <td align="right" style="${valueStyle}">${value}</td>
          </tr>
        </table>
      </td>
    </tr>`;
}

export function generateOrderReceiptHTML(order: OrderReceiptEmailOrder): string {
  const orderId = order.orderId ?? "";
  const customerName = order.customerName ?? "";
  const email = order.email ?? "";
  const shippingAddress = order.shippingAddress ?? "";
  const items = Array.isArray(order.items) ? order.items : [];
  const orderDateLabel = formatOrderDate(order.orderDate);
  const siteUrl = getSiteUrl();
  const logoUrl = getLogoUrl();
  const gstPercent = 18;

  const subtotalInInr = sumItemsSubtotal(items);
  const totals = labelOrderTotals(calculateOrderTotals(subtotalInInr));
  const grandTotalLabel =
    Number(order.totalAmount) > 0
      ? formatInr(order.totalAmount)
      : totals.grandTotalLabel;

  const itemRows = items
    .map((item) => {
      const name = escapeHtml(String(item.productName ?? ""));
      const qty = Number(item.quantity) || 0;
      const unit = Number(item.price) || 0;
      const lineTotal = formatInr(unit * qty);

      return `
        <tr>
          <td style="padding:11px 0;border-bottom:1px solid #EBE6E0;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#1A1A1A;">
            ${name}
          </td>
          <td align="center" width="48" style="padding:11px 6px;border-bottom:1px solid #EBE6E0;font-family:'Segoe UI',system-ui,sans-serif;font-size:13px;color:#5C5C5C;">
            ${qty}
          </td>
          <td align="right" width="72" style="padding:11px 6px;border-bottom:1px solid #EBE6E0;font-family:'Segoe UI',system-ui,sans-serif;font-size:13px;color:#5C5C5C;">
            ${formatInr(unit)}
          </td>
          <td align="right" width="88" style="padding:11px 0;border-bottom:1px solid #EBE6E0;font-family:'Segoe UI',system-ui,sans-serif;font-size:13px;font-weight:600;color:#1A1A1A;">
            ${lineTotal}
          </td>
        </tr>`;
    })
    .join("");

  const paymentLine = order.paymentId
    ? `<p style="margin:8px 0 0;font-family:'Segoe UI',system-ui,sans-serif;font-size:11px;color:#777777;">Payment reference: ${escapeHtml(order.paymentId)}</p>`
    : "";

  const summaryRows = [
    renderSummaryRow("Subtotal", totals.subtotalLabel),
    renderSummaryRow(`GST (${gstPercent}%)`, totals.gstLabel),
    renderSummaryRow("Shipping", totals.shippingLabel),
    renderSummaryRow("Grand total", grandTotalLabel, { grand: true }),
  ].join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmation — ${escapeHtml(orderId)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F0EB;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F3F0EB;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <!-- max-width 600px — optimal for email clients and A4 print -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border:1px solid #E0DAD2;border-radius:6px;overflow:hidden;box-shadow:0 12px 48px -12px rgba(26,26,26,0.14);">
          <!-- Premium accent bar -->
          <tr>
            <td height="4" style="background:linear-gradient(90deg,#E91E63 0%,#0088A9 50%,#E2A03F 100%);font-size:0;line-height:4px;">&nbsp;</td>
          </tr>
          <!-- Brand header -->
          <tr>
            <td style="padding:32px 36px 28px;text-align:center;background:linear-gradient(180deg,#FFF9F6 0%,#FFFFFF 100%);border-bottom:1px solid #EBE6E0;">
              <img src="${logoUrl}" alt="V Design" style="max-width: 200px; width: 100%; height: auto; display: block; margin: 0 auto; border: none; outline: none;" />
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:500;letter-spacing:0.04em;color:#1A1A1A;">
                V Design
              </p>
              <p style="margin:8px 0 0;font-family:'Segoe UI',system-ui,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#0088A9;">
                Premium print &amp; packaging
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 36px 12px;">
              <h1 style="margin:0 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:500;line-height:1.35;color:#1A1A1A;">
                Thank you for your order
              </h1>
              <p style="margin:0;font-family:'Segoe UI',system-ui,sans-serif;font-size:14px;line-height:1.65;color:#5C5C5C;">
                Dear ${escapeHtml(customerName)}, your payment has been received and your order is confirmed. We will contact you shortly regarding proofing and dispatch.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 36px 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(135deg,#FAFAF8 0%,#FFF7F2 100%);border:1px solid #EBE6E0;border-radius:4px;">
                <tr>
                  <td style="padding:18px 22px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="50%" valign="top" style="padding-right:12px;border-right:1px solid #EBE6E0;">
                          <p style="margin:0 0 4px;font-family:'Segoe UI',system-ui,sans-serif;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#999999;">Order ID</p>
                          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#1A1A1A;">${escapeHtml(orderId)}</p>
                        </td>
                        <td width="50%" valign="top" style="padding-left:12px;">
                          <p style="margin:0 0 4px;font-family:'Segoe UI',system-ui,sans-serif;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#999999;">Date</p>
                          <p style="margin:0;font-family:'Segoe UI',system-ui,sans-serif;font-size:14px;color:#1A1A1A;">${escapeHtml(orderDateLabel)}</p>
                          ${paymentLine}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:4px 36px 20px;">
              <h2 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:17px;font-weight:500;color:#1A1A1A;">
                Items ordered
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #EBE6E0;">
                <thead>
                  <tr>
                    <th align="left" style="padding:10px 0 8px;font-family:'Segoe UI',system-ui,sans-serif;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#999999;font-weight:600;border-bottom:1px solid #EBE6E0;">Product</th>
                    <th align="center" width="48" style="padding:10px 6px 8px;font-family:'Segoe UI',system-ui,sans-serif;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#999999;font-weight:600;border-bottom:1px solid #EBE6E0;">Qty</th>
                    <th align="right" width="72" style="padding:10px 6px 8px;font-family:'Segoe UI',system-ui,sans-serif;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#999999;font-weight:600;border-bottom:1px solid #EBE6E0;">Price</th>
                    <th align="right" width="88" style="padding:10px 0 8px;font-family:'Segoe UI',system-ui,sans-serif;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#999999;font-weight:600;border-bottom:1px solid #EBE6E0;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows || `<tr><td colspan="4" style="padding:12px 0;font-size:13px;color:#5C5C5C;">No line items</td></tr>`}
                </tbody>
              </table>
              <!-- Financial breakdown -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px;border-top:1px solid #EBE6E0;">
                <tbody>
                  ${summaryRows}
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 36px 28px;">
              <h2 style="margin:0 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:17px;font-weight:500;color:#1A1A1A;">
                Shipping address
              </h2>
              <p style="margin:0 0 6px;font-family:'Segoe UI',system-ui,sans-serif;font-size:14px;line-height:1.6;color:#5C5C5C;">
                ${escapeHtml(shippingAddress)}
              </p>
              <p style="margin:0;font-family:'Segoe UI',system-ui,sans-serif;font-size:12px;color:#888888;">
                ${escapeHtml(email)}${order.phone ? ` · ${escapeHtml(order.phone)}` : ""}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 36px;text-align:center;background:linear-gradient(180deg,#FAFAF8 0%,#F5F2ED 100%);border-top:1px solid #EBE6E0;">
              <p style="margin:0;font-family:'Segoe UI',system-ui,sans-serif;font-size:12px;line-height:1.55;color:#888888;">
                Surat, India · <a href="${siteUrl}" style="color:#0088A9;text-decoration:none;">Visit our studio</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-family:'Segoe UI',system-ui,sans-serif;font-size:11px;color:#AAAAAA;">
          © ${new Date().getFullYear()} V Design
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
