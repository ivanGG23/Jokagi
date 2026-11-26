"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { EncabezadoSeccion } from "@/shared/ui/EncabezadoSeccion";
import { MESES, fechaATexto, fechaDesdeTexto } from "@/shared/utils/formato";

const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

type Props = {
  /** Fechas "AAAA-MM-DD" que tienen al menos un bloque disponible */
  fechasDisponibles: Set<string>;
  seleccionada: string | null;
  onSeleccionar: (fecha: string) => void;
  /** Mes que se muestra al inicio ("AAAA-MM-DD" de cualquier día de ese mes) */
  fechaInicial: string;
  deshabilitado?: boolean;
};

export function Calendario({ fechasDisponibles, seleccionada, onSeleccionar, fechaInicial, deshabilitado }: Props) {
  const inicial = fechaDesdeTexto(fechaInicial);
  const [mes, setMes] = useState({ anio: inicial.getFullYear(), mes: inicial.getMonth() });

  const cambiarMes = (delta: number) =>
    setMes(({ anio, mes }) => {
      const d = new Date(anio, mes + delta, 1);
      return { anio: d.getFullYear(), mes: d.getMonth() };
    });

  // Celdas: desde el lunes de la primera semana hasta completar la última semana
  const primero = new Date(mes.anio, mes.mes, 1);
  const desfase = (primero.getDay() + 6) % 7; // lunes = 0
  const diasDelMes = new Date(mes.anio, mes.mes + 1, 0).getDate();
  const totalCeldas = Math.ceil((desfase + diasDelMes) / 7) * 7;
  const celdas = Array.from({ length: totalCeldas }, (_, i) => new Date(mes.anio, mes.mes, 1 - desfase + i));

  return (
    <section>
      <EncabezadoSeccion
        etiqueta="Calendario"
        titulo="Fecha de tu cita"
        icono={<CalendarDays className="size-4" />}
        extra={
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-marino">
              {MESES[mes.mes]} {mes.anio}
            </span>
            <button
              type="button"
              onClick={() => cambiarMes(-1)}
              aria-label="Mes anterior"
              className="flex size-8 items-center justify-center rounded-full bg-crema text-marino hover:bg-piedra"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => cambiarMes(1)}
              aria-label="Mes siguiente"
              className="flex size-8 items-center justify-center rounded-full bg-crema text-marino hover:bg-piedra"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        }
      />

      <div className="rounded-2xl bg-superficie p-6 shadow-[0_1px_8px_rgba(16,44,73,0.06)]">
        {deshabilitado && (
          <p className="mb-4 rounded-lg bg-arena px-4 py-2 text-sm text-gris">
            Primero elige a tu profesional para ver sus días disponibles.
          </p>
        )}

        <div className="grid grid-cols-7 gap-2 text-center">
          {DIAS_SEMANA.map((d) => (
            <span key={d} className="pb-3 text-xs font-medium uppercase tracking-wide text-gris">
              {d}
            </span>
          ))}

          {celdas.map((dia) => {
            const texto = fechaATexto(dia);
            const delMes = dia.getMonth() === mes.mes;
            const disponible = !deshabilitado && delMes && fechasDisponibles.has(texto);
            const activo = texto === seleccionada;

            if (!disponible) {
              return (
                <span key={texto} className="flex h-12 items-center justify-center text-sm font-light text-gris-claro/50">
                  {dia.getDate()}
                </span>
              );
            }

            return (
              <button
                key={texto}
                type="button"
                onClick={() => onSeleccionar(texto)}
                aria-pressed={activo}
                className={`relative flex h-12 items-center justify-center rounded-lg text-[15px] font-semibold transition ${
                  activo
                    ? "bg-marino text-white ring-2 ring-primario/40 ring-offset-1"
                    : "bg-crema text-marino hover:bg-piedra"
                }`}
              >
                {dia.getDate()}
                {activo && <span className="absolute bottom-1.5 size-1 rounded-full bg-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
