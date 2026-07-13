# Auditoría completa Corpicia

## Resumen ejecutivo
Corpicia es una aplicación Next.js 14 con App Router, Tailwind, Zustand y una dependencia Supabase instalada. La web pública existe y conserva identidad visual de ecommerce de césped/jardinería. No existe panel administrativo implementado en `src/app`: no hay rutas `/admin`, `/dashboard`, login, middleware ni CRUD administrativo. La mayoría del contenido público se alimenta de datos estáticos TypeScript y assets locales.

## Estado general del proyecto
- Estado funcional público: **parcialmente operativo** por código estático.
- Estado administrativo: **NO IMPLEMENTADO**.
- Estado Supabase: **cliente referenciado pero no integrado en páginas actuales**.
- Build: **falló por descarga de fuente Google Inter en `next/font`** durante `npm run build`.
- Lint: **no ejecutable en modo CI actual**; `next lint` entra en asistente interactivo para configurar ESLint y no completa en entorno no interactivo.
- Sitio público observado en producción: coincide con home de banners, beneficios, productos destacados, riego, paisajismo, newsletter y footer.

## Tecnologías detectadas
- Next.js `^14.0.0`, React 18, TypeScript strict, Tailwind CSS.
- Supabase JS `^2.39.0`.
- Zustand con persistencia local para presupuesto.
- Lucide React, utilidades `clsx`, `tailwind-merge`, CVA.

## Arquitectura actual
- `src/app/layout.tsx`: layout global con Navbar, Footer, botón WhatsApp flotante, drawer de presupuesto, SEO global, JSON-LD y scripts de analytics.
- `src/app/page.tsx`: home pública compuesta directamente con arrays estáticos y productos filtrados por slug.
- `src/app/productos`: catálogo y detalle.
- `src/app/presupuesto`: resumen de presupuesto en cliente con Zustand.
- `src/lib/supabase.ts`: funciones aisladas para `products` y `categories`, sin uso confirmado en rutas públicas.
- `src/data/productsData.ts` y copia en `src/app/productos/[slug]/productsData.ts`: catálogo estático principal.

## Mapa de rutas
### Rutas públicas HTML
| Ruta | Archivo | Estado | Fuente de datos |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Funcional estática | `productsCatalog`, arrays locales |
| `/productos/` | `src/app/productos/page.tsx` | Funcional estática | `productsCatalog`, `productCategories` |
| `/productos/[slug]/` | `src/app/productos/[slug]/page.tsx` | Funcional estática | `productsData` |
| `/presupuesto/` | `src/app/presupuesto/page.tsx` | Funcional cliente | Zustand localStorage |
| `/servicios/` | `src/app/servicios/page.tsx` | Funcional estática | JSX local |
| `/nosotros/` | `src/app/nosotros/page.tsx` | Funcional estática con lectura JSON local | `public/trabajos/data.json` |
| `/contacto/` | `src/app/contacto/page.tsx` | Parcial: formulario deriva a WhatsApp | JSX local |
| `/terminos/` | `src/app/terminos/page.tsx` | Estática | JSX local |
| `/privacidad/` | `src/app/privacidad/page.tsx` | Estática | JSX local |

### Route handlers y metadata
| Ruta | Archivo | Estado |
|---|---|---|
| `/feed.xml` | `src/app/feed.xml/route.ts` | Funcional teórico, feed de productos estáticos |
| Ruta con espacios `src/app/api / feed /route.ts` | `src/app/api / feed /route.ts` | Riesgo/incorrecta por espacios en carpetas |
| `/robots.txt` | `src/app/robots.ts` | Configurado |
| `/sitemap.xml` | `src/app/sitemap.ts` | Configurado con rutas estáticas y productos |

### Rutas administrativas
No se encontraron rutas administrativas reales (`/admin`, `/dashboard`, `/login`) en `src/app`.

## Mapa de componentes principales
- `Navbar`: topbar promocional, menú, búsqueda, acceso presupuesto, WhatsApp.
- `Footer`: newsletter sin backend, columnas de enlaces y contacto.
- `ProductCard`: tarjeta reutilizada en home, catálogo y relacionados.
- `BudgetDrawer`: minicart/presupuesto global.
- `WhatsAppButton`: CTA flotante.
- UI base: `Button`, `Input`, `Card`, `Badge`, `QuantitySelector`.

