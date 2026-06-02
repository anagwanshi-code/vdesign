import { isValidOtpFormat, normalizeEmail } from "@/lib/auth/otp";
import { parseShippingAddressForCheckout } from "@/lib/auth/parse-shipping-address";
import { verifyAndConsumeOtp } from "@/lib/auth/otp-store";
import {
  getSanityAdminClient,
  isSanityAdminConfigured,
} from "@/sanity/lib/admin-client";
import type {
  AuthOtpErrorResponse,
  VerifyOtpRequestBody,
  VerifyOtpProfile,
  VerifyOtpSuccessResponse,
} from "@/types/auth-otp";
import { type NextRequest, NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LATEST_ORDER_BY_EMAIL_QUERY = `*[_type == "order" && email == $email] | order(_createdAt desc)[0]{
  customerName,
  phone,
  shippingAddress
}`;

export async function POST(req: NextRequest) {
  let body: VerifyOtpRequestBody;

  try {
    body = (await req.json()) as VerifyOtpRequestBody;
  } catch {
    return NextResponse.json<AuthOtpErrorResponse>(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const email = normalizeEmail(body.email ?? "");
  const otp = String(body.otp ?? "").trim();

  if (!email || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json<AuthOtpErrorResponse>(
      { error: "A valid email address is required" },
      { status: 400 },
    );
  }

  if (!isValidOtpFormat(otp)) {
    return NextResponse.json<AuthOtpErrorResponse>(
      { error: "Enter the 4-digit security code" },
      { status: 400 },
    );
  }

  try {
    const valid = await verifyAndConsumeOtp(email, otp);

    if (!valid) {
      return NextResponse.json<AuthOtpErrorResponse>(
        { error: "Invalid or expired security code" },
        { status: 401 },
      );
    }

    let profile: VerifyOtpProfile | null = null;

    if (isSanityAdminConfigured()) {
      const client = getSanityAdminClient();
      const order = await client.fetch<{
        customerName?: string;
        phone?: string;
        shippingAddress?: string;
      } | null>(LATEST_ORDER_BY_EMAIL_QUERY, { email });

      if (order?.customerName || order?.phone || order?.shippingAddress) {
        const parsed = order.shippingAddress
          ? parseShippingAddressForCheckout(order.shippingAddress)
          : null;

        profile = {
          customerName: order.customerName?.trim() ?? "",
          phone: order.phone?.trim() ?? "",
          shippingAddress: order.shippingAddress?.trim() ?? "",
          ...(parsed
            ? {
                street: parsed.street,
                city: parsed.city,
                state: parsed.state,
                pinCode: parsed.pinCode,
              }
            : {}),
        };
      }
    }

    return NextResponse.json<VerifyOtpSuccessResponse>({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("[auth/verify-otp] Failed:", error);

    return NextResponse.json<AuthOtpErrorResponse>(
      { error: "Verification failed. Please try again." },
      { status: 500 },
    );
  }
}
