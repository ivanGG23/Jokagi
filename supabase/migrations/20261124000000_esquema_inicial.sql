-- =====================================================================
--  AgendaEstética JOKAGI — Migración inicial (PostgreSQL / Supabase)
--  Basada en el Diagrama E-R y el Modelo Relacional de la propuesta.
--
--  Cómo aplicarla (una sola persona, una sola vez):
--    1. Supabase -> SQL Editor -> New query
--    2. Pegar TODO este archivo y ejecutar (Run)
--    3. Después, ejecutar supabase/seed.sql si se quieren datos de prueba
--
--  IMPORTANTE: este archivo NO se edita después de desplegarlo.
--  Cualquier cambio posterior va en una migración nueva, por ejemplo:
--    supabase/migrations/20261201000000_agregar_columna_x.sql
--  Para reiniciar la BD desde cero existe supabase/reset.sql (uso manual).
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. ROL
--    Un rol agrupa a muchos usuarios (1:N)
-- ---------------------------------------------------------------------
CREATE TABLE rol (
	id_rol      SERIAL       PRIMARY KEY,
	nombre_rol  VARCHAR(30)  NOT NULL UNIQUE
);


-- ---------------------------------------------------------------------
-- 2. USUARIO
--    Pertenece a un rol; puede extenderse a estilista; agenda muchas citas
-- ---------------------------------------------------------------------
CREATE TABLE usuario (
	id_usuario     SERIAL        PRIMARY KEY,
	nombre         VARCHAR(100)  NOT NULL,
	correo         VARCHAR(150)  NOT NULL UNIQUE,
	telefono       VARCHAR(20)   NOT NULL,
	password_hash  VARCHAR(255)  NOT NULL,
	id_rol         INT           NOT NULL REFERENCES rol(id_rol),

	CONSTRAINT chk_usuario_correo CHECK (correo ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);


-- ---------------------------------------------------------------------
-- 3. ESTILISTA
--    Extiende a un usuario (1:1); su PK también es FK hacia usuario
-- ---------------------------------------------------------------------
CREATE TABLE estilista (
	id_estilista  INT           PRIMARY KEY
		REFERENCES usuario(id_usuario) ON DELETE CASCADE,
	especialidad  VARCHAR(100)  NOT NULL
);


-- ---------------------------------------------------------------------
-- 4. SERVICIO
--    Catálogo (corte, color, manicure...). Relación N:M con cita
-- ---------------------------------------------------------------------
CREATE TABLE servicio (
	id_servicio       SERIAL         PRIMARY KEY,
	nombre_servicio   VARCHAR(100)   NOT NULL UNIQUE,
	duracion_minutos  INT            NOT NULL,
	precio            NUMERIC(10,2)  NOT NULL,

	CONSTRAINT chk_servicio_duracion CHECK (duracion_minutos > 0),
	CONSTRAINT chk_servicio_precio   CHECK (precio >= 0)
);


-- ---------------------------------------------------------------------
-- 5. DISPONIBILIDAD
--    Bloques de horario de un estilista; puede ser reservada por una cita
-- ---------------------------------------------------------------------
CREATE TABLE disponibilidad (
	id_disponibilidad  SERIAL       PRIMARY KEY,
	id_estilista       INT          NOT NULL
		REFERENCES estilista(id_estilista) ON DELETE CASCADE,
	fecha              DATE         NOT NULL,
	hora_inicio        TIME         NOT NULL,
	hora_fin           TIME         NOT NULL,
	estado             VARCHAR(20)  NOT NULL DEFAULT 'disponible',

	-- Evita bloques duplicados para el mismo estilista
	CONSTRAINT uq_disponibilidad_bloque UNIQUE (id_estilista, fecha, hora_inicio),
	CONSTRAINT chk_disponibilidad_estado CHECK (estado IN ('disponible', 'reservado')),
	CONSTRAINT chk_disponibilidad_horas  CHECK (hora_fin > hora_inicio)
);


-- ---------------------------------------------------------------------
-- 6. CITA
--    Reservada por un cliente; ocupa una disponibilidad; incluye servicios
-- ---------------------------------------------------------------------
CREATE TABLE cita (
	id_cita            SERIAL       PRIMARY KEY,
	id_usuario         INT          NOT NULL REFERENCES usuario(id_usuario),
	id_disponibilidad  INT          NOT NULL REFERENCES disponibilidad(id_disponibilidad),
	fecha_creacion     TIMESTAMP    NOT NULL DEFAULT NOW(),
	estado             VARCHAR(20)  NOT NULL DEFAULT 'pendiente',

	CONSTRAINT chk_cita_estado
		CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'completada'))
);

