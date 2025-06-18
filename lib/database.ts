// Configuración de base de datos simple con SQLite
import Database from "better-sqlite3"
import path from "path"

const dbPath = path.join(process.cwd(), "eduflow.db")
const db = new Database(dbPath)

// Crear tablas si no existen
db.exec(`
  CREATE TABLE IF NOT EXISTS preceptores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    turno TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cursos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    nivel TEXT NOT NULL,
    seccion TEXT NOT NULL,
    preceptor_id INTEGER,
    total_estudiantes INTEGER DEFAULT 0,
    FOREIGN KEY (preceptor_id) REFERENCES preceptores (id)
  );

  CREATE TABLE IF NOT EXISTS estudiantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    curso_id TEXT NOT NULL,
    activo BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (curso_id) REFERENCES cursos (id)
  );

  CREATE TABLE IF NOT EXISTS asistencia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estudiante_id INTEGER NOT NULL,
    curso_id TEXT NOT NULL,
    fecha DATE NOT NULL,
    presente BOOLEAN DEFAULT 0,
    tardanza BOOLEAN DEFAULT 0,
    justificado BOOLEAN DEFAULT 0,
    observaciones TEXT,
    preceptor_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes (id),
    FOREIGN KEY (curso_id) REFERENCES cursos (id),
    FOREIGN KEY (preceptor_id) REFERENCES preceptores (id),
    UNIQUE(estudiante_id, fecha)
  );
`)

// Insertar datos de ejemplo si las tablas están vacías
const preceptorCount = db.prepare("SELECT COUNT(*) as count FROM preceptores").get() as { count: number }

if (preceptorCount.count === 0) {
  // Insertar preceptor de ejemplo
  const insertPreceptor = db.prepare(`
    INSERT INTO preceptores (nombre, email, turno) 
    VALUES (?, ?, ?)
  `)
  const preceptorId = insertPreceptor.run("María González", "maria.gonzalez@escuela.edu", "Mañana").lastInsertRowid

  // Insertar cursos de ejemplo
  const insertCurso = db.prepare(`
    INSERT INTO cursos (id, nombre, nivel, seccion, preceptor_id, total_estudiantes) 
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const cursos = [
    ["1a", "1° A", "1", "A", preceptorId, 28],
    ["1b", "1° B", "1", "B", preceptorId, 30],
    ["2a", "2° A", "2", "A", preceptorId, 32],
    ["2b", "2° B", "2", "B", preceptorId, 29],
    ["3a", "3° A", "3", "A", preceptorId, 26],
    ["3b", "3° B", "3", "B", preceptorId, 31],
  ]

  cursos.forEach((curso) => insertCurso.run(...curso))

  // Insertar estudiantes de ejemplo
  const insertEstudiante = db.prepare(`
    INSERT INTO estudiantes (nombre, apellido, curso_id) 
    VALUES (?, ?, ?)
  `)

  const estudiantes = [
    // 1° A
    ["Ana", "García Rodríguez", "1a"],
    ["Carlos", "López Martínez", "1a"],
    ["María", "Rodríguez Silva", "1a"],
    ["Juan", "Pérez González", "1a"],
    ["Laura", "Martínez Torres", "1a"],
    ["Diego", "Sánchez López", "1a"],
    ["Sofia", "Torres Ruiz", "1a"],
    ["Miguel", "Herrera Castro", "1a"],
    ["Valentina", "Morales Díaz", "1a"],
    ["Sebastián", "Jiménez Vargas", "1a"],
    // 1° B
    ["Isabella", "Ramírez Cruz", "1b"],
    ["Alejandro", "Fernández Ruiz", "1b"],
    ["Camila", "Gutiérrez Moreno", "1b"],
    ["Mateo", "Castillo Herrera", "1b"],
    ["Lucía", "Mendoza Flores", "1b"],
    ["Santiago", "Vargas Peña", "1b"],
    ["Antonella", "Rojas Vega", "1b"],
    ["Nicolás", "Silva Ortega", "1b"],
    ["Renata", "Paredes Luna", "1b"],
    ["Emilio", "Guerrero Soto", "1b"],
  ]

  estudiantes.forEach((estudiante) => insertEstudiante.run(...estudiante))
}

export { db }

// Funciones helper para las consultas más comunes
export const dbHelpers = {
  // Obtener preceptores
  getPreceptorById: (id: number) => {
  return db
    .prepare(`
      SELECT * FROM preceptores WHERE id = ?
    `)
    .get(id) as import("../types").Preceptor
  },
  
  // Obtener cursos del preceptor
  getCursosByPreceptor: (preceptorId: number) => {
    return db
      .prepare(`
      SELECT c.*, 
             COUNT(e.id) as total_estudiantes_real
      FROM cursos c
      LEFT JOIN estudiantes e ON c.id = e.curso_id AND e.activo = 1
      WHERE c.preceptor_id = ?
      GROUP BY c.id
      ORDER BY c.nivel, c.seccion
    `)
      .all(preceptorId)
  },

  // Obtener estudiantes por curso
  getEstudiantesByCurso: (cursoId: string) => {
    return db
      .prepare(`
      SELECT id, nombre, apellido, 
             (nombre || ' ' || apellido) as nombre_completo,
             curso_id, activo
      FROM estudiantes 
      WHERE curso_id = ? AND activo = 1
      ORDER BY apellido, nombre
    `)
      .all(cursoId)
  },

  // Guardar asistencia
  saveAsistencia: (asistenciaData: any[]) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO asistencia 
      (estudiante_id, curso_id, fecha, presente, tardanza, justificado, observaciones, preceptor_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const transaction = db.transaction((asistencias: any[]) => {
      for (const asistencia of asistencias) {
        stmt.run(
          asistencia.estudiante_id,
          asistencia.curso_id,
          asistencia.fecha,
          asistencia.presente ? 1 : 0,
          asistencia.tardanza ? 1 : 0,
          asistencia.justificado ? 1 : 0,
          asistencia.observaciones || null,
          asistencia.preceptor_id,
        )
      }
    })

    return transaction(asistenciaData)
  },

  // Obtener asistencia por fecha y curso
  getAsistenciaByFechaAndCurso: (fecha: string, cursoId: string) => {
    return db
      .prepare(`
      SELECT a.*, e.nombre, e.apellido,
             (e.nombre || ' ' || e.apellido) as nombre_completo
      FROM asistencia a
      JOIN estudiantes e ON a.estudiante_id = e.id
      WHERE a.fecha = ? AND a.curso_id = ?
      ORDER BY e.apellido, e.nombre
    `)
      .all(fecha, cursoId)
  },

  // Estadísticas del día
  getEstadisticasDelDia: (fecha: string, preceptorId: number) => {
    return db
      .prepare(`
      SELECT 
        COUNT(*) as total_registros,
        SUM(CASE WHEN presente = 1 THEN 1 ELSE 0 END) as presentes,
        SUM(CASE WHEN presente = 0 AND justificado = 0 THEN 1 ELSE 0 END) as ausentes,
        SUM(CASE WHEN tardanza = 1 THEN 1 ELSE 0 END) as tardanzas,
        SUM(CASE WHEN justificado = 1 THEN 1 ELSE 0 END) as justificados
      FROM asistencia 
      WHERE fecha = ? AND preceptor_id = ?
    `)
      .get(fecha, preceptorId)
  },
}
