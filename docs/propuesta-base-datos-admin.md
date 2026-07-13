# Propuesta de base de datos para administración Corpicia

> No ejecutar SQL todavía. Esta es una propuesta documental.

## Tablas actuales confirmadas por código
No hay esquemas SQL confirmados en el repositorio. Solo existen referencias a `products` y `categories` en `src/lib/supabase.ts`.

| Tabla | Estado | Uso | Campos confirmados por consulta | Campos inferidos por tipos | Riesgo |
|---|---|---|---|---|---|
| `products` | Referenciada sin esquema | lectura activos/destacados/slug | `is_active`, `is_featured`, `created_at`, `slug` | Product TS usa camelCase | alto |
| `categories` | Referenciada sin esquema | lectura activos/orden | `is_active`, `sort_order` | Category TS usa camelCase | alto |

## Tablas faltantes necesarias
Productos, categorías, variantes, precios, unidades, imágenes, banners, secciones home, servicios, proyectos, galerías, testimonios, FAQ, quote requests, leads, contacto, settings, WhatsApp, redes, SEO, admin profiles, roles, permisos y logs.

## Propuesta de tablas nuevas
### `products`
Columnas: `id uuid pk`, `name text`, `slug text unique`, `description text`, `short_description text`, `unit_id uuid`, `base_price numeric`, `min_quantity numeric`, `category_id uuid`, `is_active boolean`, `is_featured boolean`, `status text`, `sort_order int`, `seo_title text`, `seo_description text`, `created_at timestamptz`, `updated_at timestamptz`, `created_by uuid`, `updated_by uuid`.

### `product_price_tiers`
`id`, `product_id`, `min_quantity`, `max_quantity`, `price`, `label`, `is_promo`, `sort_order`, timestamps, authors.

### `categories`
`id`, `name`, `slug`, `description`, `image_asset_id`, `sort_order`, `is_active`, `seo_title`, `seo_description`, timestamps, authors.

### `media_assets`
`id`, `bucket`, `path`, `public_url`, `alt`, `mime_type`, `size_bytes`, `width`, `height`, `usage_context`, timestamps, authors.

### `home_sections`
`id`, `section_key`, `title`, `description`, `is_active`, `sort_order`, `settings jsonb`, `status`, timestamps, authors.

### `banners`
`id`, `placement`, `title`, `subtitle`, `desktop_asset_id`, `mobile_asset_id`, `alt`, `cta_label`, `cta_url`, `is_active`, `sort_order`, `status`, publish dates, timestamps, authors.

### `benefits`
`id`, `title`, `description`, `icon_key`, `is_active`, `sort_order`, timestamps, authors.

### `section_product_items`
`id`, `section_key`, `product_id`, `sort_order`, `is_active`.

### `site_settings`
`key text pk`, `value jsonb`, `updated_at`, `updated_by` para WhatsApp, contacto, redes, analytics y configuración general.

### `footer_links` / `navigation_items`
Links ordenables con `label`, `href`, `group_key`, `is_active`, `sort_order`.

### `quote_requests`
`id`, `customer_name`, `phone`, `email`, `message`, `items jsonb`, `total_estimated`, `source`, `status`, timestamps.

### `contact_messages`, `newsletter_subscriptions`, `leads`
Captura de formularios y suscripciones con estado, fuente y consentimiento.

### `pages` y `page_blocks`
Páginas informativas con bloques versionables, slug, SEO y estado.

### `admin_profiles`, `roles`, `permissions`, `role_permissions`, `activity_logs`
Control de acceso y auditoría.

## Índices recomendados
- `products(slug) unique`, `products(status, is_active)`, `products(category_id)`.
- `categories(slug) unique`.
- `banners(placement, status, is_active, sort_order)`.
- `home_sections(section_key) unique`.
- `quote_requests(status, created_at desc)`.
- `activity_logs(created_at desc, actor_id)`.

## Estados
Usar `draft`, `published`, `archived` en contenido administrable. Para solicitudes: `new`, `contacted`, `quoted`, `won`, `lost`, `spam`.

## Buckets Storage
| Bucket | Uso | Público | Validaciones |
|---|---|---|---|
| `product-images` | productos | sí | jpg/webp/png, max 3MB, 1:1 recomendado |
| `site-images` | banners/footer/home | sí | max 5MB, proporciones por sección |
| `project-images` | proyectos | sí | max 5MB |
| `seo-images` | OG | sí | 1200x630 |
| `private-exports` | reportes internos | no | CSV/PDF controlado |

## RLS propuesta
- Lectura pública solo `status='published'` e `is_active=true`.
- Inserts/updates/deletes solo usuarios autenticados con perfil admin y permiso específico.
- `quote_requests` y `contact_messages`: insert público limitado mediante route handler con rate limit; lectura solo admin.
- Storage: subida solo admin; lectura pública en buckets públicos; eliminar solo admin/owner.
- `activity_logs`: insert servidor; lectura owner/admin.
