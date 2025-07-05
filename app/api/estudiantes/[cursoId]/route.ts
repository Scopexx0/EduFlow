import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getPreceptorIdFromCookies, getPreceptorByCurso, getCursosByPreceptor } from "@/lib/queries"
import { dateUtils } from "@/lib/date-utils"

// Esta ruta obtiene los estudiantes de un curso específico y su asistencia del día actual
export async function GET(
  request: NextRequest,
  { params }: { params: { cursoId: string } }
) {
  try {    
    const { cursoId } = params
    
    // Authenticate user via cookie
    const preceptorId = getPreceptorIdFromCookies() || -1
    const validation = await getPreceptorByCurso(cursoId)
    // console.log("validation:", validation === preceptorId)
    if (validation !== preceptorId) {
      console.log("Preceptor no autorizado para este curso:", preceptorId, cursoId)
      console.warn(`❌ Preceptor no autorizado detectado desde IP: ${request.ip}`)
      return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    if (!cursoId) {
      return NextResponse.json({ error: "ID de curso requerido" }, { status: 400 })
    }

    const today = dateUtils.getToday()

    // Obtener estudiantes activos del curso
    const estudiantesResult = await db.query(
      `SELECT id, nombre, apellido
       FROM estudiantes
       WHERE curso_id = $1 AND activo = true
       ORDER BY apellido ASC`,
      [cursoId]
    )

    const estudiantes = estudiantesResult.rows

    // Obtener asistencia del día para esos estudiantes
    const asistenciaResult = await db.query(
      `SELECT estudiante_id, presente, tardanza, justificado, observaciones
       FROM asistencia
       WHERE curso_id = $1 AND fecha = $2`,
      [cursoId, today]
    )

    const asistenciaMap = Object.fromEntries(
      asistenciaResult.rows.map((a) => [a.estudiante_id, a])
    )

    // Combinar estudiantes + asistencia
    const estudiantesConAsistencia = estudiantes.map((e: any) => {
      const asistencia = asistenciaMap[e.id]

      return {
        id: e.id,
        name: `${e.nombre} ${e.apellido}`,
        present: Boolean(asistencia?.presente),
        late: Boolean(asistencia?.tardanza),
        justified: Boolean(asistencia?.justificado),
        observaciones: asistencia?.observaciones || "",
      }
    })

    return NextResponse.json(estudiantesConAsistencia)
  } catch (error) {
    console.error("Error al obtener estudiantes:", error)
    return NextResponse.json({ error: "Error al obtener estudiantes" }, { status: 500 })
  }
}