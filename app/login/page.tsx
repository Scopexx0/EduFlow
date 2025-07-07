"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
      if (response.status === 403){
        console.warn(`Debe cambiar la contraseña antes de continuar ${response.status}`)
        router.push("/set_up")
        return
      }

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

      // Login exitoso
      console.log("Login exitoso, redirigiendo a la página principal")
      router.push("/")
      router.refresh()
    } catch (err) {
      console.error("Login error:", err)
      setError("Ocurrió un error al iniciar sesión.")
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      {/* Nombre o título principal */}
      <h1 className="absolute top-[20%] text-3xl font-bold text-center text-gray-900 dark:text-gray-100 w-full">
        Bienvenido a EduFlow
      </h1>
      <Card className="w-full max-w-md bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full">
              Iniciar sesión
            </Button>
          </form>
        </CardContent>
      </Card>
      <small className="absolute bottom-[10%] text-small font-bold text-center text-gray-900 dark:text-gray-100 w-full">
        <a href="set_up" className="text-blue-600 dark:text-blue-400 hover:underline">
          ¿Primera Vez Aqui?
        </a>
      </small>
    </main>
  )
}