-- Un bloque solo puede tener UNA cita activa (las canceladas no cuentan,
-- así el bloque se puede volver a reservar después de una cancelación).
CREATE UNIQUE INDEX uq_cita_bloque_activo
	ON cita (id_disponibilidad)
	WHERE estado <> 'cancelada';


-- ---------------------------------------------------------------------
-- 7. CITA_SERVICIO
--    Tabla puente que resuelve la relación N:M entre cita y servicio
-- ---------------------------------------------------------------------
CREATE TABLE cita_servicio (
	id_cita      INT  NOT NULL REFERENCES cita(id_cita) ON DELETE CASCADE,
	id_servicio  INT  NOT NULL REFERENCES servicio(id_servicio),
	PRIMARY KEY (id_cita, id_servicio)
);


-- ---------------------------------------------------------------------
-- Índices para las consultas más comunes
-- ---------------------------------------------------------------------
CREATE INDEX idx_usuario_rol              ON usuario (id_rol);
CREATE INDEX idx_disponibilidad_fecha     ON disponibilidad (fecha, estado);
CREATE INDEX idx_cita_usuario             ON cita (id_usuario);
CREATE INDEX idx_cita_servicio_servicio   ON cita_servicio (id_servicio);


-- =====================================================================
--  VISTA: horarios_disponibles
--  Bloques libres con fecha futura, para el calendario de la landing page
-- =====================================================================
CREATE VIEW horarios_disponibles AS
SELECT d.id_disponibilidad,
       d.id_estilista,
       u.nombre        AS estilista,
       e.especialidad,
       d.fecha,
       d.hora_inicio,
       d.hora_fin,
       EXTRACT(EPOCH FROM (d.hora_fin - d.hora_inicio)) / 60 AS minutos_disponibles
FROM disponibilidad d
JOIN estilista e ON e.id_estilista = d.id_estilista
JOIN usuario   u ON u.id_usuario   = e.id_estilista
WHERE d.estado = 'disponible'
  AND (d.fecha > CURRENT_DATE
       OR (d.fecha = CURRENT_DATE AND d.hora_inicio > CURRENT_TIME));


