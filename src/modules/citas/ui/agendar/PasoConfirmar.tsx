// PASO 3 — Revisar y confirmar.
// ⚠️ Provisional: no está en el Figma que tenemos. Ajustarlo cuando exista el diseño.
import { CalendarDays, ClipboardCheck, Clock, Scissors, UserRound } from "lucide-react";
import { EncabezadoSeccion } from "@/shared/ui/EncabezadoSeccion";
import { formatearDuracion, formatearFechaLarga } from "@/shared/utils/formato";
import type { BloqueDisponibilidad, Estilista, Servicio } from "../../types";

type Props = {
  estilista?: Estilista;
  bloque?: BloqueDisponibilidad;
  servicios: Servicio[];
  duracionTotal: number;
};

export function PasoConfirmar({ estilista, bloque, servicios, duracionTotal }: Props) {
  const filas = [
    { icono: UserRound, titulo: "Profesional", valor: estilista?.nombre },
    { icono: CalendarDays, titulo: "Fecha", valor: bloque && formatearFechaLarga(bloque.fecha) },
    { icono: Clock, titulo: "Horario", valor: bloque && `${bloque.hora_inicio} - ${bloque.hora_fin} hrs` },
    {
      icono: Scissors,
      titulo: "Servicios",
      valor: `${servicios.map((s) => s.nombre_servicio).join(", ")} · ${formatearDuracion(duracionTotal)}`,
    },
  ];

  return (
    <section>
      <EncabezadoSeccion
        etiqueta="Revisión"
        titulo="Revisa y confirma tu cita"
        icono={<ClipboardCheck className="size-4" />}
      />

      <dl className="divide-y divide-borde rounded-2xl bg-superficie px-6 shadow-[0_1px_8px_rgba(16,44,73,0.06)]">
        {filas.map(({ icono: Icono, titulo, valor }) => (
          <div key={titulo} className="flex items-start gap-4 py-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-crema text-primario">
              <Icono className="size-5" />
            </span>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-gris">{titulo}</dt>
              <dd className="mt-0.5 text-[17px] font-semibold text-marino">{valor}</dd>
            </div>
          </div>
        ))}
      </dl>

      <p className="mt-6 rounded-xl bg-arena px-4 py-3.5 text-sm text-tinta">
        Al confirmar, tu horario queda apartado de inmediato. Puedes cancelarlo después desde <strong>Mis citas</strong>.
      </p>
    </section>
  );
}
