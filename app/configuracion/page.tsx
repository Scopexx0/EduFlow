import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"
import { Settings, User, Bell, Lock, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function ConfiguracionPage() {
  const configOptions = [
    {
      id: 1,
      title: "Perfil",
      icon: <User className="h-5 w-5" />,
      description: "Actualiza tu información personal",
      href: "/configuracion/perfil"
    },
    // {
    //   id: 2,
    //   title: "Notificaciones",
    //   icon: <Bell className="h-5 w-5" />,
    //   description: "Configura alertas y recordatorios",
    //   href: "/configuracion/notificaciones"
    // },
    {
      id: 3,
      title: "Seguridad",
      icon: <Lock className="h-5 w-5" />,
      description: "Cambia contraseña",
      href: "/configuracion/seguridad"
    },
    // {
    //   id: 4,
    //   title: "Ayuda",
    //   icon: <HelpCircle className="h-5 w-5" />,
    //   description: "Centro de soporte y preguntas frecuentes",
    //   href: "/configuracion/ayuda"
    // }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Configuración
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Personaliza tu experiencia
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Opciones principales */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
              Preferencias
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {configOptions.map((option) => (
              <Link key={option.id} href={option.href}>
                <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                      {option.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {option.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Configuración de tema */}
        {/* <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
              Apariencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Modo oscuro
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Personaliza el tema de la aplicación
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card> */}

        {/* Configuración avanzada */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
              Configuración Avanzada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <Button variant="outline" className="w-full">
              Exportar datos
            </Button> */}
            <Button variant="destructive" className="w-full">
              Cerrar sesión
            </Button>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  )
}