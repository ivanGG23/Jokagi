import { Ban, Clock, Info } from "lucide-react";
import { EncabezadoSeccion } from "@/shared/ui/EncabezadoSeccion";
import { formatearDuracion, formatearFechaCorta } from "@/shared/utils/formato";
import { bloqueRecomendado, cabeEnBloque, duracionBloque } from "../../reglas";
import type { BloqueDisponibilidad } from "../../types";

type Props = {
  bloques: BloqueDisponibilidad[];      // bloques del estilista en la fecha elegida
  fecha: string | null;
  duracionRequerida: number;            // minutos
  seleccionado: number | null;          // id_disponibilidad
  onSeleccionar: (idDisponibilidad: number) => void;
};

export function BloquesHorario({ bloques, fecha, duracionRequerida, seleccionado, onSeleccionar }: Props) {
  const recomendado = bloqueRecomendado(bloques, duracionRequerida);
  const ordenados = [...bloques].sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

  return (
    <section>
      <EncabezadoSeccion
        etiqueta={`Duración requerida: ${duracionRequerida} min (${formatearDuracion(duracionRequerida)})`}
        titulo="Bloques de horario continuo"
        icono={<Clock className="size-4" />}
        extra={fecha ? formatearFechaCorta(fecha) : undefined}
      />

      {!fecha ? (
        <p className="rounded-2xl bg-superficie p-6 text-sm text-gris shadow-[0_1px_8px_rgba(16,44,73,0.06)]">
          Elige una fecha en el calendario para ver los horarios disponibles.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Horario">
          {ordenados.map((b) => {
            const rango = `${b.hora_inicio} - ${b.hora_fin} hrs`;
            const continuas = `${formatearDuracion(duracionBloque(b))} continuas`;

            // Bloque que NO se puede elegir
            if (b.estado === "reservado" || !cabeEnBloque(b, duracionRequerida)) {
              const motivo = b.estado === "reservado" ? "Reservado por otro cliente" : "Espacio insuficiente para duración";
              return (
                <div
                  key={b.id_disponibilidad}
                  aria-disabled
                  className="flex items-center gap-4 rounded-2xl bg-crema/60 px-5 py-4"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full text-gris-claro/70">
                    <Ban className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[17px] text-gris-claro line-through">{rango}</span>
                    <span className="block text-sm text-error/80">{motivo}</span>
                  </span>
                  <span className="rounded-md bg-piedra px-2.5 py-1 text-xs font-semibold text-gris">Ocupado</span>
                </div>
              );
            }

            const activo = b.id_disponibilidad === seleccionado;
            const esRecomendado = b.id_disponibilidad === recomendado?.id_disponibilidad;

            return (
              <button
                key={b.id_disponibilidad}
                type="button"
                role="radio"
                aria-checked={activo}
                onClick={() => onSeleccionar(b.id_disponibilidad)}
                className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition ${
                  activo
                    ? "bg-primario text-white shadow-[0_8px_18px_-8px_rgba(19,99,150,0.7)]"
                    : "bg-superficie shadow-[0_1px_8px_rgba(16,44,73,0.06)] hover:bg-seleccion"
                }`}
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                    activo ? "bg-white/15" : "bg-crema"
                  }`}
                >
                  <span
                    className={`flex size-4.5 items-center justify-center rounded-full border-2 ${
                      activo ? "border-white" : "border-gris/60"
                    }`}
                  >
                    {activo && <span className="size-2 rounded-full bg-white" />}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-[17px] font-semibold ${activo ? "text-white" : "text-marino"}`}>
                    {rango}
                  </span>
                  <span
                    className={`block text-xs font-semibold tracking-wide ${activo ? "text-white/85" : "text-gris"}`}
                  >
                    {continuas}
                    {esRecomendado && " • Recomendado"}
                  </span>
                </span>
                {activo ? (
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">Seleccionado</span>
                ) : (
                  <span className="text-sm font-semibold text-primario">Disponible</span>
                )}
              </button>
            );
          })}

          {ordenados.length === 0 && (
            <p className="text-sm text-gris">No hay horarios para este día.</p>
          )}
        </div>
      )}

      <div className="mt-6 flex gap-3 rounded-xl bg-arena px-4 py-3.5 text-sm text-tinta">
        <Info className="mt-0.5 size-5 shrink-0 text-primario" />
        <p>
          <strong className="font-semibold">Aviso de concurrencia:</strong> Si otro cliente reserva este bloque antes de
          confirmar, te mostraremos las siguientes opciones disponibles de inmediato sin perder tus selecciones.
        </p>
      </div>
    </section>
  );
}
