"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Calendar,
  BookOpen,
  ClipboardCheck,
  AlertCircle,
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
  User,
} from "lucide-react"

export default function EstudiantePage() {
  // Datos del estudiante actual (normalmente vendrían de la sesión/API)
  const studentData = {
    name: "Ana García Rodríguez",
    course: "9° A",
    studentId: "2024001",
    attendance: 92,
    totalClasses: 25,
    presentClasses: 23,
    average: 8.4,
    lastAccess: "2024-01-15",
  }

  const upcomingEvents = [
    {
      id: 1,
      title: "Examen de Ecuaciones Cuadráticas",
      subject: "Matemáticas",
      date: "2024-01-18",
      time: "08:00",
      type: "Examen",
      description:
        "Evaluación sobre resolución de ecuaciones cuadráticas por factorización y fórmula general. Estudiar capítulos 7 y 8 del libro.",
      daysLeft: 2,
    },
    {
      id: 2,
      title: "Entrega Proyecto Historia",
      subject: "Historia",
      date: "2024-01-20",
      time: "23:59",
      type: "Entrega",
      description: "Ensayo de 1000 palabras sobre el impacto social de la Revolución Industrial. Incluir bibliografía.",
      daysLeft: 4,
    },
    {
      id: 3,
      title: "Laboratorio de Fotosíntesis",
      subject: "Ciencias",
      date: "2024-01-22",
      time: "14:00",
      type: "Práctica",
      description: "Práctica de laboratorio sobre el proceso de fotosíntesis en plantas. Traer bata y cuaderno.",
      daysLeft: 6,
    },
  ]

  const recentClasses = [
    {
      id: 1,
      date: "2024-01-15",
      subject: "Matemáticas",
      unit: "Álgebra II",
      topic: "Ecuaciones Cuadráticas",
      description:
        "Hoy aprendimos a resolver ecuaciones cuadráticas usando dos métodos principales: factorización y la fórmula general. Practicamos con varios ejemplos y vimos aplicaciones en problemas de la vida real como cálculo de áreas y trayectorias.",
      objectives: [
        "Identificar ecuaciones cuadráticas",
        "Aplicar métodos de resolución",
        "Resolver problemas aplicados",
      ],
      homework: "Ejercicios 1-15 página 142 para mañana",
      wasPresent: true,
    },
    {
      id: 2,
      date: "2024-01-14",
      subject: "Historia",
      unit: "Siglo XIX",
      topic: "Revolución Industrial",
      description:
        "Estudiamos las causas, desarrollo y consecuencias de la Revolución Industrial en Europa. Analizamos cómo cambió la vida de las personas, el trabajo en las fábricas y el crecimiento de las ciudades.",
      objectives: ["Analizar causas de la revolución", "Identificar cambios sociales", "Evaluar impacto económico"],
      homework: "Leer capítulo 12 y preparar ensayo de 500 palabras",
      wasPresent: true,
    },
    {
      id: 3,
      date: "2024-01-12",
      subject: "Ciencias",
      unit: "Biología Celular",
      topic: "Estructura Celular",
      description:
        "Revisamos la estructura de células vegetales y animales usando el microscopio. Identificamos organelos como núcleo, mitocondrias y cloroplastos. Fue muy interesante ver las células reales.",
      objectives: [
        "Identificar partes de la célula",
        "Diferenciar células vegetales y animales",
        "Usar el microscopio correctamente",
      ],
      homework: "Dibujar y etiquetar célula vegetal y animal",
      wasPresent: false,
    },
  ]

  const attendanceData = [
    { subject: "Matemáticas", present: 8, total: 9, percentage: 89 },
    { subject: "Historia", present: 7, total: 8, percentage: 88 },
    { subject: "Ciencias", present: 8, total: 8, percentage: 100 },
  ]

  const getEventIcon = (type: string) => {
    switch (type) {
      case "Examen":
        return AlertCircle
      case "Entrega":
        return Clock
      case "Práctica":
        return CheckCircle
      default:
        return Calendar
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "Examen":
        return "text-red-500 dark:text-red-400"
      case "Entrega":
        return "text-orange-500 dark:text-orange-400"
      case "Práctica":
        return "text-green-500 dark:text-green-400"
      default:
        return "text-blue-500 dark:text-blue-400"
    }
  }

  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft <= 1) return "bg-red-100 border-red-200 dark:bg-red-950 dark:border-red-800"
    if (daysLeft <= 3) return "bg-orange-100 border-orange-200 dark:bg-orange-950 dark:border-orange-800"
    return "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header optimizado para iPhone con tema oscuro */}
      <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-white dark:bg-gray-900 px-4 sticky top-0 z-50 border-gray-200 dark:border-gray-800">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Hola Ana 👋</h1>
              <p className="text-xs text-muted-foreground">{studentData.course}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Badge variant="outline" className="text-xs font-medium">
              ID: {studentData.studentId}
            </Badge>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4 pb-20">
        {/* Stats Cards optimizadas para tema oscuro */}
        <div className="grid gap-3 grid-cols-2">
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 dark:bg-green-600">
                <ClipboardCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-green-700 dark:text-green-300 font-medium">Mi Asistencia</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">{studentData.attendance}%</p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {studentData.presentClasses}/{studentData.totalClasses} clases
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 dark:bg-blue-600">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Mi Promedio</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{studentData.average}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Muy bien 🎉</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Próximos eventos destacados con tema oscuro */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
              ¡Próximas Evaluaciones!
            </CardTitle>
            <CardDescription className="text-sm">No olvides estudiar para estas fechas importantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.slice(0, 2).map((event) => {
              const IconComponent = getEventIcon(event.type)
              return (
                <div key={event.id} className={`border rounded-xl p-4 ${getUrgencyColor(event.daysLeft)}`}>
                  <div className="flex items-start gap-3">
                    <IconComponent className={`h-6 w-6 mt-1 ${getEventColor(event.type)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">{event.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        📚 {event.subject} • 📅 {event.date} • ⏰ {event.time}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {event.daysLeft === 1 ? "¡Mañana!" : `En ${event.daysLeft} días`}
                        </span>
                        <Button size="sm" variant="outline" className="text-xs">
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Tabs principales con tema oscuro */}
        <Tabs defaultValue="clases" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <TabsTrigger
              value="clases"
              className="text-sm font-medium data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              📖 Mis Clases
            </TabsTrigger>
            <TabsTrigger
              value="asistencia"
              className="text-sm font-medium data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
            >
              📊 Mi Asistencia
            </TabsTrigger>
          </TabsList>

          {/* Repaso de Clases con tema oscuro */}
          <TabsContent value="clases" className="space-y-4 mt-4">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Repaso de Clases
                </CardTitle>
                <CardDescription className="text-sm">Revisa lo que hemos visto en clases recientes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentClasses.map((clase) => (
                  <div
                    key={clase.id}
                    className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">{clase.subject}</h3>
                        <Badge variant={clase.wasPresent ? "default" : "destructive"} className="text-xs">
                          {clase.wasPresent ? "✅ Presente" : "❌ Ausente"}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{clase.date}</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Badge variant="outline" className="text-xs mb-2 bg-white dark:bg-gray-900">
                          📚 {clase.unit}
                        </Badge>
                        <h4 className="font-medium text-base text-gray-800 dark:text-gray-200">{clase.topic}</h4>
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        {clase.description}
                      </p>

                      <div className="space-y-3">
                        <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
                            🎯 Lo que aprendimos:
                          </p>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                            {clase.objectives.map((obj, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-500 dark:text-green-400 mt-1">•</span>
                                <span>{obj}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {clase.homework && (
                          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border-l-4 border-blue-400 dark:border-blue-600">
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">📝 Tarea:</p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">{clase.homework}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mi Asistencia con tema oscuro */}
          <TabsContent value="asistencia" className="space-y-4 mt-4">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Mi Asistencia
                </CardTitle>
                <CardDescription className="text-sm">Seguimiento de tu asistencia por materia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Resumen general */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base font-semibold text-green-800 dark:text-green-200">📈 Asistencia General</p>
                    <Badge className="bg-green-500 dark:bg-green-600 text-white font-bold">
                      {studentData.attendance}%
                    </Badge>
                  </div>
                  <Progress value={studentData.attendance} className="h-3 mb-2" />
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Has asistido a {studentData.presentClasses} de {studentData.totalClasses} clases
                  </p>
                </div>

                {/* Por materia */}
                <div className="space-y-3">
                  <p className="text-base font-semibold text-gray-800 dark:text-gray-200">📚 Por Materia</p>
                  {attendanceData.map((subject, index) => (
                    <div
                      key={index}
                      className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-base font-medium text-gray-800 dark:text-gray-200">{subject.subject}</p>
                        <Badge
                          variant={
                            subject.percentage >= 90
                              ? "default"
                              : subject.percentage >= 80
                                ? "secondary"
                                : "destructive"
                          }
                          className="font-bold"
                        >
                          {subject.percentage}%
                        </Badge>
                      </div>
                      <Progress value={subject.percentage} className="h-3 mb-2" />
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {subject.present} de {subject.total} clases
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {subject.percentage >= 90
                            ? "¡Excelente! 🌟"
                            : subject.percentage >= 80
                              ? "Muy bien 👍"
                              : "Mejorar 📈"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Acciones rápidas con tema oscuro */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">⚡ Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-2">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 text-sm bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900"
              >
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span className="font-medium">Ver Horario</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 text-sm bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900"
              >
                <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <span className="font-medium">Mis Notas</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
