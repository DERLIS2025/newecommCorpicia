# Modelo de Datos (Admin)

El modelo de datos de Corpicia en Supabase ha sido diseñado para ser escalable, transaccional y robusto. A continuación, se detallan sus componentes clave:

## Principios de Diseño
- **UUIDs**: Todas las claves primarias son autogeneradas mediante `gen_random_uuid()`.
- **Slugs**: Entidades navegables (Productos, Categorías, Proyectos) poseen `slug text unique not null`.
- **Dinero**: Los montos monetarios se almacenan como `bigint` (`price_amount`, `subtotal_amount`) y se procesarán en centavos o unidad mínima.
- **Relaciones**: Uso extensivo de llaves foráneas (`category_id`, `product_id`) con comportamientos claros de `ON DELETE CASCADE` (para variantes e imágenes) y `ON DELETE SET NULL` (para categorías en productos).

## Módulos

### 1. Catálogo
- `categories`: Clasificación principal.
- `products`: Catálogo central.
- `product_images`, `product_features`, `product_specifications`, `product_recommendations`, `product_price_tiers`: Tablas anexas para soportar arrays de datos relacionales sin usar tipos JSONB excesivos.

### 2. Contenido e Inicio
- `banners`: Gestión del Hero y banners secundarios.
- `home_sections`, `home_benefits`: Configuración de la estructura de la página de inicio.
- `services`, `projects`, `project_images`: Catálogo de paisajismo y servicios prestados.

### 3. Configuración y SEO
- `site_settings`: Tabla `key` - `value` (JSONB) para configuración global. Posee `is_public` para delimitar qué claves se envían al cliente.
- `calculator_settings`: Configuración exclusiva de la calculadora comercial.
- `social_links`, `legal_pages`, `seo_entries`: Metadata e hipervínculos estructurados.

### 4. Multimedia
- `media_assets`: Registro de archivos de almacenamiento para uso reutilizable en el panel.

### 5. CRM (Totalmente Privado)
- `clients`: Directorio de leads y compradores.
- `quotes` y `quote_items`: Sistema de presupuestos que guarda instantáneas inmutables de los precios y nombres de productos al momento de la cotización.
- `quote_status_history`: Auditoría del flujo del lead.

### 6. Sistema
- `admin_activity`: Logs de auditoría de las acciones tomadas dentro del panel.
