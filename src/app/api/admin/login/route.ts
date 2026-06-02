import { safeComparePassword } from "@/lib/admin/password";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
} from "@/lib/admin/session";
import { type NextRequest, NextResponse } from "next/server";

type LoginBody = {
  password?: string;
};

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: "Admin login is not configured." },
      { status: 503 },
    );
  }

  let body: LoginBody;
  try {
    body = (await req.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const password = body.password ?? "";
  if (!password || !safeComparePassword(password, adminPassword)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await createAdminSessionToken(adminPassword);
  const response = NextResponse.json({ ok: true });

  response.cookies.set(ADMIN_SESSION_COOKIE, token, getAdminSessionCookieOptions());

  return response;
}
