import type { ReactNode } from "react";

type Props = {
  /** Texto pequeño azul en mayúsculas, por ejemplo "EQUIPO PROFESIONAL" */
  etiqueta: string;
  titulo: string;
  icono?: ReactNode;
  /** Texto gris a la derecha, por ejemplo "Disponibles para tu agenda" */
  extra?: ReactNode;
};

/** Encabezado de sección: etiqueta + título, con un texto opcional a la derecha */
export function EncabezadoSeccion({ etiqueta, titulo, icono, extra }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-primario">
          {icono}
          {etiqueta}
        </p>
        <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-marino">{titulo}</h2>
      </div>
      {extra && <div className="pb-1 text-sm text-gris">{extra}</div>}
    </div>
  );
}
