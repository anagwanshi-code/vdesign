import { ADMIN_SESSION_COOKIE } from "@/lib/admin/session";
import { type NextRequest, NextResponse } from "next/server";

function clearSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function GET(req: NextRequest) {
  const loginUrl = new URL("/admin/login", req.url);
  const response = NextResponse.redirect(loginUrl);
  clearSessionCookie(response);
  return response;
}

export async function POST(req: NextRequest) {
  return GET(req);
}
