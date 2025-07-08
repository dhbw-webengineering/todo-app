import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ApiRoute } from "./ApiRoute";

const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/signup",
  "/auth/request-password-reset",
  "/auth/reset-password",
];
const PROTECTED_PREFIXES = ["/account", "/tasks", "/"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  //Public Routes lassen
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Geschützte Pfade prüfen
  if (PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    const token = req.cookies.get("authToken")?.value;
    if (!token) {
      // Kein Token → Login
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    try {
      const res = await fetch(ApiRoute.ME, {
        method: "GET",
        headers: {
          // Cookie mitsenden
          cookie: `authToken=${token}`,
        },
      });

      if (res.ok) {
        // Authentifiziert → Zugriffsgewährung
        return NextResponse.next();
      } else {
        // Token ungültig oder abgelaufen → Cookie löschen & Login
        const response = NextResponse.redirect(new URL("/auth/login", req.url));
        response.cookies.delete("authToken");
        return response;
      }
    } catch (err) {
      // Netzwerk- oder Serverfehler → Login
      const response = NextResponse.redirect(new URL("/auth/login", req.url));
      response.cookies.delete("authToken");
      return response;
    }
  }

  // 3. Alle anderen Routen passieren lassen
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.well-known).*)",
  ],
};
