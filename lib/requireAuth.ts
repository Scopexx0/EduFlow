// lib/auth/requireAuth.ts
import { cookies } from "next/headers"
import { verifyToken } from "./queries"
import { NextResponse } from "next/server"

async function requireAuth(): Promise<number | NextResponse> {
  const token = cookies().get("token")?.value

  if (!token) {
    return NextResponse.json({ error: "No autorizado: no hay token" }, { status: 401 })
  }

  const isValid = await verifyJWT(token)
  if (!isValid) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 })
  }

  const preceptorId = verifyToken(token)
  if (!preceptorId) {
    return NextResponse.json({ error: "No se pudo extraer ID del token" }, { status: 401 })
  }

  return preceptorId
}

// Functions to verify JWT signature for the middleware mostly.
function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
  const binary = atob(base64 + pad);
  return new Uint8Array([...binary].map(char => char.charCodeAt(0)));
}
// Functions to verify JWT signature for the middleware mostly.
export async function verifyJWT(token: string): Promise<boolean> {
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