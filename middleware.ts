// middleware.ts
// Manages authentication and redirects for protected routes in a Next.js application
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const path = request.nextUrl.pathname

  // If not loged in, redirect to login
  if (!token && path !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  if(token && path === "/login") {
    // If already logged in, redirect to home
    // console.log("Ya estás logueado, redirigiendo a la página principal")
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"], // proteger rutas
}
