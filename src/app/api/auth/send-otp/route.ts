import { generateOtpEmailHTML } from "@/lib/auth/otp-email";
import { normalizeEmail } from "@/lib/auth/otp";
import { saveOtp } from "@/lib/auth/otp-store";
import { createMailTransporter, isMailConfigured } from "@/lib/email/transporter";
import type {
  AuthOtpErrorResponse,
  SendOtpRequestBody,
  SendOtpSuccessResponse,
} from "@/types/auth-otp";
import { type NextRequest, NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  if (!isMailConfigured()) {
    return NextResponse.json<AuthOtpErrorResponse>(
      { error: "Email service is not configured" },
      { status: 503 },
    );
  }

  let body: SendOtpRequestBody;

  try {
    body = (await req.json()) as SendOtpRequestBody;
  } catch {
    return NextResponse.json<AuthOtpErrorResponse>(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const email = normalizeEmail(body.email ?? "");

  if (!email || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json<AuthOtpErrorResponse>(
      { error: "A valid email address is required" },
      { status: 400 },
    );
  }

  try {
    const code = await saveOtp(email);
    const transporter = createMailTransporter();
    const fromAddress = process.env.GMAIL_USER;

    if (!transporter || !fromAddress) {
      return NextResponse.json<AuthOtpErrorResponse>(
        { error: "Email service is not configured" },
        { status: 503 },
      );
    }

    await transporter.sendMail({
      from: `"V Design" <${fromAddress}>`,
      to: email,
      subject: "Your V Design Security Code",
      html: generateOtpEmailHTML(code),
    });

    return NextResponse.json<SendOtpSuccessResponse>({
      success: true,
      message: "Security code sent to your email",
    });
  } catch (error) {
    console.error("[auth/send-otp] Failed:", error);

    return NextResponse.json<AuthOtpErrorResponse>(
      { error: "Unable to send security code. Please try again." },
      { status: 500 },
    );
  }
}
