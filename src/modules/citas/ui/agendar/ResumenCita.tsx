import { BadgeCheck, CalendarDays, CircleCheck, ClipboardList, MapPin, ShieldCheck, Timer } from "lucide-react";
import { Avatar } from "@/shared/ui/Avatar";
import { Button } from "@/shared/ui/Button";
import { formatearDuracion, formatearFechaLarga, formatearPrecio } from "@/shared/utils/formato";
import type { BloqueDisponibilidad, Estilista, Servicio } from "../../types";

type Props = {
  estilista?: Estilista;
  bloque?: BloqueDisponibilidad;
  servicios: Servicio[];
  duracionTotal: number;
  precioTotal: number;
  textoBoton: string;
  onConfirmar: () => void;
  botonDeshabilitado?: boolean;
};

/** Panel derecho "Resumen de Cita". Se muestra en los 3 pasos. */
export function ResumenCita({
  estilista,
  bloque,
  servicios,
  duracionTotal,
  precioTotal,
  textoBoton,
  onConfirmar,
  botonDeshabilitado,
}: Props) {
  return (
    <aside className="rounded-3xl bg-superficie p-7 shadow-[0_12px_32px_-14px_rgba(16,44,73,0.25)] lg:sticky lg:top-6 lg:p-9">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-primario">Mi reserva</p>
          <h2 className="mt-1 text-xl font-semibold text-marino">Resumen de Cita</h2>
        </div>
        <span className="flex size-8 items-center justify-center rounded-full bg-crema text-marino">
          <ClipboardList className="size-4" />
        </span>
      </div>

      {/* Estilista */}
      <div className="mt-8 flex items-center gap-4 rounded-xl bg-arena p-2.5">
        {estilista ? (
          <>
            <Avatar nombre={estilista.nombre} foto={estilista.foto} tamano={48} />
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-gris">Estilista asignado</p>
              <p className="font-semibold text-marino">{estilista.nombre}</p>
              <p className="flex items-start gap-1 text-sm leading-snug text-primario">
                <BadgeCheck className="mt-0.5 size-4 shrink-0" />
                <span>{estilista.especialidad}</span>
              </p>
            </div>
          </>
        ) : (
          <p className="px-2 py-3 text-sm text-gris">Aún no eliges profesional</p>
        )}
      </div>

      {/* Fecha y horario */}
      <div className="mt-6 rounded-xl bg-arena px-4 py-4">
        {bloque ? (
          <>
            <p className="flex items-center gap-1.5 text-[15px] font-semibold text-marino">
              <CalendarDays className="size-4 text-primario" />
              {formatearFechaLarga(bloque.fecha)}
            </p>
            <p className="mt-1.5 pl-6 text-[15px] font-medium text-marino">
              {bloque.hora_inicio} - {bloque.hora_fin} hrs
            </p>
          </>
        ) : (
          <p className="flex items-center gap-1.5 text-sm text-gris">
            <CalendarDays className="size-4" />
            Aún no eliges fecha y horario
          </p>
        )}
      </div>

      {/* Servicios */}
      <div className="mt-7 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.06em] text-gris">
          Servicios seleccionados ({servicios.length})
        </p>
        <p className="text-xs font-semibold text-primario">Duración</p>
      </div>
      <ul className="mt-3 space-y-3">
        {servicios.map((s) => (
          <li key={s.id_servicio} className="rounded-lg bg-crema/60 px-2 py-2">
            <div className="flex items-start justify-between gap-4">
              <p className="text-[15px] text-marino">{s.nombre_servicio}</p>
              <p className="shrink-0 text-[17px] font-semibold text-marino">{formatearPrecio(s.precio)}</p>
            </div>
            <p className="mt-1 flex items-center gap-1 text-sm text-gris">
              <Timer className="size-3.5" />
              {s.duracion_minutos} min{s.duracion_minutos >= 60 && ` (${formatearDuracion(s.duracion_minutos)})`}
            </p>
          </li>
        ))}
        {servicios.length === 0 && <li className="text-sm text-gris">Aún no eliges servicios</li>}
      </ul>

      {/* Totales */}
      <div className="mt-6 rounded-xl bg-arena p-4">
        <div className="flex justify-between gap-4">
          <p className="text-[15px] text-gris">Duración total estimada</p>
          <p className="text-right text-[15px] font-semibold text-marino">
            {duracionTotal > 0 ? `${duracionTotal} min (${formatearDuracion(duracionTotal)})` : "—"}
          </p>
        </div>
        <div className="mt-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-gris">Total en salón</p>
            <p className="text-xl font-bold text-marino">{formatearPrecio(precioTotal)}</p>
          </div>
          <span className="mb-1 rounded bg-superficie px-2 py-0.5 text-xs font-semibold text-primario">
            Pago presencial
          </span>
        </div>
      </div>

      <p className="mt-6 flex gap-1.5 text-[13px] leading-snug text-gris">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primario" />
        Informativo, sin cobro en línea. Pagas al finalizar tu servicio en recepción con tarjeta o efectivo.
      </p>
      <p className="mt-5 flex items-center gap-1.5 text-sm text-gris">
        <MapPin className="size-4 shrink-0 text-primario" />
        JOKAGI Studio • Roma Norte, CDMX
      </p>

      <Button className="mt-6 w-full" onClick={onConfirmar} disabled={botonDeshabilitado}>
        {textoBoton}
        <CircleCheck className="size-4" />
      </Button>
    </aside>
  );
}
