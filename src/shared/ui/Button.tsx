import type { ButtonHTMLAttributes } from "react";

type Variante = "primario" | "secundario";
type Tamano = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primario " +
  "disabled:cursor-not-allowed disabled:opacity-45";

const variantes: Record<Variante, string> = {
  primario: "bg-primario text-white shadow-sm hover:bg-primario-hover disabled:hover:bg-primario",
  secundario: "bg-superficie text-tinta shadow-[0_1px_6px_rgba(16,44,73,0.08)] hover:bg-crema",
};

const tamanos: Record<Tamano, string> = {
  md: "h-12 px-6 text-[15px]",
  sm: "h-10 px-5 text-sm",
};

/** Clases del botón, para usarlas también en <Link> */
export function estilosBoton(variante: Variante = "primario", tamano: Tamano = "md") {
  return `${base} ${variantes[variante]} ${tamanos[tamano]}`;
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante;
  tamano?: Tamano;
};

export function Button({ variante, tamano, className = "", type = "button", ...props }: Props) {
  return <button type={type} className={`${estilosBoton(variante, tamano)} ${className}`} {...props} />;
}