## Mapa de secciones públicas home
1. Navbar global y topbar promocional.
2. Hero/banners: banner principal y dos laterales con link WhatsApp.
3. Beneficios: 4 tarjetas.
4. Productos destacados: 4 productos por slug.
5. Banner riego + productos bajo banner + columna “Riego Automático”.
6. Paisajismo: lista/carrusel de 5 productos.
7. Newsletter dentro de Footer.
8. Footer institucional.
9. Botón/Drawer de presupuesto global y WhatsApp flotante desde layout.

## Estado del panel actual
- Dashboard: NO IMPLEMENTADO.
- Login/Auth: NO IMPLEMENTADO.
- CRUD productos/categorías: NO IMPLEMENTADO.
- Subida de imágenes: NO IMPLEMENTADO.
- Roles/permisos: NO IMPLEMENTADO.
- Publicación/vista previa: NO IMPLEMENTADO.

## Estado de Supabase
| Tabla | Uso actual | Archivo | Campos conocidos | CRUD | RLS conocido | Estado | Riesgo |
|---|---|---|---|---|---|---|---|
| `products` | Consultas select por activos/destacados/slug | `src/lib/supabase.ts` | Inferidos por tipos: id, name, slug, description, pricePerM2, etc.; consulta usa `is_active`, `is_featured`, `created_at` | Solo lectura en helper | No visible | Referenciada pero sin esquema | Alto: mismatch camelCase/snake_case posible |
| `categories` | Consulta select activos ordenados | `src/lib/supabase.ts` | Tipo Category camelCase; consulta usa `is_active`, `sort_order` | Solo lectura en helper | No visible | Referenciada pero sin esquema | Alto: no se usa públicamente |

No se encontraron migraciones SQL ni políticas RLS en el repositorio.

## Funcionalidades reales
- Catálogo estático con búsqueda/filtros cliente.
- Detalle de producto estático.
- Presupuesto local con cálculo por tiers y envío por WhatsApp.
- SEO básico con metadata, sitemap, robots, JSON-LD.
- Feed XML de productos estáticos.
- Contacto por WhatsApp.

## Funcionalidades simuladas o parciales
- Newsletter: botón solo hace `console.log`.
- Formulario de contacto: no persiste ni envía email; abre WhatsApp.
- Supabase: helpers no conectados al rendering público.
- README menciona panel básico, pero no existe implementación.

## Hallazgos técnicos, seguridad y UX

### SEC-001
- Categoría: Seguridad
- Severidad: Alta
- Archivo: `src/app/robots.ts`
- Línea aproximada: 12
- Evidencia: se bloquea `/admin/` en robots, pero no existe middleware ni protección real.
- Problema: confiar en robots no protege rutas futuras.
- Impacto: si se crea `/admin` sin middleware, quedará expuesto.
- Recomendación: implementar middleware con Supabase Auth, roles y validación server-side antes del panel.
- Prioridad: P0

### SEC-002
- Categoría: Seguridad
- Severidad: Media
- Archivo: `src/lib/supabase.ts`
- Línea aproximada: 4-7
- Evidencia: `createClient` se instancia con strings vacíos si faltan variables.
- Problema: falla tardía y silenciosa; no hay validación explícita de env.
- Impacto: errores confusos en producción y riesgo de publicar sin integración real.
- Recomendación: validar variables al iniciar helpers y separar cliente browser/server.
- Prioridad: P1

### TECH-001
- Categoría: Build
- Severidad: Alta
- Archivo: `src/app/layout.tsx`
- Línea aproximada: 3-10
- Evidencia: `next/font/google` con Inter falló al descargar Google Fonts en build.
- Problema: build depende de red externa en compilación.
- Impacto: despliegues pueden fallar por conectividad.
- Recomendación: usar fuente local o asegurar acceso a fonts.googleapis.com en CI.
- Prioridad: P0

