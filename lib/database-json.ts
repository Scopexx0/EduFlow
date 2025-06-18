// Tipos
interface Preceptor {
  id: number
  nombre: string
  email: string
  turno: string
  created_at: string
}

interface Curso {
  id: string
  nombre: string
  nivel: string
  seccion: string
  preceptor_id: number
  total_estudiantes: number
}

interface Estudiante {
  id: number
  nombre: string
  apellido: string
  curso_id: string
  activo: boolean
}

interface Asistencia {
  id: number
  estudiante_id: number
  curso_id: string
  fecha: string
  presente: boolean
  tardanza: boolean
  justificado: boolean
  observaciones?: string
  preceptor_id: number
}

// Base de datos en memoria
const database = {
  preceptores: [
    {
      id: 1,
      nombre: "María González",
      email: "maria.gonzalez@escuela.edu",
      turno: "Mañana",
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      nombre: "Juan Pérez",
      email: "juan.juan@escuela.edu",
      turno: "Tarde",
      created_at: new Date().toISOString(),
    }
  ] as Preceptor[],

  cursos: [
    { id: "1a", nombre: "1° A", nivel: "1", seccion: "A", preceptor_id: 1, total_estudiantes: 28 },
    { id: "1b", nombre: "1° B", nivel: "1", seccion: "B", preceptor_id: 1, total_estudiantes: 30 },
    { id: "2a", nombre: "2° A", nivel: "2", seccion: "A", preceptor_id: 2, total_estudiantes: 32 },
    { id: "2b", nombre: "2° B", nivel: "2", seccion: "B", preceptor_id: 1, total_estudiantes: 29 },
  ] as Curso[],

  estudiantes: [
    // 1° A
    { id: 1, nombre: "Ana", apellido: "García Rodríguez", curso_id: "1a", activo: true },
    { id: 2, nombre: "Carlos", apellido: "López Martínez", curso_id: "1a", activo: true },
    { id: 3, nombre: "María", apellido: "Rodríguez Silva", curso_id: "1a", activo: true },
    { id: 4, nombre: "Juan", apellido: "Pérez González", curso_id: "1a", activo: true },
    { id: 5, nombre: "Laura", apellido: "Martínez Torres", curso_id: "1a", activo: true },
    // 1° B
    { id: 6, nombre: "Diego", apellido: "Sánchez López", curso_id: "1b", activo: true },
    { id: 7, nombre: "Sofia", apellido: "Torres Ruiz", curso_id: "1b", activo: true },
    { id: 8, nombre: "Miguel", apellido: "Herrera Castro", curso_id: "1b", activo: true },
    { id: 9, nombre: "Valentina", apellido: "Morales Díaz", curso_id: "1b", activo: true },
    { id: 10, nombre: "Sebastián", apellido: "Jiménez Vargas", curso_id: "1b", activo: true },
    //2° A
    { id: 11, nombre: "Lucía", apellido: "Fernández Pérez"}
  ] as Estudiante[],

  asistencia: [] as Asistencia[],
}

// Funciones helper
export const dbHelpers = {
  // Obtener preceptor por ID
  getPreceptorById: (id: number) => {
    return database.preceptores.find((p) => p.id === id)
  },

  // Obtener cursos del preceptor
  getCursosByPreceptor: (preceptorId: number) => {
    return database.cursos
      .filter((c) => c.preceptor_id === preceptorId)
      .map((curso) => {
        const estudiantesCount = database.estudiantes.filter((e) => e.curso_id === curso.id && e.activo).length

        return {
          ...curso,
          total_estudiantes_real: estudiantesCount,
        }
      })
  },

  // Obtener estudiantes por curso
  getEstudiantesByCurso: (cursoId: string) => {
    return database.estudiantes
      .filter((e) => e.curso_id === cursoId && e.activo)
      .map((e) => ({
        ...e,
        nombre_completo: `${e.nombre} ${e.apellido}`,
      }))
      .sort((a, b) => a.apellido.localeCompare(b.apellido))
  },

  // Guardar asistencia
  saveAsistencia: (asistenciaData: any[]) => {
    // Eliminar asistencia existente del mismo día
    const fecha = asistenciaData[0]?.fecha
    if (fecha) {
      database.asistencia = database.asistencia.filter(
        (a) => !(a.fecha === fecha && asistenciaData.some((ad) => ad.estudiante_id === a.estudiante_id)),
      )
    }

    // Agregar nueva asistencia
    asistenciaData.forEach((asistencia, index) => {
      database.asistencia.push({
        id: database.asistencia.length + index + 1,
        ...asistencia,
      })
    })

    return true
  },

  // Obtener asistencia por fecha y curso
  getAsistenciaByFechaAndCurso: (fecha: string, cursoId: string) => {
    return database.asistencia
      .filter((a) => a.fecha === fecha && a.curso_id === cursoId)
      .map((a) => {
        const estudiante = database.estudiantes.find((e) => e.id === a.estudiante_id)
        return {
          ...a,
          nombre: estudiante?.nombre,
          apellido: estudiante?.apellido,
          nombre_completo: estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : "",
        }
      })
  },

  // Estadísticas del día
  getEstadisticasDelDia: (fecha: string, preceptorId: number) => {
    const asistenciaDelDia = database.asistencia.filter((a) => a.fecha === fecha && a.preceptor_id === preceptorId)

    return {
      total_registros: asistenciaDelDia.length,
      presentes: asistenciaDelDia.filter((a) => a.presente).length,
      ausentes: asistenciaDelDia.filter((a) => !a.presente && !a.justificado).length,
      tardanzas: asistenciaDelDia.filter((a) => a.tardanza).length,
      justificados: asistenciaDelDia.filter((a) => a.justificado).length,
    }
  },
}
