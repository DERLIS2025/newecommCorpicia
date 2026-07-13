# Arquitectura propuesta del panel administrativo

## Principio rector
El panel debe controlar contenido sin rediseñar la web pública. Cada sección existente tendrá un formulario específico que respete layout, proporciones, cantidad de elementos, responsive y textos máximos.

## Navegación propuesta
- `/admin/login`
- `/admin`
- `/admin/inicio`
- `/admin/inicio/banners`
- `/admin/inicio/beneficios`
- `/admin/productos`
- `/admin/categorias`
- `/admin/precios-medidas`
- `/admin/presupuestos`
- `/admin/leads`
- `/admin/servicios`
- `/admin/proyectos`
- `/admin/galerias`
- `/admin/testimonios`
- `/admin/faq`
- `/admin/paginas`
- `/admin/navegacion`
- `/admin/footer`
- `/admin/contacto-whatsapp`
- `/admin/seo`
- `/admin/archivos`
- `/admin/usuarios`
- `/admin/roles`
- `/admin/auditoria`
- `/admin/configuracion`

## Roles y permisos
| Rol | Permisos |
|---|---|
| `owner` | todo, usuarios, roles, RLS, publicar |
| `admin` | CRUD contenido/productos, publicar |
| `editor` | crear/editar borradores y solicitar publicación |
| `viewer` | lectura y previsualización |

## Módulos
| Módulo | Objetivo | Ruta | CRUD | Tabla | Bucket | Web pública | Prioridad | Complejidad |
|---|---|---|---|---|---|---|---|---|
| Dashboard | métricas de productos, leads, cambios | `/admin` | R | vistas agregadas | - | administración | P1 | M |
| Inicio | controlar orden y estado de secciones | `/admin/inicio` | R/U | `home_sections` | - | `/` | P0 | M |
| Hero y banners | administrar imágenes hero y laterales | `/admin/inicio/banners` | CRUD/publicar/ordenar | `banners` | `site-images` | home | P0 | M |
| Beneficios | editar 4 tarjetas | `/admin/inicio/beneficios` | CRUD limitado | `benefits` | - | home | P1 | S |
| Productos | catálogo real | `/admin/productos` | CRUD/publicar/imagen/orden | `products` | `product-images` | catálogo/home/presupuesto/feed/sitemap | P0 | L |
| Categorías | filtros y navegación | `/admin/categorias` | CRUD/orden | `categories` | `category-images` | catálogo | P0 | M |
| Precios y medidas | tiers y unidades | `/admin/precios-medidas` | CRUD | `product_price_tiers`, `units` | - | tarjetas/presupuesto | P0 | M |
| Presupuestos | solicitudes enviadas | `/admin/presupuestos` | R/U estado | `quote_requests` | - | presupuesto/contacto | P1 | M |
| Leads | newsletter/contacto | `/admin/leads` | R/U/export | `leads`, `contact_messages`, `newsletter_subscriptions` | - | formularios | P1 | M |
| Servicios | página servicios y servicios como producto | `/admin/servicios` | CRUD/publicar | `services` | `service-images` | `/servicios` | P2 | M |
| Proyectos/Galerías | trabajos realizados | `/admin/proyectos` | CRUD/orden/imagen | `projects`, `project_images` | `project-images` | `/nosotros`/futuro galería | P2 | M |
| Testimonios | reseñas | `/admin/testimonios` | CRUD/publicar | `testimonials` | `avatars` | home/futuro | P3 | S |
| FAQ | preguntas | `/admin/faq` | CRUD/orden | `faqs` | - | páginas | P3 | S |
| Páginas informativas | términos, privacidad, nosotros | `/admin/paginas` | CRUD versiones | `pages`, `page_blocks` | `site-images` | rutas estáticas | P2 | L |
| Menú navegación | links header | `/admin/navegacion` | CRUD/orden | `navigation_items` | - | Navbar | P1 | S |
| Footer | newsletter, columnas, contacto | `/admin/footer` | U/CRUD links | `footer_settings`, `footer_links` | `site-images` | Footer | P1 | M |
| WhatsApp/contacto | números, mensajes plantilla | `/admin/contacto-whatsapp` | U | `site_settings` | - | CTAs/presupuesto | P0 | S |
| SEO | metadata por ruta | `/admin/seo` | CRUD | `seo_entries` | `seo-images` | todas | P1 | M |
| Archivos | gestor de imágenes | `/admin/archivos` | CRUD storage | `media_assets` | varios | todos | P1 | M |
| Usuarios/Roles | acceso admin | `/admin/usuarios` | CRUD | `admin_profiles`, `roles`, `permissions` | - | admin | P0 | L |
| Auditoría | historial | `/admin/auditoria` | R | `activity_logs` | - | admin | P1 | M |

## Formularios por sección home
### Hero/banners
Campos: título interno, imagen desktop, imagen mobile, alt, link, tipo link, activo, orden, fecha publicación, vista previa desktop/mobile. Diseño fijo: grilla 2:1 desktop y scroll mobile. Límites: alt 90, imágenes desktop 1600x900, mobile 1200x900.

### Beneficios
Campos: icono de catálogo cerrado, título, descripción, orden, activo. Diseño fijo: máximo 4 en desktop; scroll horizontal mobile. Límites: título 30, descripción 80.

### Productos destacados / Riego / Paisajismo
Campos: título de sección, selección de productos publicados, cantidad visible, orden de productos, botón opcional, activo, vista previa. Diseño fijo: grid 2 columnas mobile, 4 desktop para destacados, carrusel para paisajismo.

### Newsletter/Footer
Campos: título, descripción, placeholder, botón, política de consentimiento, columnas, enlaces, contacto, redes, copyright. Primera versión debe guardar emails en Supabase.

## Flujo publicación
1. Editor modifica borrador.
2. Validaciones de contenido/imagen/SEO.
3. Vista previa desktop/mobile.
4. Admin/owner publica.
5. Se registra actividad.
6. Web pública consume solo `status='published'`.

## Gestión imágenes
- Buckets separados por dominio: `product-images`, `site-images`, `project-images`, `seo-images`.
- Validar MIME, peso máximo, dimensiones, extensión.
- Guardar metadatos en `media_assets`.
- No usar service role en cliente.

## Estrategia autenticación
- Supabase Auth email/password o magic link.
- Middleware para `/admin/:path*`.
- Perfil admin en `admin_profiles` vinculado a `auth.users`.
- RLS por rol y claims/lookup server-side.
- Server actions/route handlers para mutaciones con validación.
