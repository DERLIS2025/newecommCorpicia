# Inventario de Datos Actuales del Ecommerce

El siguiente es un registro de todos los datos detectados durante la auditoría que deben ser reutilizados en la interfaz administrativa.

## 1. Productos (productsData.ts)
*Estado: Archivo estático (Hardcodeado en baseProductsCatalog)*
- **Total de productos:** 14 productos.
- **Campos detectados:** `id`, `name`, `slug`, `description`, `shortDescription`, `pricePerM2`, `unit`, `minQuantity`, `priceTiers`, `images`, `category`, `isActive`, `isFeatured`, `createdAt`, `updatedAt`, `features`, `recommendations`, `relatedSlugs`, `specifications`.
- **Precios dinámicos (Tiers):** Identificados en "Césped Esmeralda m²", "Césped Siempre Verde m²", "Césped Kavaju m²".
- **Unidades usadas:** `m2`, `docena`, `unidad`, `visita`.

## 2. Categorías (productsData.ts)
*Estado: Arreglo estático `productCategories`*
- **Total:** 8 categorías.
- **Valores:** Todos (all), Césped Natural (cesped-natural), Ornamentales (ornamentales), Decorativos (decorativos), Insumos de Jardín (insumos-jardin), Pisos Exteriores (pisos-exteriores), Riego (riego), Servicios (servicios).

## 3. Banners (banners.ts)
*Estado: Archivos estáticos `homeHeroBanners` y `homeSecondaryBanners`*
- **Total Banners Hero:** 3.
- **Total Banners Secundarios:** 2.
- **Campos detectados:** `title`, `subtitle`, `imageDesktop`, `imageMobile`, `CTA`, `link`, `active`, `order`.

## 4. Servicios (servicios/page.tsx)
*Estado: Arreglo estático `services` en el componente*
- **Total:** 4 servicios.
- **Valores:** Instalación de Césped, Sistemas de Riego, Paisajismo, Mantenimiento.
- **Campos detectados:** `icon` (Lucide), `title`, `description`, `features` (arreglo de 4 items).

## 5. Contacto y WhatsApp
*Estado: Mezcla de `.env` y hardcodeado*
- **Teléfono Principal:** `595992588770`
- **Email:** `info@corpicia.com` (Footer), `corpicia@gmail.com` (Schema LocalBusiness en layout.tsx). **(INCONSISTENCIA DETECTADA)**
- **Dirección:** "Tu calle y número, Asunción" (Schema LocalBusiness).
- **Redes Sociales:** `https://www.facebook.com/corpicia`, `https://www.instagram.com/corpicia` (Schema en layout.tsx).

## 6. Configuración SEO Global (layout.tsx)
*Estado: Metadata de Next.js hardcodeada*
- **Title Template:** `%s | Corpicia`
- **Default Title:** `Césped Natural, Riego & Jardinería en Paraguay | Corpicia`
- **Canonical Site URL:** `https://www.corpicia.com` (vía `NEXT_PUBLIC_SITE_URL`).
- **Analytics:** GTM (vía `NEXT_PUBLIC_GTM_ID`), Google Analytics GA4 (`G-9FBEL0RKMY` o `NEXT_PUBLIC_GA_ID`), Google Ads (`NEXT_PUBLIC_GADS_ID`).

## 7. Formularios
*Estado: Sin persistencia*
- **Newsletter:** Existe en `Footer.tsx`. El botón ejecuta un `console.log('Newsletter pendiente de integración backend.')`.
- **Contacto:** Existe en `contacto/page.tsx`. Usa Next API en `/api/contact` pero no persiste en base de datos.
- **Presupuesto (Calculadora):** Estado local vía `zustand` (`budgetStore.ts`). El "submit" consiste en armar un string con `generateWhatsAppMessage` y abrir WhatsApp Web / App.

## Conclusión
Para el panel administrativo, todos estos elementos se mapearán directamente, con avisos de "Pendiente de migración a Base de Datos" en los formularios de configuración.
