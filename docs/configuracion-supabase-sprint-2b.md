# Configuración Supabase (Sprint 2B)

## Estado de la Base de Datos
- **Categorías Sembradas**: 7
- **Productos Sembrados**: 14
- **Banners Sembrados**: 5
- Todo fue validado correctamente con el script de migración y seed local.

## Cliente de Servidor
Se implementó `src/lib/supabase/admin.ts` el cual requiere la variable `SUPABASE_SERVICE_ROLE_KEY` (de uso exclusivo en `.env.local`). Este cliente:
- Opera estrictamente del lado del servidor.
- Salta las validaciones RLS.
- No utiliza persistencia de sesión.

## Control de Escritura Activo
- Variable: `ADMIN_WRITES_ENABLED=false`
- Efecto: Todos los `Server Actions` que modifican datos en `categories` o `products` rechazan la operación silenciosamente retornando un objeto `ActionState` con `success: false` y un mensaje explícito para el usuario.
- Para probar el sistema completo de escritura sin romper producción, se debe cambiar este valor a `true` en el `.env.local` local.

## Storage (Multimedia)
- Aprobado por el usuario: No se implementará Supabase Storage durante el Sprint 2B.
- Solución adoptada: Las tablas `categories` y `product_images` aceptan URLs manuales en formato `string` puro. El UI previene subida de archivos y muestra placeholders.
