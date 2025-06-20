// lib/db.ts
import { Pool } from "pg"

export const db = new Pool({
  user: "eduflow",
  host: "localhost",
  database: "eduflow",
  password: "eduflow123",
  port: 5432,
})
