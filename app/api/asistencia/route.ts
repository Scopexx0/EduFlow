import { type NextRequest, NextResponse } from "next/server"
import { dbHelpers } from "@/lib/database"
import type { Student, AsistenciaData, EstadisticasDelDia } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      cursoId,
      fecha,
      estudiantes,
    }: {
      cursoId: string
      fecha: string
      estudiantes: Student[]
    } = body

    // Validaciones básicas
    if (!cursoId || !fecha || !estudiantes || !Array.isArray(estudiantes)) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    // Por ahora usamos preceptor ID = 1 (después implementaremos autenticación)
    const preceptorId = 1

    // Preparar datos para guardar
    const asistenciaData: AsistenciaData[] = estudiantes.map((estudiante) => ({
      estudiante_id: estudiante.id,
      curso_id: cursoId,
      fecha: fecha,
      presente: estudiante.present,
      tardanza: estudiante.late,
      justificado: estudiante.justified,
      observaciones: estudiante.observations || null,
      preceptor_id: preceptorId,
    }))

    // Guardar en la base de datos
    dbHelpers.saveAsistencia(asistenciaData)

    // Obtener estadísticas actualizadas
    const estadisticas = dbHelpers.getEstadisticasDelDia(fecha, preceptorId) as EstadisticasDelDia

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

    // Por ahora usamos preceptor ID = 1
    const preceptorId = 1

    if (cursoId) {
      // Obtener asistencia específica de un curso
      const asistencia = dbHelpers.getAsistenciaByFechaAndCurso(fecha, cursoId)
      return NextResponse.json(asistencia)
    } else {
      // Obtener estadísticas generales del día
      const estadisticas = dbHelpers.getEstadisticasDelDia(fecha, preceptorId) as EstadisticasDelDia | null

      // Si no hay estadísticas, devolver valores por defecto
      const estadisticasDefault: EstadisticasDelDia = {
        total_registros: 0,
        presentes: 0,
        ausentes: 0,
        tardanzas: 0,
        justificados: 0,
      }

      return NextResponse.json(estadisticas || estadisticasDefault)
    }
  } catch (error) {
    console.error("Error al obtener asistencia:", error)
    return NextResponse.json({ error: "Error al obtener asistencia" }, { status: 500 })
  }
}
