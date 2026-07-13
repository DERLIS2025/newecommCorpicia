# Sprint 2B: Productos y Categorías (Implementación)

## Objetivo General
Proveer una interfaz administrativa completamente funcional para la gestión CRUD de Productos y Categorías, sin afectar la aplicación pública (que permanece estática mediante `NEXT_PUBLIC_DATA_SOURCE=static`).

## Arquitectura Implementada

### 1. Cliente Supabase Administrativo
Se configuró `src/lib/supabase/admin.ts` con uso exclusivo de `SUPABASE_SERVICE_ROLE_KEY` y directiva `'server-only'`. Esto asegura que el panel de administración pueda eludir RLS y leer todos los datos reales mientras la app cliente no expone credenciales.

### 2. Bloqueo de Escrituras
Todas las *Server Actions* ejecutan `assertAdminWritesEnabled()`, asegurando que `process.env.ADMIN_WRITES_ENABLED === 'true'`. Si el valor es `false`, se rechaza cualquier `insert`, `update` o `delete`.

### 3. Server Actions
Ubicadas en `src/lib/actions/admin-products.ts` y `src/lib/actions/admin-categories.ts`:
- **Categorías**: CRUD estricto. La eliminación está protegida si existen productos asociados a la categoría.
- **Productos**: CRUD complejo. Las acciones de crear y editar sincronizan (vía eliminación e inserción) todas las relaciones complejas:
  - `product_price_tiers`
  - `product_images`
  - `product_features`
  - `product_specifications`
  - `product_recommendations`
- **Duplicación**: Se implementó una lógica profunda para duplicar un producto junto con todas sus relaciones, creando un nuevo UUID y un nuevo slug con sufijo temporal.

### 4. Interfaz de Usuario (UI)
- **Componentes de Servidor**: `/admin/productos` y `/admin/categorias` delegan la obtención de datos a repositorios administrativos.
- **Client Components**: Se crearon `ProductsTable`, `CategoriesTable` y `ProductForm` utilizando React y Tailwind CSS nativo (sin librerías externas de formularios). Manejan estado local para los sub-campos (características, especificaciones, etc.).
- **Imágenes**: Por definición del Sprint, las imágenes se gestionan vía URLs manuales temporales, postergando la implementación de un Bucket en Supabase Storage.

## Resumen del Progreso
Las pantallas están conectadas a Supabase y listas para producción administrativa una vez se habilite la bandera de escrituras.
