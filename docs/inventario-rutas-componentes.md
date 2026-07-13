# Inventario de Rutas y Componentes Públicos

Este documento documenta la arquitectura pública de componentes, asegurando que el panel administrativo respete exactamente las dependencias sin inventar módulos desconectados.

## 1. Arquitectura Base (Layout)
**Ruta:** Global (Envuelve a todas las páginas)
**Archivo:** `src/app/layout.tsx`
**Componentes Inyectados:**
- `<Navbar />` (`src/components/Navbar.tsx`)
- `<Footer />` (`src/components/Footer.tsx`)
- `<WhatsAppFloatingButton />` (`src/components/WhatsAppButton.tsx`)
- `<BudgetDrawer />` (`src/components/BudgetDrawer.tsx`)
**Gestión Admin:** Será manejado globalmente por `/admin/configuracion` y `/admin/seo`.

## 2. Página de Inicio
**Ruta Pública:** `/`
**Archivo:** `src/app/page.tsx`
**Bloques (En orden estricto de renderizado):**
1. **Hero Banners:** Sección responsiva de 3 banners (Principal + 2 laterales) que ocupan 100% de alto o ratio.
2. **Beneficios:** Grid de 4 tarjetas (`Card` de UI) con iconos de `lucide-react`.
3. **Productos Destacados:** Titulo + Grid de `<ProductCard />`.
4. **Riego Automático (Banner Mixto):** Banner 16:9 + Grid de 4 productos de riego (`mixedProducts` y `underBannerProducts`).
5. **Paisajismo:** Carrusel horizontal de productos `secondaryProducts`.
**Gestión Admin:** Control visualizado en `/admin/inicio` (orden y selección) y `/admin/banners`.

## 3. Catálogo de Productos
**Rutas Públicas:** `/productos`
**Archivo Principal:** `src/app/productos/page.tsx`
**Componente Lógico:** `src/app/productos/ProductsClient.tsx`
**Bloques:**
1. **Header Sección:** Título y descripción con UI estática.
2. **Sidebar Categorías:** Checkboxes dinámicos generados desde `productCategories`.
3. **Barra de Búsqueda:** Input para filtrar nombre (búsqueda en cliente local).
4. **Grid Productos:** Mapeo de `filteredProducts` a `<ProductCard />`.
**Gestión Admin:** Control de productos visibles en `/admin/productos` y categorías en `/admin/categorias`.

## 4. Detalle de Producto
**Rutas Públicas:** `/productos/[slug]`
**Archivo Principal:** `src/app/productos/[slug]/page.tsx`
**Componente Lógico:** `src/app/productos/[slug]/ProductDetailClient.tsx`
**Bloques:**
1. **SEO Server-Side:** Generación de schemas estáticos (JSON-LD) para Producto y Breadcrumbs.
2. **Galería:** Imagen principal + thumbnails clickeables.
3. **Header Producto:** Título, sub-descripción (verde), descripción larga.
4. **Calculadora Individual:** Precio unitario, `<QuantitySelector />`, Tiers de precio (si aplica), Total y botones.
5. **Características:** Lista con checks de la propiedad `features`.
6. **Especificaciones:** Par clave/valor de la propiedad `specifications`.
7. **Recomendaciones:** Lista `<ul>` con la propiedad `recommendations`.
8. **Relacionados:** Grid con 4 productos derivados de `relatedSlugs`.
**Gestión Admin:** Control detallado de todo el payload en `/admin/productos/[slug]` (modo edición).

## 5. Presupuesto (Carrito)
**Rutas Públicas:** `/presupuesto`
**Archivo Principal:** `src/app/presupuesto/page.tsx`
**Componente Lógico:** `src/app/presupuesto/PresupuestoClient.tsx`
**Bloques:**
1. **Estado Vacío:** Diseño central cuando no hay ítems en `useBudgetStore`.
2. **Lista de Ítems:** Tarjetas que muestran la imagen, nombre, selector de cantidad, tiers, y un mensaje dinámico (`getTierMessage`).
3. **Resumen Sidebar:** Total, disclaimer legales, y el botón verde `<MessageCircle />` para exportar a WhatsApp.
**Gestión Admin:** La parametrización de las "notas de aclaración", las escalas dinámicas y la unidad base se gestionarán en `/admin/calculadora`.

## 6. Páginas de Contenido / Estáticas
Todas estas rutas utilizan una arquitectura de contenido hardcodeada con uso de componentes UI (Card, Button).

- **/servicios** (`src/app/servicios/page.tsx`): Hero + Grid de 4 tarjetas (Instalación, Riego, Paisajismo, Mantenimiento) + CTA final.
- **/contacto** (`src/app/contacto/page.tsx`): Formulario de contacto hacia `/api/contact` + grid de información estática.
- **/nosotros** (`src/app/nosotros/page.tsx`): Sección de historia y misión en texto enriquecido (HTML/JSX puro).
- **/terminos** y **/privacidad**: Textos legales planos.
**Gestión Admin:** Su edición requiere migrar el HTML hardcodeado a una base de datos o CMS. De momento en el admin (/admin/servicios, /admin/configuracion) aparecerán como "Pendientes de migración a Base de Datos".
