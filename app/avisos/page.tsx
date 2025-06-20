import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { Bell, BellOff, Mail, MessageSquare, Megaphone, Calendar } from "lucide-react"
import Link from "next/link"

export default function AvisosPage() {
  const avisos = [
    {
      id: 1,
      titulo: "Reunión de preceptores",
      fecha: "2024-05-15",
      descripcion: "Recordatorio: Reunión mensual a las 10:00hs en sala de profesores",
      leido: false,
      tipo: "institucional"
    },
    {
      id: 2,
      titulo: "Nuevo protocolo de asistencia",
      fecha: "2024-05-10",
      descripcion: "Se actualizó el procedimiento para justificaciones médicas",
      leido: true,
      tipo: "importante"
    },
    {
      id: 3,
      titulo: "Encuesta de satisfacción",
      fecha: "2024-05-05",
      descripcion: "Por favor completar la encuesta anual antes del 20/05",
      leido: true,
      tipo: "general"
    }
  ]

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "importante":
        return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
      case "institucional":
        return "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
      default:
        return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "importante":
        return <Megaphone className="h-5 w-5 text-red-600 dark:text-red-400" />
      case "institucional":
        return <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      default:
        return <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <Bell className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Avisos y Comunicados
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {avisos.length} mensajes
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <BellOff className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Nuevo aviso */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Nuevo Aviso</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">Crea comunicados para estudiantes o profesores</p>
            </div>
            <Link href="/avisos/nuevo" className="flex-shrink-0">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                <Megaphone className="h-4 w-4 mr-2" />
                Crear aviso
                </Button>
            </Link>
            </div>
        </CardContent>
        </Card>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button variant="outline" size="sm">
            Todos
          </Button>
          <Button variant="outline" size="sm">
            No leídos
          </Button>
          <Button variant="outline" size="sm">
            Importantes
          </Button>
          <Button variant="outline" size="sm">
            Institucionales
          </Button>
        </div>

        {/* Lista de avisos */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
              Comunicados Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {avisos.map((aviso) => (
              <div 
                key={aviso.id} 
                className={`p-4 rounded-lg border ${getTipoColor(aviso.tipo)} ${!aviso.leido ? "border-l-4 border-l-blue-500" : ""}`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getTipoIcon(aviso.tipo)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className={`font-medium ${!aviso.leido ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"}`}>
                        {aviso.titulo}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {aviso.fecha}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {aviso.descripcion}
                    </p>
                    {!aviso.leido && (
                      <Button variant="link" size="sm" className="p-0 h-auto text-blue-600 dark:text-blue-400 mt-2">
                        Marcar como leído
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Historial */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
              Historial de Avisos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Ver todos los avisos anteriores
            </Button>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  )
}