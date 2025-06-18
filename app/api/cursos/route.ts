import { type NextRequest, NextResponse } from "next/server"
import { dbHelpers } from "../../../lib/database"
import type { CursoFromDB, Course } from "../../../types"

export async function GET(request: NextRequest) {
  try {
    // Por ahora usamos preceptor ID = 1 (después implementaremos autenticación)
    const preceptorId = 1

    const cursosFromDB = dbHelpers.getCursosByPreceptor(preceptorId) as CursoFromDB[]

    // Verificar si ya se tomó asistencia hoy para cada curso
    const today = new Date().toISOString().split("T")[0]

    const cursosConAsistencia: Course[] = cursosFromDB.map((curso) => {
      const asistenciaHoy = dbHelpers.getAsistenciaByFechaAndCurso(today, curso.id) as { presente: boolean; justificado: boolean; tardanza: boolean }[]

      return {
        id: curso.id,
        nombre: curso.nombre,
        nivel: curso.nivel,
        seccion: curso.seccion,
        estudiantes: curso.total_estudiantes_real || 0,
        asistenciaTomada: asistenciaHoy.length > 0,
        // Si ya se tomó, calcular estadísticas
        ...(asistenciaHoy.length > 0 && {
          presentes: asistenciaHoy.filter((a: { presente: boolean }) => a.presente).length,
          ausentes: asistenciaHoy.filter((a: { presente: boolean; justificado: boolean }) => !a.presente && !a.justificado).length,
          tardanzas: asistenciaHoy.filter((a: { tardanza: boolean }) => a.tardanza).length,
          justificados: asistenciaHoy.filter((a: { justificado: boolean }) => a.justificado).length,
        }),
      }
    })

    return NextResponse.json(cursosConAsistencia)
  } catch (error) {
    console.error("Error al obtener cursos:", error)
    return NextResponse.json({ error: "Error al obtener cursos" }, { status: 500 })
  }
}
