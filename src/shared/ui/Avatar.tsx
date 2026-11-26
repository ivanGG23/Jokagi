import Image from "next/image";

type Props = {
  nombre: string;
  /** Ruta dentro de /public. Si no hay foto se muestran las iniciales. */
  foto?: string;
  tamano?: number;
};

export function Avatar({ nombre, foto, tamano = 64 }: Props) {
  if (foto) {
    return (
      <Image
        src={foto}
        alt={nombre}
        width={tamano}
        height={tamano}
        className="shrink-0 rounded-full object-cover"
      />
    );
  }

  const iniciales = nombre
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div
      aria-hidden
      style={{ width: tamano, height: tamano, fontSize: tamano * 0.34 }}
      className="flex shrink-0 items-center justify-center rounded-full bg-piedra font-semibold text-marino"
    >
      {iniciales}
    </div>
  );
}