### TECH-002
- Categoría: Estructura
- Severidad: Media
- Archivo: `src/app/api / feed /route.ts`
- Línea aproximada: ruta del archivo
- Evidencia: carpeta contiene espacios: `api / feed /route.ts`.
- Problema: ruta inválida/confusa y duplicada con `feed.xml`.
- Impacto: deuda técnica y posibles rutas inesperadas.
- Recomendación: eliminar o migrar tras validar comportamiento; no tocar en esta fase.
- Prioridad: P2

### DATA-001
- Categoría: Datos
- Severidad: Alta
- Archivo: `src/data/productsData.ts` y `src/app/productos/[slug]/productsData.ts`
- Línea aproximada: 10-629
- Evidencia: catálogo y categorías están hardcodeados.
- Problema: cambios requieren código/deploy.
- Impacto: no permite administración real.
- Recomendación: migrar a Supabase con import inicial y fallback controlado.
- Prioridad: P0

### DATA-002
- Categoría: Datos
- Severidad: Media
- Archivo: `src/data/banners.ts`
- Línea aproximada: 14-68
- Evidencia: banners definidos como arrays, pero home usa imágenes directas en JSX.
- Problema: hay configuración estática no conectada.
- Impacto: confusión para futuro admin.
- Recomendación: unificar fuente de banners antes de CRUD.
- Prioridad: P1

### UX-001
- Categoría: UX/Formularios
- Severidad: Media
- Archivo: `src/components/Footer.tsx`
- Línea aproximada: 259-260
- Evidencia: newsletter solo registra console.log.
- Problema: usuario cree suscribirse, pero no se guarda.
- Impacto: pérdida de leads y confianza.
- Recomendación: conectar a tabla `newsletter_subscriptions` o desactivar hasta implementar.
- Prioridad: P1

### UX-002
- Categoría: UX/Formularios
- Severidad: Media
- Archivo: `src/app/contacto/page.tsx`
- Línea aproximada: formulario completo
- Evidencia: inputs no tienen estado ni submit real; CTA abre WhatsApp genérico.
- Problema: datos ingresados no se usan.
- Impacto: fricción y pérdida de información.
- Recomendación: convertir a form controlado que cree lead/contact_message y opcionalmente componga WhatsApp.
- Prioridad: P1

### SEO-001
- Categoría: SEO
- Severidad: Media
- Archivo: `src/app/layout.tsx`
- Línea aproximada: 94-106
- Evidencia: metadata referencia `/og-image.jpg`, pero no aparece en inventario público revisado.
- Problema: imagen OG potencialmente ausente.
- Impacto: previews sociales incompletos.
- Recomendación: validar asset o actualizar metadata.
- Prioridad: P2

### PERF-001
- Categoría: Rendimiento
- Severidad: Media
- Archivo: `src/app/page.tsx`
- Línea aproximada: 55-154
- Evidencia: hero usa varias imágenes grandes locales; algunas con object-contain y priority solo principal.
- Problema: potencial LCP/peso móvil a revisar.
- Impacto: carga móvil subóptima.
- Recomendación: definir tamaños, variantes mobile reales y medición Lighthouse.
- Prioridad: P2

## Datos hardcodeados importantes
1. Productos completos, precios, tiers, recomendaciones y categorías.
2. Banners e imágenes hero.
3. WhatsApp `595992588770` en home y fallback util.
4. Topbar promocional.
5. Footer, enlaces, correo, dirección.
6. SEO/JSON-LD con dirección placeholder `Tu calle y número`.
7. IDs Analytics fallback.
8. Formularios sin backend.

## Riesgos principales
- Admin futuro sin autenticación real si se implementa directamente sobre UI.
- Esquema Supabase desconocido y no migrado.
- Duplicidad catálogo `src/data` vs `src/app/productos/[slug]`.
- Build dependiente de Google Fonts.
- Formularios prometen acciones que no persisten.

## Recomendaciones
1. Sprint 0: estabilizar build, env validation, middleware base y limpieza de rutas duplicadas.
2. Definir migración Supabase versionada antes del admin.
3. Crear `admin_users`, roles y RLS antes de CRUD.
4. Migrar productos/categorías primero porque alimentan home, catálogo, presupuesto, sitemap y feed.
5. Implementar formularios por sección con vista previa y límites para conservar diseño.
