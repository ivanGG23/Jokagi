"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CircleCheckBig } from "lucide-react";
import { Button, estilosBoton } from "@/shared/ui/Button";
import { formatearFechaLarga } from "@/shared/utils/formato";
import { sePuedeReservar, totalesDeServicios } from "../../reglas";
import type { BloqueDisponibilidad, Estilista, PasoAgendar, SeleccionCita, Servicio } from "../../types";
import { BloquesHorario } from "./BloquesHorario";
import { Calendario } from "./Calendario";
import { PasoConfirmar } from "./PasoConfirmar";
import { PasoServicios } from "./PasoServicios";
import { ResumenCita } from "./ResumenCita";
import { SelectorEstilista } from "./SelectorEstilista";
import { Stepper } from "./Stepper";

type Props = {
  servicios: Servicio[];
  estilistas: Estilista[];
  bloques: BloqueDisponibilidad[];
};

const seleccionVacia: SeleccionCita = { servicios: [], idEstilista: null, fecha: null, idDisponibilidad: null };

/**
 * Asistente de 3 pasos para agendar una cita.
 * Guarda lo que el cliente va eligiendo y decide qué paso mostrar.
 */
export function AgendarWizard({ servicios, estilistas, bloques }: Props) {
  const [paso, setPaso] = useState<PasoAgendar>(1);
  const [sel, setSel] = useState<SeleccionCita>(seleccionVacia);
  const [confirmada, setConfirmada] = useState(false);

  // ---- Datos derivados de la selección ----
  const serviciosElegidos = servicios.filter((s) => sel.servicios.includes(s.id_servicio));
  const { duracion, precio } = totalesDeServicios(serviciosElegidos);
  const estilista = estilistas.find((e) => e.id_estilista === sel.idEstilista);
  const bloque = bloques.find((b) => b.id_disponibilidad === sel.idDisponibilidad);

  const bloquesDelEstilista = useMemo(
    () => bloques.filter((b) => b.id_estilista === sel.idEstilista),
    [bloques, sel.idEstilista],
  );
  const fechasDisponibles = useMemo(
    () => new Set(bloquesDelEstilista.filter((b) => b.estado === "disponible").map((b) => b.fecha)),
    [bloquesDelEstilista],
  );
  const bloquesDelDia = bloquesDelEstilista.filter((b) => b.fecha === sel.fecha);

  // Mes con el que abre el calendario: la fecha elegida o el primer día con horarios
  const fechaInicialCalendario =
    sel.fecha ?? [...fechasDisponibles].sort()[0] ?? [...bloques].map((b) => b.fecha).sort()[0];

  // ---- Acciones ----
  const irAPaso = (nuevo: PasoAgendar) => {
    setPaso(nuevo);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const alternarServicio = (id: number) =>
    setSel((s) => {
      const lista = s.servicios.includes(id) ? s.servicios.filter((x) => x !== id) : [...s.servicios, id];
      // Si el horario elegido ya no alcanza para los servicios nuevos, se quita
      const nuevaDuracion = totalesDeServicios(servicios.filter((x) => lista.includes(x.id_servicio))).duracion;
      const bloqueActual = bloques.find((b) => b.id_disponibilidad === s.idDisponibilidad);
      const sigueSirviendo = bloqueActual && sePuedeReservar(bloqueActual, nuevaDuracion);
      return { ...s, servicios: lista, idDisponibilidad: sigueSirviendo ? s.idDisponibilidad : null };
    });

  const elegirEstilista = (id: number) =>
    setSel((s) => (s.idEstilista === id ? s : { ...s, idEstilista: id, fecha: null, idDisponibilidad: null }));

  const elegirFecha = (fecha: string) => setSel((s) => ({ ...s, fecha, idDisponibilidad: null }));

  const elegirBloque = (id: number) => setSel((s) => ({ ...s, idDisponibilidad: id }));

  const confirmarCita = () => {
    // TODO backend: llamar a agendarAction() de modules/citas/server/actions.ts
    //   que ejecuta  SELECT agendar_cita(id_usuario, idDisponibilidad, servicios)
    setConfirmada(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---- Reglas para avanzar ----
  const puedeAvanzar = {
    1: sel.servicios.length > 0,
    2: Boolean(bloque),
    3: Boolean(bloque) && sel.servicios.length > 0,
  }[paso];

  const resumen = {
    1: { texto: "Continuar", accion: () => irAPaso(2) },
    2: { texto: "Confirmar Selección", accion: () => irAPaso(3) },
    3: { texto: "Confirmar cita", accion: confirmarCita },
  }[paso];

  // ---- Pantalla de éxito ----
  if (confirmada && bloque && estilista) {
    return (
      <div className="mx-auto w-full max-w-xl px-6 py-20 text-center">
        <CircleCheckBig className="mx-auto size-14 text-primario" />
        <h1 className="mt-6 text-3xl font-semibold text-marino">¡Tu cita quedó agendada!</h1>
        <p className="mt-3 text-gris">
          {formatearFechaLarga(bloque.fecha)}, de {bloque.hora_inicio} a {bloque.hora_fin} hrs con {estilista.nombre}.
        </p>
        <Link href="/cliente/mis-citas" className={`${estilosBoton()} mt-8`}>
          Ver mis citas
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1296px] px-6 pt-9 pb-16 lg:px-16">
      <Stepper pasoActual={paso} />

      <div className="mt-14 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_368px]">
        <div className="space-y-14">
          {paso === 1 && (
            <PasoServicios servicios={servicios} seleccionados={sel.servicios} onAlternar={alternarServicio} />
          )}

          {paso === 2 && (
            <>
              <SelectorEstilista
                estilistas={estilistas}
                seleccionado={sel.idEstilista}
                onSeleccionar={elegirEstilista}
              />
              <Calendario
                key={sel.idEstilista ?? "sin-estilista"}
                fechasDisponibles={fechasDisponibles}
                seleccionada={sel.fecha}
                onSeleccionar={elegirFecha}
                fechaInicial={fechaInicialCalendario}
                deshabilitado={sel.idEstilista === null}
              />
              <BloquesHorario
                bloques={bloquesDelDia}
                fecha={sel.fecha}
                duracionRequerida={duracion}
                seleccionado={sel.idDisponibilidad}
                onSeleccionar={elegirBloque}
              />
            </>
          )}

          {paso === 3 && (
            <PasoConfirmar estilista={estilista} bloque={bloque} servicios={serviciosElegidos} duracionTotal={duracion} />
          )}

          {/* Navegación inferior */}
          <div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            {paso > 1 ? (
              <Button variante="secundario" onClick={() => irAPaso((paso - 1) as PasoAgendar)}>
                <ArrowLeft className="size-4" />
                Atrás: {paso === 2 ? "Servicios" : "Horario"}
              </Button>
            ) : (
              <span />
            )}
            {paso < 3 && (
              <Button onClick={() => irAPaso((paso + 1) as PasoAgendar)} disabled={!puedeAvanzar} className="px-9">
                <span>
                  Continuar
                  <span className="hidden sm:inline">: {paso === 1 ? "Horario y Estilista" : "Revisar y Confirmar"}</span>
                </span>
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>

        <ResumenCita
          estilista={estilista}
          bloque={bloque}
          servicios={serviciosElegidos}
          duracionTotal={duracion}
          precioTotal={precio}
          textoBoton={resumen.texto}
          onConfirmar={resumen.accion}
          botonDeshabilitado={!puedeAvanzar}
        />
      </div>
    </div>
  );
}
