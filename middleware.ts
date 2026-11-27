import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const primary = request.headers.get("accept-language")?.split(",")[0]?.trim().toLowerCase();
  const locale = !primary || primary.startsWith("ko") ? "ko" : "en";
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}

export const config = {
  matcher: "/",
};
