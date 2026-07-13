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
- `npm run build` falló por no poder descargar fuente Inter desde Google Fonts.
- Existe una ruta/carpeta con espacios `src/app/api / feed /route.ts`.
- No hay middleware ni autenticación para un futuro `/admin`.
- Supabase se crea con strings vacíos si faltan env vars.

## Qué falta
- Panel `/admin` completo.
- Login, Supabase Auth, roles, permisos y RLS.
- CRUD productos/categorías/precios/banners/secciones/footer/SEO.
- Persistencia de presupuestos, leads y newsletter.
- Migraciones SQL versionadas.
- Vista previa, borradores, publicación e historial.

## Próximo paso recomendado
Ejecutar Sprint 0: estabilizar build, definir esquema Supabase y seguridad base antes de implementar cualquier CRUD administrativo.
