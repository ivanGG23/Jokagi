// Reglas de negocio de citas que se usan en frontend y backend.
// (La regla definitiva la aplica PostgreSQL con el trigger
//  fn_validar_duracion_cita; aquí solo se usa para mostrarla en pantalla.)
import { minutosEntre } from "@/shared/utils/formato";
import type { BloqueDisponibilidad, Servicio } from "./types";

export function duracionBloque(bloque: BloqueDisponibilidad): number {
  return minutosEntre(bloque.hora_inicio, bloque.hora_fin);
}

/** ¿Los servicios caben dentro del bloque? */
export function cabeEnBloque(bloque: BloqueDisponibilidad, duracionRequerida: number): boolean {
  return duracionBloque(bloque) >= duracionRequerida;
}

export function sePuedeReservar(bloque: BloqueDisponibilidad, duracionRequerida: number): boolean {
  return bloque.estado === "disponible" && cabeEnBloque(bloque, duracionRequerida);
}

/** El bloque que mejor se ajusta (el que deja menos tiempo libre). */
export function bloqueRecomendado(
  bloques: BloqueDisponibilidad[],
  duracionRequerida: number,
): BloqueDisponibilidad | undefined {
  return bloques
    .filter((b) => sePuedeReservar(b, duracionRequerida))
    .sort(
      (a, b) =>
        duracionBloque(a) - duracionBloque(b) ||
        a.hora_inicio.localeCompare(b.hora_inicio),
    )[0];
}

export function totalesDeServicios(servicios: Servicio[]) {
  return {
    duracion: servicios.reduce((s, x) => s + x.duracion_minutos, 0),
    precio: servicios.reduce((s, x) => s + x.precio, 0),
  };
}
