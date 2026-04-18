import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/inbox",
  "/leads",
  "/automations",
  "/integrations",
  "/executions",
  "/scheduled",
  "/worker",
  "/analytics",
  "/settings"
];

const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const isAuthRoute = authRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const hasSession = Boolean(request.cookies.get("pulseflow_session")?.value);

  if (needsAuth && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/inbox/:path*",
    "/leads/:path*",
    "/automations/:path*",
    "/integrations/:path*",
    "/executions/:path*",
    "/scheduled/:path*",
    "/worker/:path*",
    "/analytics/:path*",
    "/settings/:path*",
    "/login",
    "/register"
  ]
};
