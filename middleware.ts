import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/auth/login", "/auth/signup", "/auth/request-password-reset", "/auth/reset-password"];
const PROTECTED_PREFIXES = ["/account", "/tasks", "/"]; // Passe das an deine Struktur an

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;    
  // Public-Routen immer erlauben
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Prüfe, ob Route geschützt ist
  if (PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    
    // middleware.ts (temporär zum Debuggen)
    console.log("Cookies:", req.cookies.getAll());
    console.log("Path:", pathname);
    const token = req.cookies.get("authToken")?.value;
    if (!token) {
      console.log("Kein Token gefunden, Weiterleitung zum Login");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    try {
      // JWT prüfen (nutze deinen JWT_SECRET!)
      
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      console.log("Token ist gültig:", token);
      return NextResponse.next();
    } catch (error) {
      // Ungültiges Token: Weiterleitung zum Login
      const response = NextResponse.redirect(new URL("/auth/login", req.url));
      response.cookies.delete("authToken");
      console.error("Ungültiges Token, Weiterleitung zum Login:", error);

      return response;
    }
  }

  return NextResponse.next();
}

// Matcher: auf alle Seiten außer statische Assets und API anwenden
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.well-known).*)"],
};