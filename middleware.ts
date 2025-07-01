// middleware.ts
// Manages authentication and redirects for protected routes in a Next.js application
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const path = request.nextUrl.pathname

  // If not logged in keep them in login page
  if (!token) {
    if (path !== "/login") return NextResponse.redirect(new URL("/login", request.url))
    return NextResponse.next()
  }

  // If token modified or invalid, force logout
  const isValid = await verifyJWT(token)
  if (!isValid) {
    console.warn(`❌ Token inválido detectado desde IP: ${request.ip} . Forzando logout.`)
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("token")
    return response
  }

  // If already logged in, redirect to home
  if(token && path === "/login") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)", 
    "/api/asistencia", 
    "/api/asistencia/:path*", 
    "/api/asistencia(/:path)*",
    "/api/preceptores",
    "/api/preceptores/:path*",
    "/api/preceptores(/:path)*",
    "/api/cursos", 
    "/api/estudiantes", 
    "/api"], // proteger rutas
}

// Functions to verify JWT signature for the middleware.
function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
  const binary = atob(base64 + pad);
  return new Uint8Array([...binary].map(char => char.charCodeAt(0)));
}
// Functions to verify JWT signature for the middleware.
async function verifyJWT(token: string): Promise<boolean> {
  const [headerB64, payloadB64, signatureB64] = token.split(".");

  if (!headerB64 || !payloadB64 || !signatureB64) return false;

  const data = `${headerB64}.${payloadB64}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(process.env.JWT_SECRET!),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlToUint8Array(signatureB64),
    new TextEncoder().encode(data)
  );

  return valid;
}