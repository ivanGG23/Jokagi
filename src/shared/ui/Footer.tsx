export function Footer() {
  return (
    <footer className="mt-auto bg-crema">
      <div className="mx-auto flex max-w-[1296px] flex-col gap-6 px-6 py-10 sm:flex-row sm:items-end sm:justify-between lg:px-16">
        <div>
          <p className="text-lg font-semibold tracking-tight text-marino">JOKAGI</p>
          <p className="mt-1 text-sm text-gris">Colonia Roma Norte, Ciudad de México</p>
        </div>
        <div className="text-sm sm:text-right">
          <p className="text-[13px] font-semibold text-marino">Horarios de Atención</p>
          <p className="mt-1 text-gris">
            Lunes a Sábado: 9:00 - 20:00 hrs | Domingo: 10:00 - 18:00 hrs
          </p>
          <p className="mt-1 text-xs tracking-wide text-gris">
            © 2026 JOKAGI Studio. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
