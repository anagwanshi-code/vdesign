import {
  generateOtpCode,
  getOtpExpiryDate,
  isOtpExpired,
  normalizeEmail,
  otpCodesMatch,
} from "@/lib/auth/otp";
import {
  getSanityAdminClient,
  isSanityAdminConfigured,
} from "@/sanity/lib/admin-client";

type OtpMemoryEntry = {
  code: string;
  expiresAt: number;
};

const memoryStore = new Map<string, OtpMemoryEntry>();

const GUEST_OTP_IDS_QUERY = `*[_type == "guestOtp" && email == $email]._id`;

async function clearSanityOtpsForEmail(email: string): Promise<void> {
  const client = getSanityAdminClient();
  const ids = await client.fetch<string[]>(GUEST_OTP_IDS_QUERY, { email });

  await Promise.all(ids.map((id) => client.delete(id)));
}

export async function saveOtp(email: string, code?: string): Promise<string> {
  const normalized = normalizeEmail(email);
  const otpCode = code ?? generateOtpCode();

  if (isSanityAdminConfigured()) {
    const client = getSanityAdminClient();
    await clearSanityOtpsForEmail(normalized);
    await client.create({
      _type: "guestOtp",
      email: normalized,
      code: otpCode,
      expiresAt: getOtpExpiryDate(),
    });
  } else {
    memoryStore.set(normalized, {
      code: otpCode,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });
  }

  return otpCode;
}

export async function verifyAndConsumeOtp(
  email: string,
  providedCode: string,
): Promise<boolean> {
  const normalized = normalizeEmail(email);

  if (isSanityAdminConfigured()) {
    const client = getSanityAdminClient();
    const record = await client.fetch<{
      _id: string;
      code: string;
      expiresAt: string;
    } | null>(
      `*[_type == "guestOtp" && email == $email] | order(_createdAt desc)[0]`,
      { email: normalized },
    );

    if (!record || isOtpExpired(record.expiresAt)) {
      if (record?._id) {
        await client.delete(record._id);
      }
      return false;
    }

    const valid = otpCodesMatch(record.code, providedCode);
    await client.delete(record._id);
    return valid;
  }

  const entry = memoryStore.get(normalized);
  if (!entry || entry.expiresAt <= Date.now()) {
    memoryStore.delete(normalized);
    return false;
  }

  const valid = otpCodesMatch(entry.code, providedCode);
  memoryStore.delete(normalized);
  return valid;
}
