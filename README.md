# AgendaEstética JOKAGI

Sistema web de agendamiento de citas para una estética. Base de datos
PostgreSQL alojada en Supabase; aplicación en Next.js (frontend y backend).

## Estructura

```
supabase/
├── migrations/   cambios a la BD, un archivo por cambio (AAAAMMDDHHMMSS_nombre.sql)
├── seed.sql      datos de prueba
└── reset.sql     borra TODO (uso manual, avisando al equipo)
src/
├── app/          rutas y páginas (frontend)
├── modules/      un módulo por funcionalidad: ui/ (frontend) + server/ (backend)
├── shared/       componentes, conexión a la BD y utilidades comunes
└── middleware.ts protege las rutas por rol
```

## Configuración

1. Copiar `.env.example` como `.env.local` y llenar `DATABASE_URL` y `SESSION_SECRET`.
2. Instalar dependencias: `npm install`
3. Levantar el proyecto: `npm run dev`

## Reglas de trabajo con la base de datos (BD compartida en Supabase)

1. **Todo cambio a la BD se escribe primero como archivo** en `supabase/migrations/`,
   se sube a Git y después se ejecuta en el SQL Editor de Supabase.
   Nunca modificar tablas con clics en el Table Editor: la BD y el repo se desfasan.
2. **Nunca se edita una migración ya ejecutada.** Si algo cambia, se crea una migración nueva
   con fecha posterior (por ejemplo `ALTER TABLE ...`).
3. **Avisar al equipo** cuando se ejecute una migración.
4. **`reset.sql` borra todos los datos.** Solo se corre a propósito y avisando.
5. Los secretos (`.env.local`) nunca se suben a Git.

## Despliegue inicial de la BD

1. SQL Editor de Supabase -> ejecutar `supabase/migrations/20261124000000_esquema_inicial.sql`
2. Ejecutar `supabase/seed.sql` (datos de prueba; contraseña de todos los usuarios: `Password123`)

## Equipo

Ramírez Trujillo Karolina Guadalupe · Girón Gómez Ivan · González Abarca Edy Jordan
Universidad Politécnica de Chiapas — Ingeniería en Tecnologías de la Información e Innovación Digital
