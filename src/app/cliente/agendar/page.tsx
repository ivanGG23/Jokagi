import type { Metadata } from "next";
import { AgendarWizard } from "@/modules/citas/ui/agendar/AgendarWizard";
// TODO backend: reemplazar los datos de prueba por las consultas reales
// (servicios, estilistas y la vista horarios_disponibles).
import { bloquesDePrueba, estilistasDePrueba, serviciosDePrueba } from "@/modules/citas/mock";

export const metadata: Metadata = {
  title: "Agendar cita — JOKAGI Beauty",
};

export default function AgendarPage() {
  return <AgendarWizard servicios={serviciosDePrueba} estilistas={estilistasDePrueba} bloques={bloquesDePrueba} />;
}
