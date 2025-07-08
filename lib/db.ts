// // lib/db.ts local
// import { Pool } from "pg"

// export const db = new Pool({
//   user: "eduflow",
//   host: "localhost",
//   database: "eduflow",
//   password: "eduflow123",
//   port: 5432,
// })
// lib/db.ts
import { Pool } from "pg"

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necesario para Supabase
  },
})
