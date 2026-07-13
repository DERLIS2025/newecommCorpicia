# Mapa de Control Administrativo

Este documento detalla exactamente qué rutas públicas y componentes controla cada módulo del panel de administración que será construido, basado en la auditoría técnica.

## `/admin/inicio`
Controla el orden y la visibilidad de los bloques estructurales de la página principal (`src/app/page.tsx`):
- **Hero:** Controla el bloque superior. Muestra cuántos banners están activos y redirige a `/admin/banners` para editarlos.
- **Beneficios:** Controla el arreglo `benefits` (Calidad, Cobertura, Asesoría, Seguridad).
- **Productos Destacados:** Controla el arreglo `featuredProducts` que se muestra en un grid de 4 productos.
- **Banner Mixto + Productos:** Controla el arreglo `mixedProducts` y `underBannerProducts` y su diseño asociado en la página.
- **Paisajismo:** Controla el carrusel/lista `secondaryProducts`.

## `/admin/productos` y `/admin/productos/nuevo`
Controla el catálogo público de productos:
- **`src/app/productos/page.tsx`:** Gestiona qué productos se muestran en el grid público, y su información base (nombre, foto, precio base).
- **`src/app/productos/[slug]/page.tsx` (PDP):** Gestiona la galería de imágenes, las descripciones largas, la taxonomía, las características, la configuración de SEO específica y los tiers de precio aplicables al cálculo en tiempo real.

## `/admin/categorias`
Controla las agrupaciones:
- **`src/app/productos/ProductsClient.tsx`:** Determina qué filtros aparecen en la barra lateral del listado de productos.

## `/admin/calculadora`
Controla la configuración técnica del presupuesto y sus cálculos matemáticos:
- **`src/store/budgetStore.ts` y `src/lib/utils.ts`:**
  - Define las unidades métricas de cálculo (m², unidad, docena, visita).
  - Gestiona las cantidades mínimas (`minQuantity`).
  - Gestiona las escalas de precios (`priceTiers`) utilizadas para el cálculo dinámico en el carrito y PDP.
  - Administra el mensaje base predefinido para enviar vía WhatsApp.

## `/admin/banners`
Controla la gestión multimedia principal del Home:
- **`src/data/banners.ts`:**
  - Administra la lista `homeHeroBanners` (imágenes de 16:9 y 4:3 para mobile).
  - Administra la lista `homeSecondaryBanners`.

## `/admin/configuracion`
Módulo centralizado para elementos de Layout (Componentes fijos y globales en `src/app/layout.tsx`, `Navbar.tsx`, `Footer.tsx`):
- **Topbar Marquee:** Textos promocionales y visibilidad.
- **WhatsApp Flotante / Global:** El número `595992588770` utilizado en Navbar y en URLs.
- **Navegación:** Los enlaces del Menú principal (`navLinks`).
- **Footer:** Información de contacto, dirección, email y links legales.
- **Páginas Estáticas:** Configuración y textos de `/nosotros`, `/terminos`, `/privacidad`.

## `/admin/seo`
Controla la metadata global:
- **`src/app/layout.tsx`:** Configuración de `Metadata`, `Viewport`, y Google Analytics.
- **JSON-LD Schema:** Elementos predefinidos de LocalBusiness y Organization.

## Módulos de solo lectura y futuro alcance
- `/admin/presupuestos`: Mostrará listado de solicitudes (actualmente no hay tabla en BD).
- `/admin/servicios`, `/admin/proyectos`: Gestión futura de las páginas homónimas (hoy arreglos en código).
- `/admin/clientes`, `/admin/usuarios`, `/admin/multimedia`, `/admin/actividad`: Módulos de soporte para escalabilidad.
