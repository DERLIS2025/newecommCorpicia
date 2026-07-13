# Matriz Funcional - Panel Administrativo Corpicia

Este documento registra todas las acciones, botones y formularios presentes en la estructura visual del panel y su impacto en el backend (Supabase) y la web pública.

| Ruta | Sección | Botón / Acción | Estado Actual | Comportamiento Esperado | Dato Afectado | Persistencia Requerida | Impacto Público | Prioridad |
|---|---|---|---|---|---|---|---|---|
| `/admin/inicio` | Hero Banners | Editar en Banners | Deshabilitado | Navegar a `/admin/banners` | - | No | - | Alta |
| `/admin/inicio` | Beneficios | Grip (Drag&Drop) | UI Estática | Reordenar beneficios | `settings` (home_benefits) | Supabase | Home (Cards) | Media |
| `/admin/inicio` | Beneficios | Inputs (Título, Desc) | Disabled | Editar textos de beneficios | `settings` (home_benefits) | Supabase | Home (Cards) | Media |
| `/admin/inicio` | Beneficios | Guardar Beneficios | Disabled | Guardar cambios en BD | `settings` (home_benefits) | Supabase | Home (Cards) | Media |
| `/admin/inicio` | Productos Destacados | Quitar | Disabled | Remover producto de la grilla | `settings` (home_featured) | Supabase | Home (Products) | Alta |
| `/admin/inicio` | Productos Destacados | Seleccionar Prod. | Disabled | Abrir modal para elegir prods. | `settings` (home_featured) | Supabase | Home (Products) | Alta |
| `/admin/banners` | Hero Banners | Nuevo Banner | Disabled | Abrir modal creación Hero | `banners` | Supabase | Home (Carousel) | Alta |
| `/admin/banners` | Hero Banners | Edit / Delete | Disabled | Editar/Eliminar banner Hero | `banners` | Supabase | Home (Carousel) | Alta |
| `/admin/banners` | Secundarios | Nuevo Banner | Disabled | Abrir modal creación Secundario | `banners` | Supabase | Home (Middle) | Media |
| `/admin/banners` | Secundarios | Edit / Delete | Disabled | Editar/Eliminar banner Sec. | `banners` | Supabase | Home (Middle) | Media |
| `/admin/productos` | Encabezado | Nuevo Producto | Funcional (Navega) | Navegar a formulario | - | No | - | Alta |
| `/admin/productos` | Encabezado | Buscar | Disabled | Filtrar lista por término | - | No | - | Alta |
| `/admin/productos` | Tabla | Editar | Disabled | Abrir vista edición | `products` | Supabase | Catálogo / URL | Alta |
| `/admin/productos` | Tabla | Eliminar | Disabled | Eliminar (soft-delete) | `products` | Supabase | Catálogo | Alta |
| `/admin/productos` | Tabla | Enlace Externo | Funcional | Ver producto en web | - | No | - | Baja |
| `/admin/productos/nuevo` | General | Guardar Producto | Disabled | Insertar/Actualizar prod en BD | `products` | Supabase | Catálogo / Calculadora | Alta |
| `/admin/productos/nuevo` | Formulario | Todos los Inputs | Disabled | Registrar propiedades | `products` | Supabase | Catálogo / Detalle | Alta |
| `/admin/productos/nuevo` | Arrays (Specs, etc) | Agregar Item | Disabled | Añadir campo dinámico | `product_specifications` | Supabase | Detalle (Tabs) | Media |
| `/admin/categorias` | Encabezado | Nueva Categoría | Disabled | Abrir modal creación | `categories` | Supabase | Navbar / Filtros | Alta |
| `/admin/categorias` | Encabezado | Buscar | Disabled | Filtrar tabla | - | No | - | Media |
| `/admin/categorias` | Tabla | Edit / Delete | Disabled | Modificar/borrar categoría | `categories` | Supabase | Navbar / Filtros | Alta |
| `/admin/calculadora` | Escalas | Adm. Escalas | Disabled | Abrir modal de tiers por prod | `product_price_tiers` | Supabase | Drawer Presupuesto | Alta |
| `/admin/calculadora` | Notas | Guardar Notas | Disabled | Guardar disclaimers del carrito| `settings` (cart_notes) | Supabase | Drawer Presupuesto | Alta |
| `/admin/calculadora` | WhatsApp | Guardar Mensaje | Disabled | Guardar template de MSJ | `settings` (wa_template) | Supabase | Enlace WhatsApp | Alta |
| `/admin/presupuestos` | Encabezado | Buscar | Disabled | Filtrar solicitudes | - | No | - | Alta |
| `/admin/presupuestos` | Tabla | Ver / Aprobar / Rech. | Disabled | Cambiar estado de solicitud | `quotes` | Supabase | - (Solo Admin) | Alta |
| `/admin/seo` | Meta Tags | Guardar Meta Tags | Disabled | Actualizar metadata default | `settings` (seo_global) | Supabase | `<head>` global | Alta |
| `/admin/seo` | Trackers | Guardar Trackers | Disabled | Actualizar GA4/Pixel IDs | `settings` (trackers) | Supabase | GTM / Scripts | Alta |
| `/admin/seo` | Indexación | Regenerar Sitemap | Disabled | Disparar webhook sitemap | - | API/Vercel | SEO Indexing | Media |
| `/admin/configuracion` | Contactos | Guardar Contactos | Disabled | Guardar info de empresa | `settings` (contact_info) | Supabase | Footer / Contacto | Alta |
| `/admin/configuracion` | Redes | Guardar Redes | Disabled | Guardar links sociales | `settings` (social_links) | Supabase | Footer | Media |
| `/admin/configuracion` | Topbar | Guardar Topbar | Disabled | Guardar/activar cinta | `settings` (topbar) | Supabase | Navbar Superior | Alta |
| `/admin/configuracion` | Páginas Legales | Editar | Disabled | Abrir modal o editor WYSIWYG| `settings` (legal_pages) | Supabase | Páginas Estáticas | Media |
| `/admin/servicios` | Desarrollo | Módulo en Des. | Estático | Administrar catálogo de serv. | `services` | Supabase | /servicios | Baja |
| `/admin/proyectos` | Desarrollo | Módulo en Des. | Estático | Administrar portafolio | `projects` | Supabase | Home / Proyectos | Baja |
| `/admin/clientes` | Desarrollo | Módulo en Des. | Estático | Historial de leads/compras | `clients` | Supabase | - | Baja |
| `/admin/multimedia` | Desarrollo | Módulo en Des. | Estático | Explorador de Storage | `storage` | Supabase | Todo el sitio | Media |
| `/admin/usuarios` | Desarrollo | Módulo en Des. | Estático | Gestión Auth | `auth.users` | Supabase | Acceso al Panel | Alta (Fase 14) |
| `/admin/actividad` | Desarrollo | Módulo en Des. | Estático | Logs de auditoría | `audit_logs` | Supabase | - | Baja |
