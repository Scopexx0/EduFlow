"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save, Users, Search, CheckCircle, UserX, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import type { Course, Student } from "@/types"
import { dateUtils } from "@/lib/date-utils"

export default function AsistenciaPage() {
  const todayDisplay = dateUtils.getTodayDisplay()
  // Router para redirigir después de guardar
  const router = useRouter()
  // Estados con tipos correctos
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [loadingStudents, setLoadingStudents] = useState<boolean>(false)

  // Para obtener parámetros de URL (?curso=1a)
  const searchParams = useSearchParams()
  const cursoFromUrl = searchParams.get("curso")

  // Cargar cursos al iniciar
  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const response = await fetch("/api/cursos")
        if (!response.ok) {
          throw new Error("Error al cargar cursos")
        }
        const cursosData: Course[] = await response.json()
        setCourses(cursosData)

        // Si viene curso por URL, seleccionarlo automáticamente
        if (cursoFromUrl) {
          setSelectedCourse(cursoFromUrl)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error cargando cursos:", error)
        setLoading(false)
      }
    }

    cargarCursos()
  }, [cursoFromUrl])

  // Cargar estudiantes cuando se selecciona un curso
  useEffect(() => {
    if (selectedCourse) {
      const cargarEstudiantes = async () => {
        setLoadingStudents(true)
        try {
          const response = await fetch(`/api/estudiantes/${selectedCourse}`)
          if (!response.ok) {
            router.push("/")
            router.refresh()
            throw new Error("Error al cargar estudiantes")
          }
          const estudiantesData: Student[] = await response.json()
          setStudents(estudiantesData)
        } catch (error) {
          console.error("Error cargando estudiantes:", error)
        }
        setLoadingStudents(false)
      }

      cargarEstudiantes()
    }
  }, [selectedCourse])

  const updateAttendance = (
    studentId: number,
    field: keyof Pick<Student, "present" | "late" | "justified">,
    value: boolean,
  ) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          const updated = { ...student, [field]: value }
          // Lógica de negocio
          if (field === "present" && value) {
            updated.justified = false
          }
          if (field === "justified" && value) {
            updated.present = false
            updated.late = false
          }
          if (field === "present" && !value) {
            updated.late = false
          }
          return updated
        }
        return student
      }),
    )
  }

  const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const presentCount = students.filter((s) => s.present).length
  const absentCount = students.filter((s) => !s.present && !s.justified).length
  const lateCount = students.filter((s) => s.late).length
  const justifiedCount = students.filter((s) => s.justified).length

  const markAllPresent = () => {
    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        present: true,
        late: false,
        justified: false,
      })),
    )
  }

  // Guardar en base de datos
  const guardarAsistencia = async () => {
    if (!selectedCourse || students.length === 0) {
      alert("Selecciona un curso y carga los estudiantes")
      return
    }

    setSaving(true)
    try {
      const today = new Date().toISOString().split("T")[0]

      const response = await fetch("/api/asistencia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cursoId: selectedCourse,
          fecha: today,
          estudiantes: students,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        alert("✅ Asistencia guardada correctamente!")
        // Opcional: redirigir o actualizar datos
        router.push("/")
        router.refresh()
      } else {
        alert(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      console.error("Error guardando asistencia:", error)
      alert("❌ Error de conexión")
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Cargando cursos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Header móvil */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Asistencia</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {todayDisplay}
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="p-4 space-y-4 pb-24">
        {/* Selección de curso */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-gray-900 dark:text-gray-100">Seleccionar Curso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Elige un curso para tomar asistencia" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.nombre} ({course.estudiantes} estudiantes)
                    {course.asistenciaTomada && " ✅"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCourse && (
              <div className="flex gap-2">
                <Button
                  onClick={markAllPresent}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  disabled={loadingStudents}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marcar todos presentes
                </Button>
                <Button variant="outline" size="sm" onClick={guardarAsistencia} disabled={saving || loadingStudents}>
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  {saving ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedCourse && (
          <>
            {loadingStudents ? (
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardContent className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-gray-600 dark:text-gray-400">Cargando estudiantes...</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Resumen */}
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <Users className="h-4 w-4" />
                      Resumen - {courses.find((c) => c.id === selectedCourse)?.nombre}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-green-800 dark:text-green-200">Presentes</span>
                        </div>
                        <p className="text-xl font-bold text-green-800 dark:text-green-200">{presentCount}</p>
                        {lateCount > 0 && (
                          <p className="text-xs text-green-600 dark:text-green-400">{lateCount} llegaron tarde</p>
                        )}
                      </div>

                      <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-2 mb-1">
                          <UserX className="h-4 w-4 text-red-600 dark:text-red-400" />
                          <span className="text-sm font-medium text-red-800 dark:text-red-200">Ausentes</span>
                        </div>
                        <p className="text-xl font-bold text-red-800 dark:text-red-200">{absentCount}</p>
                        {justifiedCount > 0 && (
                          <p className="text-xs text-red-600 dark:text-red-400">{justifiedCount} justificados</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Búsqueda */}
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <CardContent className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar estudiante..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Lista de estudiantes */}
                <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-32">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-gray-900 dark:text-gray-100">
                      Lista de Estudiantes ({filteredStudents.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pb-8">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-base text-gray-900 dark:text-gray-100">{student.name}</h3>
                          <div className="flex items-center gap-1">
                            {student.present && <Badge className="bg-green-500 text-white text-xs">Presente</Badge>}
                            {student.late && (
                              <Badge variant="outline" className="text-xs">
                                Tarde
                              </Badge>
                            )}
                            {student.justified && <Badge className="bg-blue-500 text-white text-xs">Justificado</Badge>}
                            {!student.present && !student.justified && (
                              <Badge variant="destructive" className="text-xs">
                                Ausente
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Presente</span>
                            <Checkbox
                              checked={student.present}
                              onCheckedChange={(checked) => updateAttendance(student.id, "present", checked as boolean)}
                              className="h-5 w-5"
                            />
                          </div>

                          <div className="flex flex-col items-center gap-2">
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Tarde</span>
                            <Checkbox
                              checked={student.late}
                              onCheckedChange={(checked) => updateAttendance(student.id, "late", checked as boolean)}
                              disabled={!student.present}
                              className="h-5 w-5"
                            />
                          </div>

                          <div className="flex flex-col items-center gap-2">
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Justificado</span>
                            <Checkbox
                              checked={student.justified}
                              onCheckedChange={(checked) =>
                                updateAttendance(student.id, "justified", checked as boolean)
                              }
                              disabled={student.present}
                              className="h-5 w-5"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredStudents.length === 0 && students.length > 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No se encontraron estudiantes con "{searchTerm}"</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Botón guardar fijo */}
                <div className="fixed bottom-24 left-4 right-4 z-40 pb-safe">
                  <Button
                    onClick={guardarAsistencia}
                    disabled={saving}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Guardando Asistencia...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Guardar Asistencia
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </main>

      <MobileNav />
    </div>
  )
}
