"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Plus, AlertCircle, Clock, CheckCircle, Edit, Trash2 } from "lucide-react"

export default function FechasPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedType, setSelectedType] = useState("")

  const eventTypes = [
    { value: "examen", label: "Examen", icon: AlertCircle, color: "text-red-500" },
    { value: "entrega", label: "Entrega", icon: Clock, color: "text-orange-500" },
    { value: "practica", label: "Práctica", icon: CheckCircle, color: "text-green-500" },
    { value: "presentacion", label: "Presentación", icon: Calendar, color: "text-blue-500" },
  ]

  const courses = [
    { id: "9a", name: "9° A - Matemáticas" },
    { id: "10b", name: "10° B - Historia" },
    { id: "11a", name: "11° A - Ciencias" },
  ]

  const events = [
    {
      id: 1,
      title: "Examen de Ecuaciones Cuadráticas",
      type: "examen",
      course: "9° A - Matemáticas",
      date: "2024-01-18",
      time: "08:00",
      description: "Evaluación sobre resolución de ecuaciones cuadráticas",
      status: "programado",
      weight: "25%",
    },
    {
      id: 2,
      title: "Entrega Proyecto Revolución Industrial",
      type: "entrega",
      course: "10° B - Historia",
      date: "2024-01-20",
      time: "23:59",
      description: "Ensayo de 1000 palabras sobre el impacto social de la Revolución Industrial",
      status: "programado",
      weight: "30%",
    },
    {
      id: 3,
      title: "Laboratorio de Fotosíntesis",
      type: "practica",
      course: "11° A - Ciencias",
      date: "2024-01-22",
      time: "14:00",
      description: "Práctica de laboratorio sobre el proceso de fotosíntesis",
      status: "programado",
      weight: "15%",
    },
    {
      id: 4,
      title: "Presentación Teorema de Pitágoras",
      type: "presentacion",
      course: "9° A - Matemáticas",
      date: "2024-01-16",
      time: "10:00",
      description: "Presentación grupal sobre aplicaciones del teorema",
      status: "completado",
      weight: "20%",
    },
  ]

  const getEventIcon = (type: string) => {
    const eventType = eventTypes.find((t) => t.value === type)
    return eventType ? eventType.icon : Calendar
  }

  const getEventColor = (type: string) => {
    const eventType = eventTypes.find((t) => t.value === type)
    return eventType ? eventType.color : "text-gray-500"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "programado":
        return <Badge>Programado</Badge>
      case "completado":
        return <Badge variant="secondary">Completado</Badge>
      case "vencido":
        return <Badge variant="destructive">Vencido</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Fechas Importantes</h1>
            <p className="text-sm text-muted-foreground">Gestiona evaluaciones, entregas y eventos importantes</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Fecha
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Programar Fecha Importante</DialogTitle>
                <DialogDescription>Registra una nueva evaluación, entrega o evento</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="course">Curso</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar curso" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Evento</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className={`h-4 w-4 ${type.color}`} />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input placeholder="Ej: Examen de Matemáticas - Capítulo 5" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Hora</Label>
                    <Input type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (%)</Label>
                    <Input placeholder="25" type="number" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea placeholder="Describe el contenido, requisitos o instrucciones..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>Programar Evento</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Eventos programados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exámenes</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Próximos 7 días</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entregas</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prácticas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Esta semana</p>
            </CardContent>
          </Card>
        </div>

        {/* Events Calendar View */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
                <CardDescription>Evaluaciones y entregas programadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Evento</TableHead>
                        <TableHead className="hidden md:table-cell">Curso</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead className="hidden md:table-cell">Peso</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => {
                        const IconComponent = getEventIcon(event.type)
                        return (
                          <TableRow key={event.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <IconComponent className={`h-4 w-4 ${getEventColor(event.type)}`} />
                                <div>
                                  <p className="font-medium">{event.title}</p>
                                  <p className="text-sm text-muted-foreground">{event.time}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge variant="outline">{event.course}</Badge>
                            </TableCell>
                            <TableCell>{event.date}</TableCell>
                            <TableCell className="hidden md:table-cell">{event.weight}</TableCell>
                            <TableCell>{getStatusBadge(event.status)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                  {events.map((event) => {
                    const IconComponent = getEventIcon(event.type)
                    return (
                      <Card key={event.id}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <IconComponent className={`h-4 w-4 ${getEventColor(event.type)}`} />
                            {event.title}
                          </CardTitle>
                          <CardDescription>{event.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p>
                            <strong>Curso:</strong> {event.course}
                          </p>
                          <p>
                            <strong>Fecha:</strong> {event.date} - {event.time}
                          </p>
                          <p>
                            <strong>Peso:</strong> {event.weight}
                          </p>
                          <div className="flex justify-between items-center">
                            {getStatusBadge(event.status)}
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recordatorios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Examen mañana</p>
                    <p className="text-xs text-muted-foreground">9° A - Matemáticas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Entrega en 3 días</p>
                    <p className="text-xs text-muted-foreground">10° B - Historia</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Filtros Rápidos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                  Solo Exámenes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2 text-orange-500" />
                  Solo Entregas
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Esta Semana
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
