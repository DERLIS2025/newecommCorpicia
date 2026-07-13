# Roadmap panel administrativo Corpicia

## Sprint 0: estabilización y seguridad
| ID | Descripción | Prioridad | Dependencias | Archivos involucrados | Riesgo | Criterio de aceptación | Complejidad |
|---|---|---|---|---|---|---|---|
| S0-01 | Corregir build dependiente de Google Fonts | P0 | ninguna | `src/app/layout.tsx`, assets fuente | alto | `npm run build` pasa en CI | M |
| S0-02 | Validación de variables env Supabase/WhatsApp | P0 | ninguna | `src/lib/*`, `.env.example` | medio | errores claros sin env | S |
| S0-03 | Diseñar migraciones SQL versionadas | P0 | auditoría aprobada | `supabase/migrations/*` | alto | SQL revisado sin ejecutar prod | M |
| S0-04 | Middleware `/admin` con auth | P0 | Supabase Auth | `middleware.ts`, `src/lib/auth/*` | crítico | `/admin` rechaza anónimos | M |

## Sprint 1: autenticación y estructura del administrador
| ID | Descripción | Prioridad | Dependencias | Archivos | Riesgo | Criterio | Complejidad |
|---|---|---|---|---|---|---|---|
| S1-01 | Crear layouts `/admin` y `/admin/login` | P0 | S0-04 | `src/app/admin/*` | medio | login y shell renderizan | M |
| S1-02 | Perfiles admin y roles | P0 | SQL | Supabase + `src/lib/auth` | alto | owner/admin/editor aplican permisos | L |
| S1-03 | Dashboard inicial | P1 | datos base | `src/app/admin/page.tsx` | bajo | métricas reales básicas | M |

## Sprint 2: productos y categorías
| ID | Descripción | Prioridad | Dependencias | Archivos | Riesgo | Criterio | Complejidad |
|---|---|---|---|---|---|---|---|
| S2-01 | Migrar catálogo estático a Supabase | P0 | S0-03 | `src/data/productsData.ts`, SQL seed | alto | productos actuales preservados | L |
| S2-02 | CRUD productos con imágenes | P0 | S2-01, auth | `src/app/admin/productos/*` | alto | crear/editar/publicar afecta web | L |
| S2-03 | CRUD categorías y orden | P0 | S2-01 | `src/app/admin/categorias/*` | medio | filtros usan categorías reales | M |
| S2-04 | Tiers de precios/unidades | P0 | S2-02 | admin + DB | alto | presupuesto calcula igual que hoy | M |

## Sprint 3: página de inicio y banners
| ID | Descripción | Prioridad | Dependencias | Archivos | Riesgo | Criterio | Complejidad |
|---|---|---|---|---|---|---|---|
| S3-01 | Admin de hero/banners | P0 | media | `src/app/page.tsx`, admin banners | medio | imágenes y links editables | M |
| S3-02 | Admin beneficios | P1 | home_sections | admin beneficios | bajo | 4 tarjetas editables | S |
| S3-03 | Admin secciones productos home | P0 | productos | admin inicio | medio | destacados/riego/paisajismo ordenables | M |

## Sprint 4: servicios, proyectos y galerías
| ID | Descripción | Prioridad | Dependencias | Archivos | Riesgo | Criterio | Complejidad |
|---|---|---|---|---|---|---|---|
| S4-01 | CRUD servicios | P2 | auth/media | `src/app/servicios/page.tsx` | medio | servicios publicados editables | M |
| S4-02 | CRUD proyectos/galería | P2 | media | `src/app/nosotros/page.tsx` | medio | reemplaza JSON local | M |

## Sprint 5: presupuestos, leads y clientes
| ID | Descripción | Prioridad | Dependencias | Archivos | Riesgo | Criterio | Complejidad |
|---|---|---|---|---|---|---|---|
| S5-01 | Persistir presupuestos | P1 | productos | `PresupuestoClient`, route handlers | alto | solicitud queda en Supabase | M |
| S5-02 | Contacto y newsletter reales | P1 | tablas leads | `contacto`, `Footer` | medio | leads listables en admin | M |
| S5-03 | Antispam/rate limit | P0 | route handlers | API | alto | spam mitigado | M |

## Sprint 6: configuración, SEO y usuarios
| ID | Descripción | Prioridad | Dependencias | Archivos | Riesgo | Criterio | Complejidad |
|---|---|---|---|---|---|---|---|
| S6-01 | Admin SEO | P1 | pages/products | metadata | medio | SEO editable por ruta | M |
| S6-02 | Footer/navegación/contacto | P1 | settings | Navbar/Footer | medio | textos/contacto sin deploy | M |
| S6-03 | Usuarios y permisos UI | P0 | roles | admin usuarios | alto | owner gestiona accesos | L |

## Sprint 7: optimización, pruebas y publicación
| ID | Descripción | Prioridad | Dependencias | Archivos | Riesgo | Criterio | Complejidad |
|---|---|---|---|---|---|---|---|
| S7-01 | Tests e2e críticos | P1 | panel | tests | medio | login/CRUD/publicación cubiertos | M |
| S7-02 | Lighthouse/Core Web Vitals | P2 | migración | imágenes/pages | medio | métricas aceptables móvil | M |
| S7-03 | Auditoría RLS final | P0 | panel completo | Supabase | crítico | políticas verificadas | L |
