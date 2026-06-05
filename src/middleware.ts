// this is a next.js middleware that runs before every request(except api/statuc files) to control route access based on authentication.

// protects certain pages(requires login)
// blocks logged-in users from login/register pages
// redirects users appropriately based on auth status


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES  = ["/login", "/register", "/forgot-password"];
const PROTECTED_ROUTES = ["/cart", "/checkout", "/profile", "/orders"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute  = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
