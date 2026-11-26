import { NavbarCliente } from "./_components/NavbarCliente";

/** Estructura de las páginas del cliente: menú arriba */
export default function ClienteLayout({ children }: LayoutProps<"/cliente">) {
  return (
    <>
      <NavbarCliente />
      <main className="flex-1">{children}</main>
    </>
  );
}
