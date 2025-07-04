import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/signup",
  "/auth/request-password-reset",
  "/auth/reset-password",
];
const PROTECTED_PREFIXES = ["/account", "/tasks", "/"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    const token = req.cookies.get("authToken")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Anfrage an /me zur Token-Validierung
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/me";
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Cookie": `authToken=${token}`,
      },
    });

    if (response.status !== 200) {
      const res = NextResponse.redirect(new URL("/auth/login", req.url));
      res.cookies.delete("authToken");
      return res;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.well-known).*)"],
};
