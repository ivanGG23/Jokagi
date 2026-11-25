-- =====================================================================
--  AgendaEstética JOKAGI — Datos de prueba
--
--  Ejecutar DESPUÉS de la migración inicial (SQL Editor de Supabase).
--  Ejecutarlo una sola vez: si se corre dos veces fallará por los
--  correos y servicios repetidos (es lo esperado, no duplica datos).
--
--  Contraseña de TODOS los usuarios de prueba:  Password123
--  (el hash de abajo es el bcrypt de esa contraseña)
-- =====================================================================

-- ---------------------------------------------------------------------
-- Usuarios (los roles ya existen: cliente, estilista, administrador)
-- ---------------------------------------------------------------------
INSERT INTO usuario (nombre, correo, telefono, password_hash, id_rol) VALUES
	('Administrador Jokagi', 'admin@jokagi.test',   '9611000001',
		'$2b$10$UeAzeivg8p7YfZhg.g6fBeiC1h1Zp4i9GwzGXFN5cH5Hw.NQ3hGfC',
		(SELECT id_rol FROM rol WHERE nombre_rol = 'administrador')),
	('Karolina Ramírez',     'karolina@jokagi.test', '9611000002',
		'$2b$10$UeAzeivg8p7YfZhg.g6fBeiC1h1Zp4i9GwzGXFN5cH5Hw.NQ3hGfC',
		(SELECT id_rol FROM rol WHERE nombre_rol = 'estilista')),
	('Ivan Girón',           'ivan@jokagi.test',     '9611000003',
		'$2b$10$UeAzeivg8p7YfZhg.g6fBeiC1h1Zp4i9GwzGXFN5cH5Hw.NQ3hGfC',
		(SELECT id_rol FROM rol WHERE nombre_rol = 'estilista')),
	('Edy González',         'edy@jokagi.test',      '9611000004',
		'$2b$10$UeAzeivg8p7YfZhg.g6fBeiC1h1Zp4i9GwzGXFN5cH5Hw.NQ3hGfC',
		(SELECT id_rol FROM rol WHERE nombre_rol = 'cliente')),
	('María López',          'maria@jokagi.test',    '9611000005',
		'$2b$10$UeAzeivg8p7YfZhg.g6fBeiC1h1Zp4i9GwzGXFN5cH5Hw.NQ3hGfC',
		(SELECT id_rol FROM rol WHERE nombre_rol = 'cliente'));

-- ---------------------------------------------------------------------
-- Estilistas (extienden a usuario)
-- ---------------------------------------------------------------------
INSERT INTO estilista (id_estilista, especialidad) VALUES
	((SELECT id_usuario FROM usuario WHERE correo = 'karolina@jokagi.test'), 'Corte y color'),
	((SELECT id_usuario FROM usuario WHERE correo = 'ivan@jokagi.test'),     'Manicure y pedicure');

-- ---------------------------------------------------------------------
-- Catálogo de servicios
-- ---------------------------------------------------------------------
INSERT INTO servicio (nombre_servicio, duracion_minutos, precio) VALUES
	('Corte de cabello',  45, 180.00),
	('Tinte completo',    90, 650.00),
	('Peinado',           40, 250.00),
	('Manicure',          45, 200.00),
	('Pedicure',          60, 280.00),
	('Tratamiento capilar', 30, 300.00);

-- ---------------------------------------------------------------------
-- Disponibilidad: bloques de los próximos días (fechas relativas a hoy,
-- así siempre quedan en el futuro y aparecen en la vista)
-- ---------------------------------------------------------------------
INSERT INTO disponibilidad (id_estilista, fecha, hora_inicio, hora_fin)
SELECT e.id_estilista, CURRENT_DATE + d.dias, b.inicio, b.fin
FROM estilista e
CROSS JOIN (VALUES (1), (2), (3), (4), (5)) AS d(dias)
CROSS JOIN (VALUES
	('10:00'::time, '11:30'::time),
	('12:00'::time, '14:00'::time),
	('16:00'::time, '17:00'::time)
) AS b(inicio, fin);

-- ---------------------------------------------------------------------
-- Una cita de ejemplo, creada con la función transaccional
-- (Edy agenda Corte + Peinado = 85 min, cabe en el bloque de 120 min)
-- ---------------------------------------------------------------------
SELECT agendar_cita(
	(SELECT id_usuario FROM usuario WHERE correo = 'edy@jokagi.test'),
	(SELECT d.id_disponibilidad
	   FROM disponibilidad d
	   JOIN estilista e ON e.id_estilista = d.id_estilista
	   JOIN usuario u   ON u.id_usuario   = e.id_estilista
	  WHERE u.correo = 'karolina@jokagi.test'
	    AND d.fecha = CURRENT_DATE + 1
	    AND d.hora_inicio = '12:00'),
	ARRAY[
		(SELECT id_servicio FROM servicio WHERE nombre_servicio = 'Corte de cabello'),
		(SELECT id_servicio FROM servicio WHERE nombre_servicio = 'Peinado')
	]
);
