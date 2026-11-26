import { Check } from "lucide-react";
import type { PasoAgendar } from "../../types";

const pasos: { numero: PasoAgendar; titulo: string }[] = [
  { numero: 1, titulo: "Servicios" },
  { numero: 2, titulo: "Horario y Estilista" },
  { numero: 3, titulo: "Revisar y Confirmar" },
];

export function Stepper({ pasoActual }: { pasoActual: PasoAgendar }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-4 gap-y-3">
      {pasos.map(({ numero, titulo }, i) => {
        const completado = numero < pasoActual;
        const activo = numero === pasoActual;

        return (
          <li key={numero} className="flex items-center gap-4">
            <div className="flex items-center gap-3" aria-current={activo ? "step" : undefined}>
              <span
                className={`flex size-9 items-center justify-center rounded-full text-sm font-semibold ${
                  completado
                    ? "bg-primario text-white"
                    : activo
                      ? "bg-marino text-white"
                      : "bg-piedra text-gris"
                }`}
              >
                {completado ? <Check className="size-4" strokeWidth={3} /> : numero}
              </span>
              <span className="leading-tight">
                <span
                  className={`block text-[11px] font-semibold uppercase tracking-[0.06em] ${
                    numero <= pasoActual ? "text-primario" : "text-gris"
                  }`}
                >
                  Paso {numero}
                </span>
                <span className={`block text-[15px] font-semibold ${numero <= pasoActual ? "text-marino" : "text-gris"}`}>
                  {titulo}
                </span>
              </span>
            </div>

            {i < pasos.length - 1 && (
              <span
                aria-hidden
                className={`hidden h-0.5 w-32 sm:block ${completado ? "bg-primario" : "bg-borde"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
