import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/leads", "/automations", "/integrations", "/executions", "/scheduled", "/worker"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const hasSession = Boolean(request.cookies.get("pulseflow_session")?.value);

  if (needsAuth && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/leads/:path*", "/automations/:path*", "/integrations/:path*", "/executions/:path*", "/scheduled/:path*", "/worker/:path*", "/login"]
};
