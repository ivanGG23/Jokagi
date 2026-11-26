// =====================================================================
//  DATOS DE PRUEBA (temporal)
//  Sirven para maquetar sin depender del backend. Cuando el backend esté
//  listo, page.tsx dejará de importar este archivo y usará las consultas
//  de modules/*/server/repository.ts. Después este archivo se puede borrar.
// =====================================================================
import type { BloqueDisponibilidad, Estilista, Servicio } from "./types";

export const serviciosDePrueba: Servicio[] = [
  { id_servicio: 1, nombre_servicio: "Corte dama diseño & estilizado", descripcion: "Diagnóstico de forma + lavado sensorial y secado", duracion_minutos: 45, precio: 550 },
  { id_servicio: 2, nombre_servicio: "Aplicación de tinte & baño gloss", descripcion: "Coloración personalizada y sellado de cutícula", duracion_minutos: 120, precio: 1000 },
  { id_servicio: 3, nombre_servicio: "Tratamiento hidratación profunda", descripcion: "Mascarilla nutritiva con vapor y masaje capilar", duracion_minutos: 60, precio: 780 },
  { id_servicio: 4, nombre_servicio: "Manicure rusa", descripcion: "Limpieza de cutícula en seco y esmaltado", duracion_minutos: 90, precio: 1200 },
  { id_servicio: 5, nombre_servicio: "Perfilado de cejas & diseño", descripcion: "Visagismo, depilación y relleno", duracion_minutos: 30, precio: 490 },
  { id_servicio: 6, nombre_servicio: "Peinado de evento", descripcion: "Ondas, recogidos o alaciado con fijación", duracion_minutos: 60, precio: 650 },
];

export const estilistasDePrueba: Estilista[] = [
  { id_estilista: 1, nombre: "Camila Morales", especialidad: "Especialista en Colorimetría & Balayage" },
  { id_estilista: 2, nombre: "Rodrigo Valdés", especialidad: "Corte de Autor y Texturas" },
];

// Fechas fijas en el futuro (diciembre 2026) para que siempre haya horarios.
let id = 1;
const bloque = (
  id_estilista: number,
  fecha: string,
  hora_inicio: string,
  hora_fin: string,
  estado: BloqueDisponibilidad["estado"] = "disponible",
): BloqueDisponibilidad => ({ id_disponibilidad: id++, id_estilista, fecha, hora_inicio, hora_fin, estado });

export const bloquesDePrueba: BloqueDisponibilidad[] = [
  // Camila Morales
  bloque(1, "2026-12-03", "10:00", "12:45"),
  bloque(1, "2026-12-03", "13:00", "15:45"),
  bloque(1, "2026-12-03", "16:00", "18:45"),
  bloque(1, "2026-12-03", "19:00", "20:00"),               // muy corto para 2h 45m
  bloque(1, "2026-12-04", "10:00", "12:00"),
  bloque(1, "2026-12-04", "12:30", "15:30", "reservado"),
  bloque(1, "2026-12-04", "16:00", "19:00"),
  bloque(1, "2026-12-05", "09:00", "12:00"),
  bloque(1, "2026-12-08", "10:00", "13:00"),
  bloque(1, "2026-12-08", "15:00", "18:00"),
  bloque(1, "2026-12-10", "11:00", "14:00"),
  bloque(1, "2026-12-11", "10:00", "12:45", "reservado"),
  bloque(1, "2026-12-11", "16:00", "19:00"),
  bloque(1, "2026-12-15", "10:00", "13:00"),
  bloque(1, "2026-12-17", "12:00", "15:00"),
  bloque(1, "2026-12-18", "09:00", "11:00"),
  bloque(1, "2026-12-18", "11:30", "14:30"),
  // Rodrigo Valdés
  bloque(2, "2026-12-02", "10:00", "11:00"),
  bloque(2, "2026-12-02", "12:00", "14:00"),
  bloque(2, "2026-12-03", "15:00", "18:00"),
  bloque(2, "2026-12-07", "10:00", "13:00"),
  bloque(2, "2026-12-09", "10:00", "11:30"),
  bloque(2, "2026-12-09", "16:00", "19:00"),
  bloque(2, "2026-12-12", "09:00", "12:00", "reservado"),
  bloque(2, "2026-12-14", "13:00", "16:00"),
  bloque(2, "2026-12-16", "10:00", "13:00"),
];
