"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"
import { ClipboardList, Users, AlertTriangle, CheckCircle, Clock, Bell, UserCheck, UserX, Calendar } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  // Datos del preceptor
  const preceptorData = {
    name: "María González",
    role: "Preceptora",
    turno: "Mañana",
    cursosAsignados: 8,
  }

  // Resumen del día
  const dailyStats = {
    totalEstudiantes: 240,
    presentes: 218,
    ausentes: 22,
    tardanzas: 8,
    justificaciones: 5,
  }

  // Cursos asignados
  const cursosAsignados = [
    {
      id: "1a",
      nombre: "1° A",
      estudiantes: 28,
      presentes: 26,
      ausentes: 2,
      tardanzas: 1,
      asistenciaTomada: true,
    },
    {
      id: "1b",
      nombre: "1° B",
      estudiantes: 30,
      presentes: 28,
      ausentes: 2,
      tardanzas: 0,
      asistenciaTomada: true,
    },
    {
      id: "2a",
      nombre: "2° A",
      estudiantes: 32,
      presentes: 0,
      ausentes: 0,
      tardanzas: 0,
      asistenciaTomada: false,
    },
    {
      id: "2b",
      nombre: "2° B",
      estudiantes: 29,
      presentes: 0,
      ausentes: 0,
      tardanzas: 0,
      asistenciaTomada: false,
    },
  ]

  // Alertas importantes
  const alertas = [
    {
      id: 1,
      tipo: "ausencia",
      mensaje: "Juan Pérez (2° A) - 3 faltas consecutivas",
      urgencia: "alta",
    },
    {
      id: 2,
      tipo: "tardanza",
      mensaje: "María López (1° B) - 5 tardanzas esta semana",
      urgencia: "media",
    },
    {
      id: 3,
      tipo: "justificacion",
      mensaje: "3 justificaciones pendientes de revisión",
      urgencia: "baja",
    },
  ]

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case "alta":
        return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
      case "media":
        return "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200"
      case "baja":
        return "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
      default:
        return "bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Header móvil */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <UserCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Hola {preceptorData.name.split(" ")[0]} 👋
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {preceptorData.role} - Turno {preceptorData.turno}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Resumen del día */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Resumen de Hoy
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">Miércoles, 17 de Enero 2024</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">Presentes</span>
                </div>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">{dailyStats.presentes}</p>
                <p className="text-xs text-green-600 dark:text-green-400">de {dailyStats.totalEstudiantes}</p>
              </div>

              <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-1">
                  <UserX className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">Ausentes</span>
                </div>
                <p className="text-2xl font-bold text-red-800 dark:text-red-200">{dailyStats.ausentes}</p>
                <p className="text-xs text-red-600 dark:text-red-400">{dailyStats.tardanzas} tardanzas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acceso rápido a asistencia */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Tomar Asistencia</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">Registra la asistencia de tus cursos</p>
              </div>
              <Link href="/asistencia" className="flex-shrink-0">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Comenzar
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Estado de cursos */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Mis Cursos
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">{preceptorData.cursosAsignados} cursos asignados</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {cursosAsignados.map((curso) => (
              <div
                key={curso.id}
                className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">{curso.nombre}</h3>
                    <Badge variant={curso.asistenciaTomada ? "default" : "destructive"} className="text-xs">
                      {curso.asistenciaTomada ? "✅ Tomada" : "⏳ Pendiente"}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{curso.estudiantes} estudiantes</span>
                </div>

                {curso.asistenciaTomada ? (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-600 dark:text-green-400">✅ {curso.presentes} presentes</span>
                    <span className="text-red-600 dark:text-red-400">❌ {curso.ausentes} ausentes</span>
                    {curso.tardanzas > 0 && (
                      <span className="text-orange-600 dark:text-orange-400">⏰ {curso.tardanzas} tarde</span>
                    )}
                  </div>
                ) : (
                  <Link href={`/asistencia?curso=${curso.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Tomar Asistencia
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alertas importantes */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              Alertas
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">Situaciones que requieren atención</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertas.map((alerta) => (
              <div key={alerta.id} className={`p-3 rounded-lg border ${getUrgenciaColor(alerta.urgencia)}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {alerta.tipo === "ausencia" && <UserX className="h-4 w-4" />}
                    {alerta.tipo === "tardanza" && <Clock className="h-4 w-4" />}
                    {alerta.tipo === "justificacion" && <ClipboardList className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alerta.mensaje}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs">
                        {alerta.urgencia === "alta"
                          ? "🔴 Urgente"
                          : alerta.urgencia === "media"
                            ? "🟡 Moderado"
                            : "🔵 Informativo"}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-xs h-6">
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Acciones rápidas */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/asistencia">
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 w-full bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900"
                >
                  <ClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-sm">Asistencia</span>
                </Button>
              </Link>
              <Link href="/cursos">
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 w-full bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900"
                >
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium text-sm">Ver Cursos</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  )
}
