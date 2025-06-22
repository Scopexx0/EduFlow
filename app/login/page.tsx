"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // setError("")

    try {
      const response = await fetch("api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      let result
      try {
        // BORRAR PARA PRODUCCION
        console.log("✅ Se llamó a page/login !!!!!!!!!!!!!!!!!!!!!!!!")
        // BORRAR PARA PRODUCCION
        result = await response.json()
      } catch (err) {
        console.error("Respuesta inválida ERROR: => ", err)
        return
      }

      if (!response.ok) {
        setError(result.error || "Error desconocido")
        return
      }

      // ✅ Login exitoso
      router.push("/")
      router.refresh()
    } catch (err) {
      console.error("Login error:", err)
      setError("Ocurrió un error al iniciar sesión.")
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold">Iniciar Sesión</h1>

      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Iniciar sesión
      </button>
    </form>
  )
}
