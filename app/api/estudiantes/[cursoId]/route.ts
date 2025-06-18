import { type NextRequest, NextResponse } from "next/server"
import { dbHelpers } from "@/lib/database-json"
import type { EstudianteFromDB, AsistenciaFromDB, Student } from "@/types"

export async function GET(request: NextRequest, { params }: { params: { cursoId: string } }) {
  try {
    const { cursoId } = params

    if (!cursoId) {
      return NextResponse.json({ error: "ID de curso requerido" }, { status: 400 })
    }

    const estudiantesFromDB = dbHelpers.getEstudiantesByCurso(cursoId).map((est: any) => ({
      ...est,
      activo: est.activo ? 1 : 0,
    })) as EstudianteFromDB[]

    // Verificar si ya hay asistencia tomada hoy
    const today = new Date().toISOString().split("T")[0]
    const asistenciaHoy = dbHelpers.getAsistenciaByFechaAndCurso(today, cursoId).map((a: any) => ({
      ...a,
      presente: a.presente ? 1 : 0,
      tardanza: a.tardanza ? 1 : 0,
      justificado: a.justificado ? 1 : 0,
    })) as AsistenciaFromDB[]

    // Combinar estudiantes con su asistencia del día (si existe)
    const estudiantesConAsistencia: Student[] = estudiantesFromDB.map((estudiante) => {
      const asistencia = asistenciaHoy.find((a) => a.estudiante_id === estudiante.id)

      return {
        id: estudiante.id,
        name: estudiante.nombre_completo,
        present: Boolean(asistencia?.presente) || false,
        late: Boolean(asistencia?.tardanza) || false,
        justified: Boolean(asistencia?.justificado) || false,
        observaciones: asistencia?.observaciones || "",
      }
    })

    return NextResponse.json(estudiantesConAsistencia)
  } catch (error) {
    console.error("Error al obtener estudiantes:", error)
    return NextResponse.json({ error: "Error al obtener estudiantes" }, { status: 500 })
  }
}
