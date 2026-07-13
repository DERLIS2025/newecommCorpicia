# Sprint 2A - Data Foundation

Este documento resume el objetivo y el entregable del Sprint 2A del Panel Administrativo de Corpicia.

## Objetivo
Establecer la infraestructura de base de datos, el modelo de datos, los repositorios y la validación para la migración de datos estáticos a Supabase, **sin realizar ninguna mutación sobre el entorno de producción actual.**

## Entregables
1. **Esquema SQL (`0001_initial_schema.sql`)**: Creado con UUIDs, tipos seguros (`bigint` para moneda), integridad referencial y RLS (Row Level Security). *No ejecutado.*
2. **Políticas de Seguridad**: Solo se permite la lectura pública de registros activos (`is_active = true` o `is_public = true`). Las tablas privadas no tienen ninguna política pública.
3. **Capa de Repositorios**: En `src/lib/repositories/`, se encapsuló la lógica de acceso a datos para Productos, Categorías, Banners y Configuración. 
4. **Fallback Seguro**: Los repositorios leen la variable `NEXT_PUBLIC_DATA_SOURCE`. Al estar en `static`, retornan inmediatamente los datos estáticos sin intentar contactar a Supabase.
5. **Scripts de Migración (`seed.ts` y `validate-migration.ts`)**: Creados con soporte explícito para dry-run y confirmación. *No ejecutados.*

## Estado Actual
- **Base de Datos**: No inicializada local ni remotamente.
- **Web Pública**: Continúa sirviendo archivos estáticos de forma ininterrumpida.
- **Autenticación**: Aún no implementada.
- **Cambios Visibles**: Ninguno.

Este sprint marca la finalización de la Fase 2 del plan arquitectónico. El próximo sprint (2B) activará el CRUD de Productos y Categorías.
