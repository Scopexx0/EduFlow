// lib/init-db.ts
import { db } from "./db"

async function init() {
    const preceptores = [
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
      },
    ];

    const cursos = [
      { id: "1a", nombre: "1° A", nivel: "1", seccion: "A", preceptor_id: 1, total_estudiantes: 28 },
      { id: "1b", nombre: "1° B", nivel: "1", seccion: "B", preceptor_id: 1, total_estudiantes: 30 },
      { id: "2a", nombre: "2° A", nivel: "2", seccion: "A", preceptor_id: 2, total_estudiantes: 32 },
      { id: "2b", nombre: "2° B", nivel: "2", seccion: "B", preceptor_id: 1, total_estudiantes: 29 },
    ];

    const estudiantes = [
      { id: 1, nombre: "Ana", apellido: "García Rodríguez", curso_id: "1a", activo: true },
      { id: 2, nombre: "Carlos", apellido: "López Martínez", curso_id: "1a", activo: true },
      { id: 3, nombre: "María", apellido: "Rodríguez Silva", curso_id: "1a", activo: true },
      { id: 4, nombre: "Juan", apellido: "Pérez González", curso_id: "1a", activo: true },
      { id: 5, nombre: "Laura", apellido: "Martínez Torres", curso_id: "1a", activo: true },
      { id: 6, nombre: "Diego", apellido: "Sánchez López", curso_id: "1b", activo: true },
      { id: 7, nombre: "Sofia", apellido: "Torres Ruiz", curso_id: "1b", activo: true },
      { id: 8, nombre: "Miguel", apellido: "Herrera Castro", curso_id: "1b", activo: true },
      { id: 9, nombre: "Valentina", apellido: "Morales Díaz", curso_id: "1b", activo: true },
      { id: 10, nombre: "Sebastián", apellido: "Jiménez Vargas", curso_id: "1b", activo: true },
    ];

    const asistencia: any[] = [];

  await db.query(`
    CREATE TABLE IF NOT EXISTS preceptores (
      id SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      turno TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cursos (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      nivel TEXT NOT NULL,
      seccion TEXT NOT NULL,
      preceptor_id INTEGER REFERENCES preceptores(id),
      total_estudiantes INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS estudiantes (
      id SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      curso_id TEXT REFERENCES cursos(id),
      activo BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS asistencia (
      id SERIAL PRIMARY KEY,
      estudiante_id INTEGER REFERENCES estudiantes(id),
      curso_id TEXT NOT NULL REFERENCES cursos(id),
      fecha DATE NOT NULL,
      presente BOOLEAN DEFAULT FALSE,
      tardanza BOOLEAN DEFAULT FALSE,
      justificado BOOLEAN DEFAULT FALSE,
      observaciones TEXT,
      preceptor_id INTEGER REFERENCES preceptores(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(estudiante_id, fecha)
    );
  `)
  // Insertar preceptores
    for (const p of preceptores) {
    await db.query(
        `INSERT INTO preceptores (id, nombre, email, turno, created_at) VALUES ($1, $2, $3, $4, $5)`,
        [p.id, p.nombre, p.email, p.turno, p.created_at]
    )
    }

    // Insertar cursos
    for (const c of cursos) {
    await db.query(
        `INSERT INTO cursos (id, nombre, nivel, seccion, preceptor_id, total_estudiantes) VALUES ($1, $2, $3, $4, $5, $6)`,
        [c.id, c.nombre, c.nivel, c.seccion, c.preceptor_id, c.total_estudiantes]
    )
    }

    // Insertar estudiantes
    for (const e of estudiantes) {
    await db.query(
        `INSERT INTO estudiantes (id, nombre, apellido, curso_id, activo) VALUES ($1, $2, $3, $4, $5)`,
        [e.id, e.nombre, e.apellido, e.curso_id, e.activo]
    )
    }

    // Insertar asistencia
    for (const a of asistencia) {
    await db.query(
        `INSERT INTO asistencia (id, estudiante_id, curso_id, fecha, presente, tardanza, justificado, observaciones, preceptor_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [a.id, a.estudiante_id, a.curso_id, a.fecha, a.presente, a.tardanza, a.justificado, a.observaciones || null, a.preceptor_id]
    )
    }

  console.log("📦 Base de datos inicializada correctamente.")
  await db.end()
}

init()
