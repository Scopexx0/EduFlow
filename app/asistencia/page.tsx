"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save, Users, Search, CheckCircle, UserX } from "lucide-react"
import Link from "next/link"

export default function AsistenciaPage() {
  const [selectedCourse, setSelectedCourse] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const courses = [
    { id: "1a", name: "1° A", students: 28 },
    { id: "1b", name: "1° B", students: 30 },
    { id: "2a", name: "2° A", students: 32 },
    { id: "2b", name: "2° B", students: 29 },
    { id: "3a", name: "3° A", students: 26 },
    { id: "3b", name: "3° B", students: 31 },
  ]

  const [students, setStudents] = useState([
    { id: 1, name: "Ana García Rodríguez", present: true, late: false, justified: false },
    { id: 2, name: "Carlos López Martínez", present: false, late: false, justified: true },
    { id: 3, name: "María Rodríguez Silva", present: true, late: true, justified: false },
    { id: 4, name: "Juan Pérez González", present: true, late: false, justified: false },
    { id: 5, name: "Laura Martínez Torres", present: false, late: false, justified: false },
    { id: 6, name: "Diego Sánchez López", present: true, late: false, justified: false },
    { id: 7, name: "Sofia Torres Ruiz", present: true, late: false, justified: false },
    { id: 8, name: "Miguel Herrera Castro", present: true, late: true, justified: false },
    { id: 9, name: "Valentina Morales", present: true, late: false, justified: false },
    { id: 10, name: "Sebastián Jiménez", present: false, late: false, justified: false },
  ])

  const updateAttendance = (studentId: number, field: string, value: boolean) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          const updated = { ...student, [field]: value }
          // Si marca presente, quitar justificado
          if (field === "present" && value) {
            updated.justified = false
          }
          // Si marca justificado, quitar presente
          if (field === "justified" && value) {
            updated.present = false
            updated.late = false
          }
          // Si desmarca presente, quitar tardanza
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Registrar asistencia diaria</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="p-4 space-y-4">
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
                    {course.name} ({course.students} estudiantes)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCourse && (
              <div className="flex gap-2">
                <Button onClick={markAllPresent} variant="outline" size="sm" className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marcar todos presentes
                </Button>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedCourse && (
          <>
            {/* Resumen */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Users className="h-4 w-4" />
                  Resumen - {courses.find((c) => c.id === selectedCourse)?.name}
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
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-gray-900 dark:text-gray-100">
                  Lista de Estudiantes ({filteredStudents.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                          onCheckedChange={(checked) => updateAttendance(student.id, "justified", checked as boolean)}
                          disabled={student.present}
                          className="h-5 w-5"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Botón guardar fijo */}
            <div className="fixed bottom-24 left-4 right-4 z-40 pb-safe">
              <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg">
                <Save className="h-5 w-5 mr-2" />
                Guardar Asistencia
              </Button>
            </div>
          </>
        )}
      </main>

      <MobileNav />
    </div>
  )
}
