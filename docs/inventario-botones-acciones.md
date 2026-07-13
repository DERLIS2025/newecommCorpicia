# Inventario de Botones y Acciones del E-commerce

A continuación, un detalle de cada interacción detectada en la web pública, para asegurar que el panel administrativo no rompa ni omita ninguna lógica.

## 1. Botones Globales (Navbar, Footer, Flotantes)
| Botón/Acción | Texto visible / Icono | Ubicación | URL / Destino | Lógica asociada | Editable en admin |
|---|---|---|---|---|---|
| Enlace Topbar | "WHATSAPP" + Icono | `Navbar.tsx` (Top) | WhatsApp API | Abre WA | Sí (`/admin/configuracion`) |
| Icono Menú | Hamburguesa / X | `Navbar.tsx` | UI State | Abre menú mobile | No |
| Enlaces Nav | "Inicio", "Productos"... | `Navbar.tsx` | `/`, `/productos/`, etc. | Navegación Next | Sí (`/admin/configuracion`) |
| Buscar (Desktop) | Icono Lupa | `Navbar.tsx` | `/productos/?q=...` | Submit Form Search | No |
| Icono Presupuesto | Carrito + Badge | `Navbar.tsx` | `/presupuesto/` | Lee de `useBudgetStore` | No |
| WA Flotante | Icono WhatsApp | `layout.tsx` | WhatsApp API | Abre WA con mensaje | Sí (Número WA) |
| Suscribirse | "Suscribirme" | `Footer.tsx` | `console.log()` | Dummy event | Sí (`/admin/configuracion`) |
| Enlaces Legal | "Privacidad"... | `Footer.tsx` | `/privacidad/`, etc. | Navegación Next | Sí (`/admin/configuracion`) |

## 2. Página de Inicio (`/`)
| Botón/Acción | Texto visible / Icono | Ubicación | URL / Destino | Lógica asociada | Editable en admin |
|---|---|---|---|---|---|
| Banner Principal | Imagen clickeable | Hero / Desktop | WhatsApp API | Abre WA sin MSJ | Sí (`/admin/banners`) |
| Banners Sec. | Imágenes clickeables | Hero / Lateral | WhatsApp API | Abre WA sin MSJ | Sí (`/admin/banners`) |
| Producto CTA | "Ver Detalle" (ProductCard) | Grillas de Productos | `/productos/[slug]` | Navegación a PDP | No |
| Banner Mixto | Imagen clickeable | Sección Riego | WhatsApp API | Abre WA | Sí (`/admin/banners`) |

## 3. Listado de Productos (`/productos`)
| Botón/Acción | Texto visible / Icono | Ubicación | URL / Destino | Lógica asociada | Editable en admin |
|---|---|---|---|---|---|
| Checkbox Cat. | Nombres de Categoría | Sidebar | Estado Local | Filtra en UI | Sí (Categorías) |
| Buscar | Lupa / Input | Top bar grid | Estado Local | Filtra en UI | No |

## 4. Detalle de Producto (`/productos/[slug]`)
| Botón/Acción | Texto visible / Icono | Ubicación | URL / Destino | Lógica asociada | Editable en admin |
|---|---|---|---|---|---|
| Thumbnails | Imágenes chicas | Galería | Estado Local | Cambia imagen ppal | No |
| Menos / Más | `-` / `+` | QuantitySelector | Estado Local | Suma o resta en UI | Sí (Mínimos en producto) |
| Agregar CTA | "Agregar al Presupuesto" | Card precios | `budgetStore.addItem` | Añade y alerta | No |
| WhatsApp CTA | "WhatsApp" | Card precios | WhatsApp API | "Hola quiero [Prod]" | Sí (Número) |
| Relacionados | Cards | Bottom page | `/productos/[slug]` | Navegación | Sí (`relatedSlugs`) |

## 5. Carrito de Presupuesto (`/presupuesto`)
| Botón/Acción | Texto visible / Icono | Ubicación | URL / Destino | Lógica asociada | Editable en admin |
|---|---|---|---|---|---|
| Seguir compr. | "Seguir comprando" | Top Page | `/productos/` | Navegación | No |
| Menos / Más | `-` / `+` | Tarjeta Item | `budgetStore.updateQuantity`| Modifica tier/precio| Sí (`/admin/calculadora`) |
| Input Cant. | Número directo | Tarjeta Item | `budgetStore.updateQuantity`| Modifica tier/precio| Sí (`/admin/calculadora`) |
| Eliminar | Papelera | Tarjeta Item | `budgetStore.removeItem`| Borra item | No |
| Vaciar | "Vaciar presupuesto" | Lista items | `budgetStore.clearBudget`| Borra todo | No |
| Enviar | "Enviar por WhatsApp" | Resumen lateral | WhatsApp API | `generateWhatsAppMessage`| Sí (`/admin/calculadora`) |

## 6. Otras Páginas
| Botón/Acción | Texto visible / Icono | Ubicación | URL / Destino | Lógica asociada | Editable en admin |
|---|---|---|---|---|---|
| Solicitar CTA | "Solicitar Presupuesto" | `/servicios` Card | WhatsApp API | Abre WA | No |
| Hablar CTA | "Hablar con un Experto" | `/servicios` Bottom | WhatsApp API | Abre WA | No |
| Botón Submit | "Enviar Mensaje" | `/contacto` Form | `/api/contact` | Envía pero no persiste| Sí (Emails admin) |
