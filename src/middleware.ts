// this is a next.js middleware that runs before every request(except api/statuc files) to control route access based on authentication.

// protects certain pages(requires login)
// blocks logged-in users from login/register pages
// redirects users appropriately based on auth status


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES    = ["/login", "/register", "/forgot-password"];
const PROTECTED_ROUTES = ["/cart", "/checkout", "/profile", "/orders", "/wishlist", "/notifications"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token     = request.cookies.get("auth_token")?.value;
  const userRaw   = request.cookies.get("user_data")?.value;
  const userRole  = userRaw ? (() => { try { return JSON.parse(userRaw)?.role; } catch { return null; } })() : null;

  // Admin routes — must be logged in AND have admin role
  if (pathname.startsWith("/admin")) {
    if (!token || userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Seller application status — any authenticated user (pending applicants are still role="user")
  if (pathname === "/seller/status") {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Seller dashboard — must be logged in AND have seller role
  if (pathname.startsWith("/seller")) {
    if (!token || userRole !== "seller") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Become a seller form — must be logged in
  if (pathname === "/become-seller") {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

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
