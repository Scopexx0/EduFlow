"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegistrarContrasenaPage() {
  const [email, setEmail] = useState("")
  const [valido, setValido] = useState(false)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const verificarEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const res = await fetch("/api/set_up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error)
    } else {
      setValido(true)
    }
  }

  const registrar = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirm) {
      setError("Las contraseñas no coinciden")
      return
    }

    const res = await fetch("/api/set_up_pswd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error)
    } else {
      setSuccess("Contraseña registrada. Ya podés iniciar sesión.")
      router.push("/login")
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 space-y-4">
        
      <h1 className="text-2xl font-bold text-center">Registrar Contraseña</h1>

      {!valido ? (
        <form onSubmit={verificarEmail} className="space-y-4">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Verificar correo
          </button>
        </form>
      ) : (
        <form onSubmit={registrar} className="space-y-4">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Registrar contraseña
          </button>
        </form>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

    <small className="absolute top-[30%] text-small font-bold text-center text-gray-900 dark:text-gray-100 w-full">
        <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          Volver al Log In
        </a>
    </small>
    </div>
  )
}
