# Inventario de secciones públicas Corpicia

## Home `/`
| Página | Sección | Orden | Componente | Archivo | Contenido | Fuente de datos | Editable actualmente | Campos admin requeridos | Requisitos imagen | Límites contenido | Estado |
|---|---:|---:|---|---|---|---|---|---|---|---|---|
| Home | Navbar + topbar promo | 1 | `Navbar` | `src/components/Navbar.tsx` | ofertas marquee, logo, búsqueda, navegación, WhatsApp, presupuesto | JSX hardcodeado + Zustand | No | mensajes promo, links nav, logo, WhatsApp, activo/orden | logo PNG aprox 400x200 | promo <= 80 caracteres | Funcional estático |
| Home | Hero/banners | 2 | JSX directo | `src/app/page.tsx` | banner principal y 2 laterales enlazados a WhatsApp | imágenes hardcodeadas | No | imagen desktop/mobile, alt, link, activo, orden, layout fijo | principal 16:9 desktop y 4:3 mobile; laterales 16:9 | alt <= 90 | Funcional estático |
| Home | Beneficios | 3 | `Card` loop | `src/app/page.tsx` | 4 beneficios con icono/título/texto | array `benefits` | No | icono, título, descripción, orden, activo | sin imagen | título <= 30; texto <= 80 | Funcional estático |
| Home | Productos destacados | 4 | `ProductCard` | `src/app/page.tsx` | 4 productos seleccionados por slug | catálogo estático | No | título sección, productos seleccionados, cantidad, orden | producto 1:1 desde catálogo | 4 visibles recomendado | Funcional estático |
| Home | Banner riego + productos | 5 | JSX + `ProductCard` | `src/app/page.tsx` | banner riego, 2 productos bajo banner, columna Riego Automático | hardcodeado + catálogo | No | banner, título, productos asociados, orden | banner 16:9 | título <= 40; 2-4 productos | Funcional estático |
| Home | Paisajismo | 6 | `ProductCard` carousel/grid | `src/app/page.tsx` | 5 productos en grid móvil/carrusel desktop | slugs estáticos | No | título, productos, orden, activo, cantidad visible | producto 1:1 | título <= 40; max 8 productos | Funcional estático |
| Global | Newsletter | 7 | `Footer` | `src/components/Footer.tsx` | input email y botón | JSX hardcodeado | No | título, texto, placeholder, destino, activo | sin imagen | título <= 60; texto <= 140 | Parcial: sin backend |
| Global | Footer institucional | 8 | `Footer` | `src/components/Footer.tsx` | marca, descripción, enlaces, contacto, copyright | JSX hardcodeado | No | logo, descripción, columnas, contacto, redes, copyright | logo o inicial | descripción <= 220 | Funcional estático |

## Catálogo `/productos/`
| Página | Sección | Orden | Componente | Archivo | Contenido | Fuente de datos | Editable actualmente | Campos admin requeridos | Requisitos imagen | Límites contenido | Estado |
|---|---:|---:|---|---|---|---|---|---|---|---|---|
| Productos | Hero catálogo | 1 | `ProductsClient` | `src/app/productos/ProductsClient.tsx` | badge, H1, descripción | JSX hardcodeado | No | badge, título, descripción, SEO | sin imagen | H1 <= 80 | Funcional |
| Productos | Filtros | 2 | `ProductsClient` | `src/app/productos/ProductsClient.tsx` | categorías checkbox | `productCategories` | No | categorías, orden, activo | opcional categoría | nombre <= 35 | Funcional estático |
| Productos | Grilla | 3 | `ProductCard` | `src/app/productos/ProductsClient.tsx` | productos filtrados | `productsCatalog` | No | CRUD productos, estado, precios | 1:1 mínimo 800px | nombre <= 70 | Funcional estático |
| Productos | Estado vacío | 4 | `ProductsClient` | `src/app/productos/ProductsClient.tsx` | mensaje no encontrados | JSX hardcodeado | No | texto vacío | sin imagen | <= 120 | Funcional |

## Presupuesto `/presupuesto/`
| Página | Sección | Orden | Componente | Archivo | Contenido | Fuente de datos | Editable actualmente | Campos admin requeridos | Requisitos imagen | Límites contenido | Estado |
|---|---:|---:|---|---|---|---|---|---|---|---|---|
| Presupuesto | Lista de ítems | 1 | `PresupuestoClient` | `src/app/presupuesto/PresupuestoClient.tsx` | productos agregados, cantidades, tiers | Zustand local | Usuario modifica cantidades | textos ayuda, reglas de cotización | imagen producto | depende de producto | Funcional local |
| Presupuesto | Resumen y WhatsApp | 2 | `PresupuestoClient` | `src/app/presupuesto/PresupuestoClient.tsx` | total y envío por WhatsApp | Zustand + util | No admin | mensaje plantilla, número WhatsApp | sin imagen | mensaje <= WhatsApp URL práctico | Funcional local |

## Contacto `/contacto/`
| Página | Sección | Orden | Componente | Archivo | Contenido | Fuente de datos | Editable actualmente | Campos admin requeridos | Requisitos imagen | Límites contenido | Estado |
|---|---:|---:|---|---|---|---|---|---|---|---|---|
| Contacto | Hero | 1 | JSX | `src/app/contacto/page.tsx` | título y bajada | hardcodeado | No | título, bajada, SEO | sin imagen | título <= 50 | Funcional |
| Contacto | Formulario | 2 | UI inputs | `src/app/contacto/page.tsx` | nombre, apellido, email, teléfono, mensaje | sin backend | No | campos, validaciones, destino | sin imagen | mensaje <= 1000 | Parcial |
| Contacto | Información | 3 | cards | `src/app/contacto/page.tsx` | teléfono, email, ubicación, horario | array local | No | contacto, horarios, mapa | sin imagen | línea <= 80 | Funcional estático |

## Otras páginas
Servicios, Nosotros, Términos y Privacidad son páginas estáticas. Deben administrarse como páginas informativas con bloques controlados, SEO editable, estado publicado/borrador y límites de texto por sección.
