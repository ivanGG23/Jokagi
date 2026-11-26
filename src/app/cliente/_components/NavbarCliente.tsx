import Link from "next/link";
import { User } from "lucide-react";
import { NavLinksCliente } from "./NavLinksCliente";

/** Menú superior de las vistas del cliente (el usuario ya inició sesión) */
export function NavbarCliente() {
  return (
    <header className="bg-fondo shadow-[0_6px_18px_-12px_rgba(16,44,73,0.18)]">
      <div className="mx-auto flex h-[94px] max-w-[1296px] items-center justify-between gap-6 px-6 lg:px-16">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-bold tracking-tight text-marino">JOKAGI</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primario">
            Beauty
          </span>
        </Link>

        <NavLinksCliente />

        <Link
          href="/cliente/mis-citas"
          aria-label="Mi cuenta"
          className="flex size-8 items-center justify-center rounded-full bg-marino text-white"
        >
          <User className="size-4" />
        </Link>
      </div>
    </header>
  );
}
