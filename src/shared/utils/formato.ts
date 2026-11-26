// Utilidades de formato compartidas (frontend y backend).
// Las fechas se manejan como texto "AAAA-MM-DD" (igual que el tipo DATE
// de PostgreSQL) y las horas como "HH:MM", para evitar problemas de zona horaria.

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
export const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

/** 1550 -> "$1,550 MXN" */
export function formatearPrecio(precio: number): string {
  return `$${precio.toLocaleString("es-MX", { maximumFractionDigits: 2 })} MXN`;
}

/** 165 -> "2h 45m" · 45 -> "45m" · 120 -> "2h" */
export function formatearDuracion(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** "10:00" -> 600 */
export function horaAMinutos(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

/** Minutos entre dos horas "HH:MM" */
export function minutosEntre(inicio: string, fin: string): number {
  return horaAMinutos(fin) - horaAMinutos(inicio);
}

/** "2024-10-24" -> Date local (sin desfase de zona horaria) */
export function fechaDesdeTexto(fecha: string): Date {
  const [a, m, d] = fecha.split("-").map(Number);
  return new Date(a, m - 1, d);
}

/** Date -> "2024-10-24" */
export function fechaATexto(fecha: Date): string {
  const a = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${a}-${m}-${d}`;
}

/** "2024-10-24" -> "Jueves 24 de Octubre, 2024" */
export function formatearFechaLarga(fecha: string): string {
  const f = fechaDesdeTexto(fecha);
  return `${DIAS[f.getDay()]} ${f.getDate()} de ${MESES[f.getMonth()]}, ${f.getFullYear()}`;
}

/** "2024-10-24" -> "Jueves 24 de Octubre" */
export function formatearFechaCorta(fecha: string): string {
  const f = fechaDesdeTexto(fecha);
  return `${DIAS[f.getDay()]} ${f.getDate()} de ${MESES[f.getMonth()]}`;
}
