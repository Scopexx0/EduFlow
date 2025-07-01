// logout api
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; 

export async function POST() {
  return logoutUser()
}

async function logoutUser() {
  // Obtener la cookie de sesión
  const cookieStore = cookies()

  // Eliminar la cookie (httpOnly + Secure en producción)
  cookieStore.delete('token')

  // Redirigir o responder con éxito
  return NextResponse.json(
    { success: true, message: 'Sesión cerrada correctamente' },
    {
      status: 200,
      headers: {
        // Headers de seguridad adicionales
        'Set-Cookie': `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure; SameSite=Strict' : ''}`
      }
    }
  )
}