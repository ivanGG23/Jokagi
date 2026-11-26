import { UserRoundCheck } from "lucide-react";
import { Avatar } from "@/shared/ui/Avatar";
import { EncabezadoSeccion } from "@/shared/ui/EncabezadoSeccion";
import type { Estilista } from "../../types";

type Props = {
  estilistas: Estilista[];
  seleccionado: number | null;
  onSeleccionar: (idEstilista: number) => void;
};

export function SelectorEstilista({ estilistas, seleccionado, onSeleccionar }: Props) {
  return (
    <section>
      <EncabezadoSeccion
        etiqueta="Equipo profesional"
        titulo="Selecciona a tu profesional"
        icono={<UserRoundCheck className="size-4" />}
        extra="Disponibles para tu agenda"
      />

      <div className="grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Profesional">
        {estilistas.map((e) => {
          const activo = e.id_estilista === seleccionado;
          return (
            <button
              key={e.id_estilista}
              type="button"
              role="radio"
              aria-checked={activo}
              onClick={() => onSeleccionar(e.id_estilista)}
              className={`flex items-center gap-5 rounded-2xl p-4 text-left transition ${
                activo
                  ? "bg-seleccion shadow-[0_6px_16px_-6px_rgba(16,44,73,0.25)]"
                  : "bg-superficie shadow-[0_1px_8px_rgba(16,44,73,0.06)] hover:bg-seleccion/60"
              }`}
            >
              <Avatar nombre={e.nombre} foto={e.foto} tamano={64} />
              <span>
                <span className="block text-[17px] font-semibold text-marino">{e.nombre}</span>
                <span className="block text-sm text-gris">{e.especialidad}</span>
                <span
                  className={`mt-1 block text-xs font-semibold tracking-wide ${
                    activo ? "text-primario" : "text-gris-claro"
                  }`}
                >
                  {activo ? "Seleccionado" : "Disponible"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
