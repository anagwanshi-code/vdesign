import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/admin/session";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/api/admin/login"]);

function isProtectedAdminPath(pathname: string): boolean {
  if (pathname === "/api/admin/logout") return false;
  return pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedAdminPath(pathname) || PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Admin access is not configured." },
      { status: 503 },
    );
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (await verifyAdminSessionToken(session, adminPassword)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
