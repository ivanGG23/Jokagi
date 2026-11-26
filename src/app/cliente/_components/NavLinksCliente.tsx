"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const enlaces = [
  { href: "/", texto: "Inicio" },
  { href: "/#servicios", texto: "Servicios" },
  { href: "/cliente/agendar", texto: "Agendar cita" },
  { href: "/cliente/mis-citas", texto: "Mis citas" },
];

/** Links del menú del cliente. Es client component porque necesita saber la ruta actual. */
export function NavLinksCliente() {
  const ruta = usePathname();

  return (
    <nav className="hidden items-center gap-2 md:flex">
      {enlaces.map(({ href, texto }) => {
        const activo = href === ruta;
        return (
          <Link
            key={href}
            href={href}
            aria-current={activo ? "page" : undefined}
            className={
              activo
                ? "rounded-full bg-piedra px-4 py-2 text-[17px] font-semibold text-marino"
                : "px-2 py-2 text-[15px] text-gris transition-colors hover:text-marino"
            }
          >
            {texto}
          </Link>
        );
      })}
    </nav>
  );
}
