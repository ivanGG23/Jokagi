-- =====================================================================
--  AgendaEstética JOKAGI — RESET (uso manual)
--
--  ⚠️  BORRA TODAS LAS TABLAS Y TODOS LOS DATOS de la BD.
--  Solo ejecutarlo a propósito y AVISANDO al equipo antes.
--
--  Para reconstruir después:
--    1. Ejecutar este archivo
--    2. Ejecutar supabase/migrations/20261124000000_esquema_inicial.sql
--       (y las migraciones posteriores, en orden de fecha)
--    3. Ejecutar supabase/seed.sql
-- =====================================================================

DROP VIEW     IF EXISTS horarios_disponibles;
DROP TABLE    IF EXISTS cita_servicio  CASCADE;
DROP TABLE    IF EXISTS cita           CASCADE;
DROP TABLE    IF EXISTS disponibilidad CASCADE;
DROP TABLE    IF EXISTS servicio       CASCADE;
DROP TABLE    IF EXISTS estilista      CASCADE;
DROP TABLE    IF EXISTS usuario        CASCADE;
DROP TABLE    IF EXISTS rol            CASCADE;

DROP FUNCTION IF EXISTS agendar_cita(INT, INT, INT[]);
DROP FUNCTION IF EXISTS cancelar_cita(INT);
DROP FUNCTION IF EXISTS fn_validar_duracion_cita();
