# Guía de Migración Controlada

Esta guía establece el protocolo para transferir los datos estáticos de Corpicia hacia Supabase, garantizando cero tiempo de inactividad (Zero Downtime).

## 1. Configuración de Entorno
1. Duplicar `.env.example` a `.env.local`.
2. Completar `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`. 
   *(Atención: `SUPABASE_SERVICE_ROLE_KEY` debe estar presente para la migración, pero **jamás** exponerse con el prefijo `NEXT_PUBLIC_`).*
3. Mantener `NEXT_PUBLIC_DATA_SOURCE=static` en `.env.local`.

## 2. Preparación de Base de Datos
Ejecutar el archivo `supabase/migrations/0001_initial_schema.sql` en el Dashboard de Supabase (SQL Editor) o mediante Supabase CLI.

## 3. Dry-Run (Simulación)
Ejecutar el validador en modo seco para inspeccionar los cambios que ocurrirán sin alterar la base de datos:
```bash
npx tsx scripts/seed.ts --dry-run
```
Revisar minuciosamente los conteos y resolver conflictos de `slugs` repetidos si los hubiera.

## 4. Ejecución del Seed (Confirmación)
Una vez simulado exitosamente, proceder con el volcado real:
```bash
npx tsx scripts/seed.ts --confirm
```

## 5. Validación Cruzada
Ejecutar el validador estricto para asegurar que la base de datos contiene los mismos datos que los archivos estáticos de forma íntegra:
```bash
npx tsx scripts/validate-migration.ts
```
Debe indicar **SUCCESS** sin discrepancias en productos (14) ni categorías (7) ni banners.

## 6. Switch a Dinámico
Cuando el CRUD (Sprint 2B) esté implementado y la validación cruzada haya sido exitosa, se cambiará `NEXT_PUBLIC_DATA_SOURCE=supabase` en producción, procediendo a regenerar la caché o redesplegar Vercel.
