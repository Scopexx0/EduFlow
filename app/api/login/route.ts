// app/api/login/route.ts
export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { getPreceptorByEmail } from "@/lib/queries"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Faltan datos" },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    const preceptor = await getPreceptorByEmail(email)
    if (!preceptor) {
      return NextResponse.json(
        { error: "Preceptor no encontrado" },
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    const valid = await compare(password, preceptor.password)
    if (!valid) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    // Generar token JWT
    const token = jwt.sign(
      { id: preceptor.id },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    )
    // Configuración segura de cookies
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 // 1 día
    })
    
    return NextResponse.json(
      { 
        success: true,
        user: {
          id: preceptor.id,
          name: preceptor.nombre,
          email: preceptor.email
        }
      },
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error("Error en el login:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}