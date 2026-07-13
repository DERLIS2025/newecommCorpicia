# ADMIN_STATUS Corpicia

## Qué existe
- Web pública Next.js con home, productos, detalle, presupuesto, servicios, nosotros, contacto, términos y privacidad.
- Componentes globales Navbar, Footer, WhatsApp y BudgetDrawer.
- Catálogo estático y cálculo de presupuesto con Zustand.
- Cliente Supabase aislado con helpers de lectura para `products` y `categories`.

## Qué funciona
- Render público por código estático.
- Búsqueda/filtros de productos en cliente.
- Agregar productos al presupuesto local y enviar resumen por WhatsApp.
- Sitemap, robots y feed XML basados en datos estáticos.

## Qué está incompleto
- Formulario de contacto no persiste datos.
- Newsletter no guarda suscripciones.
- Supabase no alimenta páginas públicas actualmente.
- No hay gestión de imágenes ni storage integrado.

## Qué es mock o simulado
- Newsletter: `console.log('Newsletter pendiente de integración backend.')`.
- README menciona panel administrativo básico, pero el código no contiene rutas admin.
- Banners de `src/data/banners.ts` existen como configuración, pero home usa JSX directo.

## Qué está roto o riesgoso
- Supabase se crea con strings vacíos si faltan env vars. (Corregido en Sprint 0: cliente estabilizado, no falla al faltar vars).
- Existe una ruta/carpeta con espacios `src/app/api / feed /route.ts` (Corregido: no presente en el entorno Windows actual).
- No hay middleware ni autenticación para un futuro `/admin`. (Corregido en Sprint 0: middleware base y rutas /admin creadas en modo preparación).
- `npm run build` falló por no poder descargar fuente Inter desde Google Fonts. (Corregido en Sprint 0: se usan fuentes de sistema).

## Qué falta
- Panel `/admin` completo (Estructura base creada).
- Login, Supabase Auth, roles, permisos y RLS (Interfaces base creadas y documentadas).
- CRUD productos/categorías/precios/banners/secciones/footer/SEO.
- Persistencia de presupuestos, leads y newsletter.
- Migraciones SQL versionadas.
- Vista previa, borradores, publicación e historial.

## Próximo paso recomendado
**Sprint 1:** Integración real de Supabase Auth, validación obligatoria en middleware, configuración de RLS y esquema de base de datos base antes de implementar los primeros CRUD.
