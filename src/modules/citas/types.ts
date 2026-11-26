// Tipos del módulo de citas.
// Tienen la misma forma que las tablas de la BD, para que al conectar
// el backend solo se cambien los datos de prueba por las consultas reales.

/** Tabla servicio */
export type Servicio = {
  id_servicio: number;
  nombre_servicio: string;
  descripcion?: string;
  duracion_minutos: number;
  precio: number;
};

/** Tabla estilista + nombre de usuario */
export type Estilista = {
  id_estilista: number;
  nombre: string;
  especialidad: string;
  /** Ruta dentro de /public, por ejemplo "/estilistas/camila.jpg" (opcional) */
  foto?: string;
};

/** Tabla disponibilidad */
export type BloqueDisponibilidad = {
  id_disponibilidad: number;
  id_estilista: number;
  fecha: string;        // "AAAA-MM-DD"
  hora_inicio: string;  // "HH:MM"
  hora_fin: string;     // "HH:MM"
  estado: "disponible" | "reservado";
};

/** Lo que el cliente va eligiendo en el asistente de 3 pasos */
export type SeleccionCita = {
  servicios: number[];             // id_servicio[]
  idEstilista: number | null;
  fecha: string | null;            // "AAAA-MM-DD"
  idDisponibilidad: number | null;
};

export type PasoAgendar = 1 | 2 | 3;
