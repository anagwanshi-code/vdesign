export function generateOtpEmailHTML(code: string): string {
  const safeCode = code.replace(/[^\d]/g, "");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your V Design Security Code</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F0EB;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F3F0EB;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#FFFFFF;border:1px solid #E0DAD2;border-radius:6px;overflow:hidden;">
          <tr>
            <td height="4" style="background:linear-gradient(90deg,#E91E63,#0088A9);font-size:0;line-height:4px;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:36px 32px;text-align:center;">
              <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:22px;color:#1A1A1A;">V Design</p>
              <p style="margin:0;font-family:'Segoe UI',system-ui,sans-serif;font-size:14px;color:#5C5C5C;">Your security code for checkout</p>
              <p style="margin:28px 0 12px;font-family:Georgia,serif;font-size:36px;letter-spacing:0.35em;color:#1A1A1A;">${safeCode}</p>
              <p style="margin:0;font-family:'Segoe UI',system-ui,sans-serif;font-size:13px;line-height:1.6;color:#888888;">
                This code expires in 5 minutes. If you did not request it, you can ignore this email.
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
