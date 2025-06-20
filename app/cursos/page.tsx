"use client"
// Not needed for preceptor(could be deleted unless students are implemented)
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"
import { ArrowLeft, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ClasesPage() {
  const recentClasses = [
    {
      id: 1,
      date: "Hoy",
      subject: "Matemáticas",
      unit: "Álgebra II",
      topic: "Ecuaciones Cuadráticas",
      description:
        "Hoy aprendimos a resolver ecuaciones cuadráticas usando factorización y la fórmula general. Vimos ejemplos prácticos de aplicación.",
      objectives: [
        "Identificar ecuaciones cuadráticas",
        "Aplicar métodos de resolución",
        "Resolver problemas aplicados",
      ],
      homework: "Ejercicios 1-15 página 142",
      wasPresent: true,
    },
    {
      id: 2,
      date: "Ayer",
      subject: "Historia",
      unit: "Siglo XIX",
      topic: "Revolución Industrial",
      description:
        "Estudiamos las causas y consecuencias de la Revolución Industrial en Europa. Analizamos el impacto social y económico.",
      objectives: ["Analizar causas", "Identificar cambios sociales", "Evaluar impacto económico"],
      homework: "Ensayo de 500 palabras",
      wasPresent: true,
    },
    {
      id: 3,
      date: "Lunes",
      subject: "Ciencias",
      unit: "Biología Celular",
      topic: "Estructura Celular",
      description:
        "Observamos células vegetales y animales en el microscopio. Identificamos organelos y sus funciones.",
      objectives: ["Identificar partes celulares", "Usar microscopio", "Diferenciar tipos de células"],
      homework: "Dibujar célula vegetal",
      wasPresent: false,
    },
  ]

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
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Mis Clases</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Repaso de contenidos</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="p-4 space-y-4">
        {recentClasses.map((clase) => (
          <Card key={clase.id} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{clase.subject}</h3>
                  <Badge variant={clase.wasPresent ? "default" : "destructive"} className="text-xs">
                    {clase.wasPresent ? "✅ Presente" : "❌ Ausente"}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{clase.date}</span>
              </div>
              <Badge variant="outline" className="w-fit text-xs">
                📚 {clase.unit}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-base text-gray-800 dark:text-gray-200 mb-2">{clase.topic}</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  {clase.description}
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Lo que aprendimos:
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  {clase.objectives.map((obj, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {clase.homework && (
                <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded-lg border-l-4 border-orange-400 dark:border-orange-600">
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-1 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Tarea asignada:
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-300">{clase.homework}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </main>

      <MobileNav />
    </div>
  )
}
