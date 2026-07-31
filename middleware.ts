import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const payload = await verifyToken(session);
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Role protection for users management (admin only)
    if (request.nextUrl.pathname.startsWith("/admin/pengguna") && payload.role !== "Admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Redirect /login to /admin if already logged in
  if (request.nextUrl.pathname.startsWith("/login") && session) {
    const payload = await verifyToken(session);
    if (payload) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
