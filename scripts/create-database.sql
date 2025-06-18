-- Crear base de datos EduFlow
-- Ejecutar con: sqlite3 eduflow.db < scripts/create-database.sql

-- Crear tablas
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

-- Insertar datos de ejemplo
INSERT INTO preceptores (nombre, email, turno) VALUES 
('Roberto González', 'robert.gonzalez@escuela.edu', 'Tarde');

-- Insertar cursos
-- INSERT INTO cursos (id, nombre, nivel, seccion, preceptor_id, total_estudiantes) VALUES 
-- ('1a', '1° A', '1', 'A', 1, 28),
-- ('1b', '1° B', '1', 'B', 1, 30),
-- ('2a', '2° A', '2', 'A', 1, 32),
-- ('2b', '2° B', '2', 'B', 1, 29),
-- ('3a', '3° A', '3', 'A', 1, 26),
-- ('3b', '3° B', '3', 'B', 1, 31);

-- -- Insertar estudiantes
-- INSERT INTO estudiantes (nombre, apellido, curso_id) VALUES 
-- -- 1° A
-- ('Ana', 'García Rodríguez', '1a'),
-- ('Carlos', 'López Martínez', '1a'),
-- ('María', 'Rodríguez Silva', '1a'),
-- ('Juan', 'Pérez González', '1a'),
-- ('Laura', 'Martínez Torres', '1a'),
-- ('Diego', 'Sánchez López', '1a'),
-- ('Sofia', 'Torres Ruiz', '1a'),
-- ('Miguel', 'Herrera Castro', '1a'),
-- ('Valentina', 'Morales Díaz', '1a'),
-- ('Sebastián', 'Jiménez Vargas', '1a'),
-- -- 1° B
-- ('Isabella', 'Ramírez Cruz', '1b'),
-- ('Alejandro', 'Fernández Ruiz', '1b'),
-- ('Camila', 'Gutiérrez Moreno', '1b'),
-- ('Mateo', 'Castillo Herrera', '1b'),
-- ('Lucía', 'Mendoza Flores', '1b'),
-- ('Santiago', 'Vargas Peña', '1b'),
-- ('Antonella', 'Rojas Vega', '1b'),
-- ('Nicolás', 'Silva Ortega', '1b'),
-- ('Renata', 'Paredes Luna', '1b'),
-- ('Emilio', 'Guerrero Soto', '1b');
