// hash-password.ts
import { hash } from "bcryptjs"

async function main() {
  const hashed = await hash("3", 10)
  console.log("Hashed password:", hashed)
}

main()
