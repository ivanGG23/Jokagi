// PASO 1 — Elegir servicios.
// ⚠️ Provisional: no está en el Figma que tenemos. Usa el mismo estilo
// que el Paso 2; ajustarlo cuando exista el diseño.
import { Check, Scissors, Timer } from "lucide-react";
import { EncabezadoSeccion } from "@/shared/ui/EncabezadoSeccion";
import { formatearDuracion, formatearPrecio } from "@/shared/utils/formato";
import type { Servicio } from "../../types";

type Props = {
  servicios: Servicio[];
  seleccionados: number[];
  onAlternar: (idServicio: number) => void;
};

export function PasoServicios({ servicios, seleccionados, onAlternar }: Props) {
  return (
    <section>
      <EncabezadoSeccion
        etiqueta="Catálogo"
        titulo="Elige tus servicios"
        icono={<Scissors className="size-4" />}
        extra="Puedes elegir varios"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {servicios.map((s) => {
          const activo = seleccionados.includes(s.id_servicio);
          return (
            <button
              key={s.id_servicio}
              type="button"
              role="checkbox"
              aria-checked={activo}
              onClick={() => onAlternar(s.id_servicio)}
              className={`flex gap-4 rounded-2xl p-5 text-left transition ${
                activo
                  ? "bg-seleccion shadow-[0_6px_16px_-6px_rgba(16,44,73,0.25)] ring-2 ring-primario"
                  : "bg-superficie shadow-[0_1px_8px_rgba(16,44,73,0.06)] hover:bg-seleccion/60"
              }`}
            >
              <span
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 ${
                  activo ? "border-primario bg-primario text-white" : "border-gris/50"
                }`}
              >
                {activo && <Check className="size-3.5" strokeWidth={3} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-3">
                  <span className="text-[17px] font-semibold text-marino">{s.nombre_servicio}</span>
                  <span className="shrink-0 font-semibold text-marino">{formatearPrecio(s.precio)}</span>
                </span>
                {s.descripcion && <span className="mt-1 block text-sm text-gris">{s.descripcion}</span>}
                <span className="mt-2 flex items-center gap-1 text-sm text-gris">
                  <Timer className="size-3.5" />
                  {formatearDuracion(s.duracion_minutos)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
