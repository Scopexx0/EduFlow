import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const preceptorId = 1 // simulado por ahora
    const today = new Date().toISOString().split("T")[0]

    // Obtener cursos y total de estudiantes activos por curso
    const cursosResult = await db.query(
      `SELECT 
         c.id, 
         c.nombre, 
         c.nivel, 
         c.seccion,
         COUNT(e.id) AS total_estudiantes_real
       FROM cursos c
       LEFT JOIN estudiantes e ON e.curso_id = c.id AND e.activo = true
       WHERE c.preceptor_id = $1
       GROUP BY c.id`,
      [preceptorId]
    )

    const cursos = cursosResult.rows

    // Obtener asistencia por curso para el día de hoy
    const asistenciaResult = await db.query(
      `SELECT 
         curso_id,
         COUNT(*) AS total,
         COUNT(*) FILTER (WHERE presente) AS presentes,
         COUNT(*) FILTER (WHERE NOT presente AND NOT justificado) AS ausentes,
         COUNT(*) FILTER (WHERE tardanza) AS tardanzas,
         COUNT(*) FILTER (WHERE justificado) AS justificados
       FROM asistencia
       WHERE fecha = $1 AND preceptor_id = $2
       GROUP BY curso_id`,
      [today, preceptorId]
    )

    const asistenciaPorCurso = Object.fromEntries(
      asistenciaResult.rows.map((row) => [row.curso_id, row])
    )

    // Armar respuesta
    const cursosConAsistencia = cursos.map((curso: any) => {
      const stats = asistenciaPorCurso[curso.id]

      return {
        id: curso.id,
        nombre: curso.nombre,
        nivel: curso.nivel,
        seccion: curso.seccion,
        estudiantes: parseInt(curso.total_estudiantes_real) || 0,
        asistenciaTomada: !!stats,
        ...(stats && {
          presentes: parseInt(stats.presentes),
          ausentes: parseInt(stats.ausentes),
          tardanzas: parseInt(stats.tardanzas),
          justificados: parseInt(stats.justificados),
        }),
      }
    })

    return NextResponse.json(cursosConAsistencia)
  } catch (error) {
    console.error("Error al obtener cursos:", error)
    return NextResponse.json({ error: "Error al obtener cursos" }, { status: 500 })
  }
}
