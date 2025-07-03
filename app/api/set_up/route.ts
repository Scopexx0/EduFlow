import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  const result = await db.query(
    "SELECT * FROM preceptores WHERE email = $1 AND password_default = true",
    [email]
  )

  if (result.rowCount === 0) {
    return NextResponse.json({ error: "Correo inválido o ya registrado" }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
