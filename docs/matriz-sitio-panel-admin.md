# Matriz Sitio vs Panel Admin

| Página Pública | Sección / Componente | Archivo | Dato Actual / Fuente | Acción Pública | Módulo Admin | Ruta Admin | Campos Editables | Campos Fijos | Persistencia Actual | Persistencia Futura | Prioridad | Riesgo |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Global | Topbar Marquee | `Navbar.tsx` | Hardcodeado (Ofertas césped) | - | Configuración | `/admin/configuracion` | Textos, Visibilidad | Diseño CSS | Código fuente | Base de datos | Alta | Bajo |
| Global | Botón WhatsApp Navbar | `Navbar.tsx` | `utils.ts` / `ENV` | Abrir WhatsApp | Configuración | `/admin/configuracion` | Número WhatsApp | - | ENV / fallback | Base de datos | Alta | Bajo |
| Global | Logo y Navegación | `Navbar.tsx` | Links hardcodeados | Navegar rutas | Configuración | `/admin/configuracion` | Enlaces, orden | Logo UI | Código fuente | Base de datos | Media | Medio |
| Global | SEO Metadata | `layout.tsx` | JSON-LD, Titles | Indexación | SEO | `/admin/seo` | Title, Desc, Keywords | ID Analytics | Código fuente | Base de datos | Alta | Alto (Impacta ranking) |
| Global | Footer Contacto | `Footer.tsx` | Hardcodeado | Links, Mails, Tel | Configuración | `/admin/configuracion` | Teléfono, Email, Dirección | Estructura | Código fuente | Base de datos | Alta | Bajo |
| Global | Footer Legal | `Footer.tsx` | Hardcodeado | Navegar | Configuración | `/admin/configuracion` | Links TyC, Privacidad | - | Código fuente | Base de datos | Baja | Bajo |
| Global | Newsletter form | `Footer.tsx` | `console.log()` | Suscribirse | - | - | Textos, destino | Estructura | Sin persistencia | Base de datos | Media | Bajo |
| Global | BudgetDrawer | `layout.tsx` / `budgetStore.ts` | Estado Zustand | Ver carrito | Calculadora | `/admin/calculadora` | Textos de disclaimer | Estado UI | LocalStorage | N/A | Alta | Alto (Lógica de precio) |
| `/` | Hero Banners | `page.tsx` | `banners.ts` (homeHeroBanners) | Navegar / WhatsApp | Banners | `/admin/banners` | Imagen, Título, Subtítulo, CTA, Link | - | Archivo TS | Base de datos | Alta | Medio |
| `/` | Beneficios | `page.tsx` | `page.tsx` (benefits) | - | Inicio | `/admin/inicio` | Título, Desc, Icono | Cantidad (4) | Archivo TS | Base de datos | Baja | Bajo |
| `/` | Productos Destacados | `page.tsx` | `page.tsx` (featuredProducts) | Ir a PDP | Inicio / Productos | `/admin/inicio` | Selección (max 4) | Layout Grid | Archivo TS | Base de datos | Alta | Medio |
| `/` | Banners Secundarios | `page.tsx` | `page.tsx` (mixed, underBanner) | Navegar | Inicio / Banners | `/admin/banners` | Imágenes, Asignación productos | Estructura | Archivo TS | Base de datos | Media | Medio |
| `/` | Paisajismo (Scroll) | `page.tsx` | `page.tsx` (secondaryProducts) | Scroll / Navegar | Inicio | `/admin/inicio` | Productos asignados | UI Scroll | Archivo TS | Base de datos | Media | Medio |
| `/productos` | Catálogo Grid | `ProductsClient.tsx` | `productsCatalog` (productsData.ts) | Filtrar / Navegar | Productos | `/admin/productos` | Productos visibles, orden | Paginación / Filtros | Archivo TS | Base de datos | Alta | Medio |
| `/productos` | Filtro Categorías | `ProductsClient.tsx` | `productCategories` (productsData.ts) | Filtrar | Categorías | `/admin/categorias` | Nombre, Slug | Lógica filtro | Archivo TS | Base de datos | Alta | Medio |
| `/productos/[slug]` | Detalle Producto (PDP) | `ProductDetailClient.tsx` | `productsData.ts` | Añadir presupuesto / WhatsApp | Productos | `/admin/productos/nuevo` | Nombre, Desc, Precios, Unidad, Mínimo, Tiers, Galería | Layout PDP | Archivo TS | Base de datos | Alta | Alto |
| `/productos/[slug]` | Recomendados | `ProductDetailClient.tsx` | `productsData.ts` (relatedSlugs) | Navegar | Productos | `/admin/productos` | relatedSlugs | Componente UI | Archivo TS | Base de datos | Media | Bajo |
| `/presupuesto` | Resumen de Presupuesto | `PresupuestoClient.tsx` | `budgetStore.ts` | WhatsApp Submit | Calculadora | `/admin/calculadora` | Reglas cálculo, Aclaraciones, Mensaje WA | Componente | Zustand | LocalStorage / BD | Alta | Alto |
| `/servicios` | Listado Servicios | `page.tsx` (servicios) | `page.tsx` (services) | Navegar WA | Servicios | `/admin/servicios` | Título, Descripción, Features | Iconos | Archivo TS | Base de datos | Media | Medio |
| `/nosotros` | Contenido Estático | `page.tsx` (nosotros) | Hardcodeado | - | Configuración | `/admin/configuracion` | Textos, Misión | Layout | Archivo TS | Base de datos | Baja | Bajo |
| `/contacto` | Info y Formularios | `page.tsx` (contacto) | Hardcodeado | Submit | Configuración | `/admin/configuracion` | Textos, Destino mail | Lógica Form | Archivo TS | Base de datos | Alta | Medio |
| `/terminos` | Legales | `page.tsx` (terminos) | Hardcodeado | - | Configuración | `/admin/configuracion` | Texto enriquecido | - | Archivo TS | Base de datos | Baja | Bajo |
| `/privacidad` | Legales | `page.tsx` (privacidad) | Hardcodeado | - | Configuración | `/admin/configuracion` | Texto enriquecido | - | Archivo TS | Base de datos | Baja | Bajo |
