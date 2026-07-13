# ADMIN_STATUS Corpicia

## Qué existe
- Web pública Next.js con home, productos, detalle, presupuesto, servicios, nosotros, contacto, términos y privacidad.
- Componentes globales Navbar, Footer, WhatsApp y BudgetDrawer.
- Catálogo estático y cálculo de presupuesto con Zustand.
- Cliente Supabase aislado con helpers de lectura.
- Estructura visual del Panel de Administración.

## Estado de los Sprints
- **Sprint 0:** Fundamentos, layout visual, y dependencias (Completado).
- **Sprint 1:** Estructura de UI y navegación visual (Completado).
- **Sprint 2A:** Fundación de datos, repositorios con fallback, scripts de migración segura. Cero modificaciones en producción. (Completado).
- **Sprint 2B:** CRUD de Productos y Categorías (Pendiente).
- **Sprint 2C:** Banners, inicio y configuración (Pendiente).
- **Sprint 2D:** Calculadora, presupuestos y clientes (Pendiente).
- **Sprint 2E:** Servicios, proyectos, multimedia y SEO (Pendiente).
- **Sprint Final:** Autenticación, roles, middleware y auditoría (Pendiente).

## Qué funciona
- Render público por código estático.
- Búsqueda/filtros de productos en cliente.
- Agregar productos al presupuesto local y enviar resumen por WhatsApp.
- Sitemap, robots y feed XML basados en datos estáticos.
- Navegación completa del panel de administración `/admin` (Mock visual sin mutación).

## Qué está incompleto
- Formulario de contacto no persiste datos.
- Formularios del panel de administración (Sprint 2 en adelante).

## Lo que falta conectar
- Las APIs de mutación (POST/PUT/DELETE) para los módulos administrativos hacia Supabase.
- Configuración de dominios dinámicos (calculadora, settings).
- Gestión de leads y clientes.
