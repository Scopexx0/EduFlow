// Tipos para la aplicación EduFlow

export interface Course {
  id: string
  nombre: string
  estudiantes: number
  asistenciaTomada: boolean
  presentes?: number
  ausentes?: number
  tardanzas?: number
}

export interface Preceptor {
  id: number
  firstName: string
  email: string
  shift: string // "mañana" o "tarde"
}

export interface Student {
  id: number
  name: string
  present: boolean
  late: boolean
  justified: boolean
  observations?: string
}

export interface Stats {
  total_registros: number
  presentes: number
  ausentes: number
  tardanzas: number
  justificados: number
}

export interface AsistenciaData {
  estudiante_id: number
  curso_id: string
  fecha: string
  presente: boolean
  tardanza: boolean
  justificado: boolean
  observations?: string
  preceptor_id: number
}

export interface EstadisticasDelDia {
  total_registros: number
  presentes: number
  ausentes: number
  tardanzas: number
  justificados: number
}

// Tipos para la base de datos (lo que devuelve SQLite)
export interface CursoFromDB {
  id: string
  nombre: string
  nivel: string
  seccion: string
  preceptor_id: number
  total_estudiantes: number
  total_estudiantes_real: number
}

export interface EstudianteFromDB {
  id: number
  nombre: string
  apellido: string
  nombre_completo: string
  curso_id: string
  activo: number
}

export interface AsistenciaFromDB {
  id: number
  estudiante_id: number
  curso_id: string
  fecha: string
  presente: number
  tardanza: number
  justificado: number
  observaciones?: string
  preceptor_id: number
  nombre?: string
  apellido?: string
  nombre_completo?: string
}
