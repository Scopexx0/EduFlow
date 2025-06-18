// Utilidades para manejo de fechas
export const dateUtils = {
  // Para base de datos (formato ISO)
  getToday: () => new Date().toISOString().split("T")[0],

  // Para mostrar al usuario (formato legible con capitalización)
  getTodayDisplay: () => {
    const fecha = new Date().toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    // Capitalizar primera letra de cada palabra
    return fecha.replace(/\b\w/g, (letra) => letra.toUpperCase())
  }
}