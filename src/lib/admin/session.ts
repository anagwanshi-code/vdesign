export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_MAX_AGE_SEC = 60 * 60 * 24;

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function signPayload(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload),
  );
  return toBase64Url(new Uint8Array(signature));
}

export async function createAdminSessionToken(secret: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE_SEC;
  const payload = String(exp);
  return `${payload}.${await signPayload(payload, secret)}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!token?.trim()) return false;

  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;

  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const exp = Number(payload);

  if (!Number.isFinite(exp) || Math.floor(Date.now() / 1000) > exp) {
    return false;
  }

  const expected = await signPayload(payload, secret);
  if (expected.length !== signature.length) return false;

  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SEC,
  };
}
