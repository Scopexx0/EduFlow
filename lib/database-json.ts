// import { AsistenciaData, CursoFromDB } from "@/types"
// import fs from "fs"
// import path from "path"

// // Tipos
// interface Preceptor {
//   id: number
//   nombre: string
//   email: string
//   turno: string
//   created_at: string
// }

// interface Curso {
//   id: string
//   nombre: string
//   nivel: string
//   seccion: string
//   preceptor_id: number
//   total_estudiantes: number
// }

// interface Estudiante {
//   id: number
//   nombre: string
//   apellido: string
//   curso_id: string
//   activo: boolean
// }

// interface Asistencia {
//   id: number
//   estudiante_id: number
//   curso_id: string
//   fecha: string
//   presente: boolean
//   tardanza: boolean
//   justificado: boolean
//   observaciones?: string
//   preceptor_id: number
// }

// const dbPath = path.join(process.cwd(), "data.json")

// function loadDatabase() {
//   if (fs.existsSync(dbPath)) {
//     const raw = fs.readFileSync(dbPath, "utf-8")
//     return JSON.parse(raw)
//   }
//   return null
// }

// function saveDatabase() {
//   fs.writeFileSync(dbPath, JSON.stringify(database, null, 2), "utf-8")
// }

// // Base de datos persistente
// const database =
//   loadDatabase() ?? {
//     preceptores: [
//       {
//         id: 1,
//         nombre: "María González",
//         email: "maria.gonzalez@escuela.edu",
//         turno: "Mañana",
//         created_at: new Date().toISOString(),
//       },
//       {
//         id: 2,
//         nombre: "Juan Pérez",
//         email: "juan.juan@escuela.edu",
//         turno: "Tarde",
//         created_at: new Date().toISOString(),
//       },
//     ] as Preceptor[],

//     cursos: [
//       { id: "1a", nombre: "1° A", nivel: "1", seccion: "A", preceptor_id: 1, total_estudiantes: 28 },
//       { id: "1b", nombre: "1° B", nivel: "1", seccion: "B", preceptor_id: 1, total_estudiantes: 30 },
//       { id: "2a", nombre: "2° A", nivel: "2", seccion: "A", preceptor_id: 2, total_estudiantes: 32 },
//       { id: "2b", nombre: "2° B", nivel: "2", seccion: "B", preceptor_id: 1, total_estudiantes: 29 },
//     ] as Curso[],

//     estudiantes: [
//       { id: 1, nombre: "Ana", apellido: "García Rodríguez", curso_id: "1a", activo: true },
//       { id: 2, nombre: "Carlos", apellido: "López Martínez", curso_id: "1a", activo: true },
//       { id: 3, nombre: "María", apellido: "Rodríguez Silva", curso_id: "1a", activo: true },
//       { id: 4, nombre: "Juan", apellido: "Pérez González", curso_id: "1a", activo: true },
//       { id: 5, nombre: "Laura", apellido: "Martínez Torres", curso_id: "1a", activo: true },
//       { id: 6, nombre: "Diego", apellido: "Sánchez López", curso_id: "1b", activo: true },
//       { id: 7, nombre: "Sofia", apellido: "Torres Ruiz", curso_id: "1b", activo: true },
//       { id: 8, nombre: "Miguel", apellido: "Herrera Castro", curso_id: "1b", activo: true },
//       { id: 9, nombre: "Valentina", apellido: "Morales Díaz", curso_id: "1b", activo: true },
//       { id: 10, nombre: "Sebastián", apellido: "Jiménez Vargas", curso_id: "1b", activo: true },
//     ] as Estudiante[],

//     asistencia: [],
//   }

// // Funciones helper
// export const dbHelpers = {
//   // Obtener preceptor por ID
//   getPreceptorById: (id: number) => {
//     return database.preceptores.find((p: Preceptor) => p.id === id)
//   },

//   // Obtener cursos del preceptor
//   getCursosByPreceptor: (preceptorId: number): CursoFromDB[] => {
//     return database.cursos
//       .filter((c: Curso) => c.preceptor_id === preceptorId)
//       .map((curso: Curso) => {
//         const estudiantesCount = database.estudiantes.filter((e: Estudiante) => e.curso_id === curso.id && e.activo).length

//         return {
//           ...curso,
//           total_estudiantes_real: estudiantesCount,
//         }
//       })
//   },

//   // Obtener estudiantes por curso
//   getEstudiantesByCurso: (cursoId: string) => {
//     return database.estudiantes
//       .filter((e: Estudiante) => e.curso_id === cursoId && e.activo)
//       .map((e: Estudiante) => ({
//         ...e,
//         nombre_completo: `${e.nombre} ${e.apellido}`,
//       }))
//       .sort((a: Estudiante, b: Estudiante) => a.apellido.localeCompare(b.apellido))
//   },

//   // Guardar asistencia
//   saveAsistencia: (asistenciaData: any[]) => {
//     // Eliminar asistencia existente del mismo día
//     const fecha = asistenciaData[0]?.fecha
//     if (fecha) {
//       database.asistencia = database.asistencia.filter(
//         (a: Asistencia) => !(a.fecha === fecha && asistenciaData.some((ad) => ad.estudiante_id === a.estudiante_id)),
//       )
//     }

//     // Agregar nueva asistencia
//     asistenciaData.forEach((asistencia, index) => {
//       database.asistencia.push({
//         id: database.asistencia.length + index + 1,
//         ...asistencia,
//       })
//     })

//     saveDatabase()
//     return true
//   },

//   // Obtener asistencia por fecha y curso
//   getAsistenciaByFechaAndCurso: (fecha: string, cursoId: string): AsistenciaData[] => {
//     return database.asistencia
//       .filter((a: Asistencia) => a.fecha === fecha && a.curso_id === cursoId)
//       .map((a: Asistencia) => {
//         const estudiante = database.estudiantes.find((e: Estudiante) => e.id === a.estudiante_id)
//         return {
//           ...a,
//           nombre: estudiante?.nombre,
//           apellido: estudiante?.apellido,
//           nombre_completo: estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : "",
//         }
//       })
//   },

//   // Estadísticas del día
//   getEstadisticasDelDia: (fecha: string, preceptorId: number) => {
//     const asistenciaDelDia = database.asistencia.filter((a: Asistencia) => a.fecha === fecha && a.preceptor_id === preceptorId)

//     return {
//       total_registros: asistenciaDelDia.length,
//       presentes: asistenciaDelDia.filter((a: Asistencia) => a.presente).length,
//       ausentes: asistenciaDelDia.filter((a: Asistencia) => !a.presente && !a.justificado).length,
//       tardanzas: asistenciaDelDia.filter((a: Asistencia) => a.tardanza).length,
//       justificados: asistenciaDelDia.filter((a: Asistencia) => a.justificado).length,
//     }
//   },
// }