-- =====================================================================
--  TRIGGER: validar que los servicios de una cita quepan en el bloque
--  (sección 9: "validar que la suma de las duraciones de los servicios
--   de una cita quepa dentro del bloque de disponibilidad seleccionado")
-- =====================================================================
CREATE OR REPLACE FUNCTION fn_validar_duracion_cita()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
	v_total_minutos  INT;
	v_minutos_bloque INT;
BEGIN
	SELECT COALESCE(SUM(s.duracion_minutos), 0)
	INTO v_total_minutos
	FROM cita_servicio cs
	JOIN servicio s ON s.id_servicio = cs.id_servicio
	WHERE cs.id_cita = NEW.id_cita;

	SELECT EXTRACT(EPOCH FROM (d.hora_fin - d.hora_inicio)) / 60
	INTO v_minutos_bloque
	FROM cita c
	JOIN disponibilidad d ON d.id_disponibilidad = c.id_disponibilidad
	WHERE c.id_cita = NEW.id_cita;

	IF v_total_minutos > v_minutos_bloque THEN
		RAISE EXCEPTION 'Los servicios suman % minutos y el bloque solo tiene % minutos',
			v_total_minutos, v_minutos_bloque;
	END IF;

	RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validar_duracion_cita
AFTER INSERT OR UPDATE ON cita_servicio
FOR EACH ROW
EXECUTE FUNCTION fn_validar_duracion_cita();


-- =====================================================================
--  TRANSACCIÓN: agendar una cita
--  Una función de PostgreSQL se ejecuta completa como una sola transacción:
--  si algo falla (RAISE EXCEPTION), se hace ROLLBACK de todo.
--
--  Uso:  SELECT agendar_cita(12, 5, ARRAY[3, 7]);
--        -> devuelve el id de la cita creada
-- =====================================================================
CREATE OR REPLACE FUNCTION agendar_cita(
	p_id_usuario         INT,
	p_id_disponibilidad  INT,
	p_servicios          INT[]
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
	v_estado   VARCHAR(20);
	v_fecha    DATE;
	v_inicio   TIME;
	v_id_cita  INT;
BEGIN
	IF p_servicios IS NULL OR array_length(p_servicios, 1) IS NULL THEN
		RAISE EXCEPTION 'La cita debe incluir al menos un servicio';
	END IF;

	-- 1. Bloquea el bloque de horario para que nadie más lo tome
	SELECT estado, fecha, hora_inicio
	INTO v_estado, v_fecha, v_inicio
	FROM disponibilidad
	WHERE id_disponibilidad = p_id_disponibilidad
	FOR UPDATE;

	IF NOT FOUND THEN
		RAISE EXCEPTION 'El bloque de horario % no existe', p_id_disponibilidad;
	END IF;

	IF v_estado <> 'disponible' THEN
		RAISE EXCEPTION 'El horario ya fue reservado por otro cliente';
	END IF;

	IF v_fecha + v_inicio <= NOW()::TIMESTAMP THEN
		RAISE EXCEPTION 'No se puede agendar en un horario que ya pasó';
	END IF;

	-- 2. Crea la cita
	INSERT INTO cita (id_usuario, id_disponibilidad, fecha_creacion, estado)
	VALUES (p_id_usuario, p_id_disponibilidad, NOW(), 'pendiente')
	RETURNING id_cita INTO v_id_cita;

	-- 3. Registra los servicios (el trigger valida que quepan en el bloque)
	INSERT INTO cita_servicio (id_cita, id_servicio)
	SELECT v_id_cita, s
	FROM unnest(p_servicios) AS s;

	-- 4. Marca el bloque como reservado
	UPDATE disponibilidad
	SET estado = 'reservado'
	WHERE id_disponibilidad = p_id_disponibilidad;

	RETURN v_id_cita;
END;
$$;


-- =====================================================================
--  TRANSACCIÓN: cancelar una cita
--  Cambia la cita a 'cancelada' y libera el bloque de horario.
--
--  Uso:  SELECT cancelar_cita(100);
-- =====================================================================
CREATE OR REPLACE FUNCTION cancelar_cita(p_id_cita INT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
	v_id_disponibilidad INT;
	v_estado            VARCHAR(20);
BEGIN
	SELECT id_disponibilidad, estado
	INTO v_id_disponibilidad, v_estado
	FROM cita
	WHERE id_cita = p_id_cita
	FOR UPDATE;

	IF NOT FOUND THEN
		RAISE EXCEPTION 'La cita % no existe', p_id_cita;
	END IF;

	IF v_estado IN ('cancelada', 'completada') THEN
		RAISE EXCEPTION 'La cita ya está %', v_estado;
	END IF;

	UPDATE cita
	SET estado = 'cancelada'
	WHERE id_cita = p_id_cita;

	UPDATE disponibilidad
	SET estado = 'disponible'
	WHERE id_disponibilidad = v_id_disponibilidad;
END;
$$;


-- =====================================================================
--  Datos base obligatorios: los tres roles del sistema
-- =====================================================================
INSERT INTO rol (nombre_rol) VALUES
	('cliente'),
	('estilista'),
	('administrador');
