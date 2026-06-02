export type OrderDispatchEmailData = {
  customerName: string;
  orderId: string;
  awbNumber: string;
  courierName: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function generateOrderDispatchHTML(data: OrderDispatchEmailData): string {
  const customerName = escapeHtml(data.customerName || "Customer");
  const orderId = escapeHtml(data.orderId);
  const awbNumber = escapeHtml(data.awbNumber);
  const courierName = escapeHtml(data.courierName);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your order has been dispatched — ${orderId}</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F0EB;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F3F0EB;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border:1px solid #E0DAD2;border-radius:6px;overflow:hidden;">
          <tr>
            <td height="4" style="background:linear-gradient(90deg,#0088A9,#E91E63);font-size:0;line-height:4px;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:36px 32px 24px;text-align:center;background:linear-gradient(180deg,#F0F9FB 0%,#FFFFFF 100%);border-bottom:1px solid #EBE6E0;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:500;color:#1A1A1A;">V Design</p>
              <p style="margin:10px 0 0;font-family:'Segoe UI',system-ui,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#0088A9;">Order dispatched</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;">
              <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:500;line-height:1.35;color:#1A1A1A;">
                Your order is on its way
              </h1>
              <p style="margin:0;font-family:'Segoe UI',system-ui,sans-serif;font-size:15px;line-height:1.65;color:#5C5C5C;">
                Dear ${customerName}, thank you for your patience. Your V Design order has been handed over to our courier partner and is now in transit.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 32px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#FAFAF8;border:1px solid #EBE6E0;border-radius:4px;">
                <tr>
                  <td style="padding:22px 24px;">
                    <p style="margin:0 0 14px;font-family:'Segoe UI',system-ui,sans-serif;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#888888;">Shipment details</p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:8px 0;font-family:'Segoe UI',system-ui,sans-serif;font-size:13px;color:#5C5C5C;">Order ID</td>
                        <td align="right" style="padding:8px 0;font-family:Georgia,serif;font-size:15px;color:#1A1A1A;">${orderId}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-top:1px solid #EBE6E0;font-family:'Segoe UI',system-ui,sans-serif;font-size:13px;color:#5C5C5C;">Courier</td>
                        <td align="right" style="padding:8px 0;border-top:1px solid #EBE6E0;font-family:'Segoe UI',system-ui,sans-serif;font-size:14px;font-weight:600;color:#1A1A1A;">${courierName}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-top:1px solid #EBE6E0;font-family:'Segoe UI',system-ui,sans-serif;font-size:13px;color:#5C5C5C;">AWB / Tracking</td>
                        <td align="right" style="padding:8px 0;border-top:1px solid #EBE6E0;font-family:'Segoe UI',system-ui,sans-serif;font-size:14px;font-weight:600;color:#0088A9;">${awbNumber}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:20px 0 0;font-family:'Segoe UI',system-ui,sans-serif;font-size:14px;line-height:1.65;color:#5C5C5C;">
                Please track your package on <strong>${courierName}</strong>&rsquo;s official website using the AWB number above. Delivery timelines may vary by location.
              </p>
              <p style="margin:14px 0 0;font-family:'Segoe UI',system-ui,sans-serif;font-size:13px;line-height:1.55;color:#888888;">
                If you need assistance, reply to this email and our team will be happy to help.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;text-align:center;background-color:#FAFAF8;border-top:1px solid #EBE6E0;">
              <p style="margin:0;font-family:'Segoe UI',system-ui,sans-serif;font-size:12px;color:#888888;">
                V Design · Premium print &amp; packaging · Surat, India
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
