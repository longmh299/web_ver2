// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const isAdmin = pathname.startsWith("/admin");
  const isApiAdmin = pathname.startsWith("/api/admin");
  const isLogin = pathname.startsWith("/admin/login");

  // ✅ BỎ QUA các request Server Action
  if (req.method === "POST" && req.headers.has("next-action")) {
    return NextResponse.next();
  }

  if (!(isAdmin || isApiAdmin)) return NextResponse.next();
  if (isLogin) return NextResponse.next();

  const ok = req.cookies.get("admin_auth")?.value === "1";
  if (ok) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = `?next=${encodeURIComponent(pathname + (search || ""))}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
