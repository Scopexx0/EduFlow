// Utilidades para manejo de fechas
export const dateUtils = {
  // Para base de datos (formato ISO)
  getToday: () => {
    const now = new Date().toLocaleDateString("en-CA", {
      timeZone: "America/Argentina/Buenos_Aires",
    })
    return now // devuelve "2025-07-02" por ejemplo
  },

  // Para mostrar al usuario (formato legible con capitalización)
  getTodayDisplay: () => {
    const fecha = new Date().toLocaleDateString("es-ES", {
      timeZone: "America/Argentina/Buenos_Aires",
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    // Capitalizar primera letra de cada palabra
    return fecha.replace(/(^|\s)\S/g, (letra) => letra.toUpperCase());
  }
}