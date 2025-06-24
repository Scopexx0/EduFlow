// app/api/asistencia/route.ts
// Este archivo maneja las rutas de la API para la asistencia de estudiantes.
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getPreceptorIdFromCookies } from "@/lib/queries"

export async function POST(request: NextRequest) {
  const preceptorId = getPreceptorIdFromCookies()
  if (!preceptorId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401})
  }

  try {
    const body = await request.json()
    const { cursoId, fecha, estudiantes } = body

    // Verificamos si el curso pertenece al preceptor
    const { rows } = await db.query(
      "SELECT id FROM cursos WHERE id = $1 AND preceptor_id = $2",
      [cursoId, preceptorId]
    )
    if (rows.length === 0) {
      return NextResponse.json({ error: "Curso no autorizado" }, { status: 403 })
    }

    if (!cursoId || !fecha || !Array.isArray(estudiantes)) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    // Authenticate preceptor from cookies
    // const preceptorId = getPreceptorIdFromCookies() || -1

    // Borrar asistencia previa para estos estudiantes en esa fecha
    const estudianteIds = estudiantes.map((e: any) => e.id)
    await db.query(
      `DELETE FROM asistencia WHERE fecha = $1 AND estudiante_id = ANY($2::int[])`,
      [fecha, estudianteIds]
    )

    // Insertar asistencia nueva
    for (const estudiante of estudiantes) {
      await db.query(
        `INSERT INTO asistencia (estudiante_id, curso_id, fecha, presente, tardanza, justificado, observaciones, preceptor_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          estudiante.id,
          cursoId,
          fecha,
          estudiante.present,
          estudiante.late,
          estudiante.justified,
          estudiante.observations || null,
          preceptorId,
        ]
      )
    }

    // Calcular estadísticas actualizadas
    const result = await db.query(
      `SELECT 
        COUNT(*) AS total_registros,
        COUNT(*) FILTER (WHERE presente) AS presentes,
        COUNT(*) FILTER (WHERE NOT presente AND NOT justificado) AS ausentes,
        COUNT(*) FILTER (WHERE tardanza) AS tardanzas,
        COUNT(*) FILTER (WHERE justificado) AS justificados
      FROM asistencia
      WHERE fecha = $1 AND preceptor_id = $2`,
      [fecha, preceptorId]
    )

    const estadisticas = result.rows[0]

    return NextResponse.json({
      success: true,
      message: "Asistencia guardada correctamente",
      estadisticas,
    })
  } catch (error) {
    console.error("Error al guardar asistencia:", error)
    return NextResponse.json({ error: "Error al guardar asistencia" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fecha = searchParams.get("fecha") || new Date().toISOString().split("T")[0]
    const cursoId = searchParams.get("curso")
    const preceptorId = 1 // Simulado

    if (cursoId) {
      const result = await db.query(
        `SELECT a.*, e.nombre, e.apellido
         FROM asistencia a
         JOIN estudiantes e ON a.estudiante_id = e.id
         WHERE a.fecha = $1 AND a.curso_id = $2`,
        [fecha, cursoId]
      )

      return NextResponse.json(result.rows)
    } else {
      const result = await db.query(
        `SELECT 
          COUNT(*) AS total_registros,
          COUNT(*) FILTER (WHERE presente) AS presentes,
          COUNT(*) FILTER (WHERE NOT presente AND NOT justificado) AS ausentes,
          COUNT(*) FILTER (WHERE tardanza) AS tardanzas,
          COUNT(*) FILTER (WHERE justificado) AS justificados
        FROM asistencia
        WHERE fecha = $1 AND preceptor_id = $2`,
        [fecha, preceptorId]
      )

      const estadisticas = result.rows[0]

      return NextResponse.json(estadisticas)
    }
  } catch (error) {
    console.error("Error al obtener asistencia:", error)
    return NextResponse.json({ error: "Error al obtener asistencia" }, { status: 500 })
  }
}
