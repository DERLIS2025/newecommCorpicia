# ADMIN_STATUS Corpicia

## Qué existe
- Web pública Next.js con home, productos, detalle, presupuesto, servicios, nosotros, contacto, términos y privacidad.
- Componentes globales Navbar, Footer, WhatsApp y BudgetDrawer.
- Catálogo estático y cálculo de presupuesto con Zustand.
- Cliente Supabase aislado con helpers de lectura para `products` y `categories`.
- **Estructura visual del Panel de Administración (Sprint 1 UI) con layout completo y 14 rutas, mapeado a los datos de la web pública (Modo Diseño/Read-Only).**

## Qué funciona
- Render público por código estático.
- Búsqueda/filtros de productos en cliente.
- Agregar productos al presupuesto local y enviar resumen por WhatsApp.
- Sitemap, robots y feed XML basados en datos estáticos.
- **Navegación completa del panel de administración `/admin` (Mock visual sin mutación).**

## Qué está incompleto
- Formulario de contacto no persiste datos.
- Newsletter no guarda suscripciones.
- Supabase no alimenta páginas públicas actualmente.
- No hay gestión de imágenes ni storage integrado.
- Panel administrativo no persiste cambios en Base de Datos (Modo UI).

## Qué es mock o simulado
- Newsletter: `console.log('Newsletter pendiente de integración backend.')`.
- Banners de `src/data/banners.ts` existen como configuración, pero home usa JSX directo (el Panel UI mapea a esto).
- Formularios en `/admin/*` tienen botones "Guardar" deshabilitados (ConnectionNotice activado).

## Qué está roto o riesgoso
- Supabase se crea con strings vacíos si faltan env vars. (Corregido en Sprint 0: cliente estabilizado, no falla al faltar vars).
- Existe una ruta/carpeta con espacios `src/app/api / feed /route.ts` (Corregido: no presente en el entorno Windows actual).
- No hay middleware ni autenticación para un futuro `/admin`. (Corregido en Sprint 0: middleware base implementado, listo para Supabase Auth).
- `npm run build` falló por no poder descargar fuente Inter desde Google Fonts. (Corregido en Sprint 0: se usan fuentes de sistema).

## Qué falta
- Login, Supabase Auth, roles, permisos y RLS (Pendiente Sprint 1 Auth).
- Conexión real de los CRUDs creados en el UI (productos/categorías/precios/banners/secciones/footer/SEO) hacia Supabase y migración de datos estáticos a la BD.
- Persistencia de presupuestos, leads y newsletter.
- Migraciones SQL versionadas.
- Vista previa, borradores, publicación e historial.

## Próximo paso recomendado
**Sprint 1 Auth & Database:** Integración de Supabase Auth, protección estricta de `/admin` con validación de tokens y migración inicial de la taxonomía del catálogo (productos, categorías, banners) a la base de datos Supabase para conectar la UI.
