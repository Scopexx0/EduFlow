import { db } from "@/lib/db"
import { hash } from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }

  const hashed = await hash(password, 10)

  const result = await db.query(
    "UPDATE preceptores SET password = $1, password_default = false WHERE email = $2 AND password_default = true",
    [hashed, email]
  )

  if (result.rowCount === 0) {
    return NextResponse.json({ error: "No se pudo actualizar la contraseña" }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
