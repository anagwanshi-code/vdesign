import { timingSafeEqual } from "crypto";

export const OTP_TTL_MS = 5 * 60 * 1000;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function generateOtpCode(): string {
  const value = Math.floor(1000 + Math.random() * 9000);
  return String(value);
}

export function isValidOtpFormat(otp: string): boolean {
  return /^\d{4}$/.test(otp.trim());
}

export function otpCodesMatch(stored: string, provided: string): boolean {
  const a = Buffer.from(stored.trim());
  const b = Buffer.from(provided.trim());

  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}

export function getOtpExpiryDate(): string {
  return new Date(Date.now() + OTP_TTL_MS).toISOString();
}

export function isOtpExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() <= Date.now();
}
