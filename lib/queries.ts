// lib/queries.ts
export const runtime = "nodejs"

import { db } from "./db"
import { CursoFromDB, AsistenciaFromDB, Preceptor } from "@/types"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"  
// import { verifyJWT } from "./requireAuth"

export function verifyToken(token: string): number | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id?: number }
    return decoded?.id ?? null
  } catch (error) {
    console.error("❌ Token inválido:", error)
    return null
  }
}

export async function getPreceptorById(id: number): Promise<Preceptor | null> {
  const res = await db.query("SELECT * FROM preceptores WHERE id = $1", [id])
  return res.rows[0] || null
}

export async function getPreceptorByEmail(email: string): Promise<Preceptor | null> {
    const res = await db.query("SELECT * FROM preceptores WHERE email = $1", [email])
    return res.rows[0] || null
}

export function getPreceptorIdFromCookies(): number | null {
  const token = cookies().get("token")?.value
  if (!token) return null

  // const valid = verifyJWT(token)
  // if (!valid) return null
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number }
    return decoded.id
  } catch {
    return null
  }
}

export async function getCursosByPreceptor(preceptorId: number): Promise<CursoFromDB[]> {
  const res = await db.query(`
    SELECT 
      c.*, 
      COUNT(e.id) AS total_estudiantes_real
    FROM cursos c
    LEFT JOIN estudiantes e ON c.id = e.curso_id AND e.activo = true
    WHERE c.preceptor_id = $1
    GROUP BY c.id
    ORDER BY c.nivel, c.seccion
  `, [preceptorId])
  return res.rows
}

export async function getPreceptorByCurso(cursoId: string): Promise<number | null> {
  const res = await db.query(`
    SELECT p.*
    FROM preceptores p
    JOIN cursos c ON p.id = c.preceptor_id
    WHERE c.id = $1
  `, [cursoId])
  return res.rows[0] || null
}

export async function getAsistenciaByFechaAndCurso(fecha: string, cursoId: string): Promise<AsistenciaFromDB[]> {
  const res = await db.query(`
    SELECT a.*, e.nombre, e.apellido, (e.nombre || ' ' || e.apellido) as nombre_completo
    FROM asistencia a
    JOIN estudiantes e ON a.estudiante_id = e.id
    WHERE a.fecha = $1 AND a.curso_id = $2
    ORDER BY e.apellido, e.nombre
  `, [fecha, cursoId])
  return res.rows
}

export async function getEstadisticasDelDia(fecha: string, preceptorId: number) {
  const res = await db.query(`
    SELECT 
      COUNT(*) as total_registros,
      SUM(CASE WHEN presente = TRUE THEN 1 ELSE 0 END) as presentes,
      SUM(CASE WHEN presente = FALSE AND justificado = FALSE THEN 1 ELSE 0 END) as ausentes,
      SUM(CASE WHEN tardanza = TRUE THEN 1 ELSE 0 END) as tardanzas,
      SUM(CASE WHEN justificado = TRUE THEN 1 ELSE 0 END) as justificados
    FROM asistencia
    WHERE fecha = $1 AND preceptor_id = $2
  `, [fecha, preceptorId])
  return res.rows[0]
}
