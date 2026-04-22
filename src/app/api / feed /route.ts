import { productsCatalog } from '@/data/productsData';

// ✅ CORREGIDO: Sin espacio al final
const SITE_URL = 'https://corpicia.com';

function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatPrice(price: number): string {
  return `${Math.round(price)} PYG`;
}

export function GET(): Response {
  const activeProducts = productsCatalog.filter((p) => p.isActive);

  const itemsXml = activeProducts
    .map((product) => {
      // ✅ CORREGIDO: Con trailing slash
      const link = `${SITE_URL}/productos/${product.slug}/`;
      
      // ✅ CORREGIDO: Mapeo de imágenes para productos con images vacío
      const imageMap: Record<string, string> = {
        'aspersor-rain-bird-5004': '/productos/aspersor-rain-bird-5004.jpg',
        'canto-rodado': '/productos/canto-rodado.jpg',
        'cesped-esmeralda': '/productos/cesped-esmeralda.jpg',
        'cesped-kavaju': '/productos/cesped-kavaju.jpg',
        'cesped-mani-doce': '/productos/cesped-mani-docena.jpg',
        'cesped-siempre-verde': '/productos/cesped-siempre-verde.jpg',
        'difusor-riego-jardin': '/productos/difusor-riego.jpg',
        'granza-blanca-fina-decorativa': '/productos/granza-blanca-fina-decorativa.jpg',
        'mini-rotor-rain-bird-3500': '/productos/mini-rotor-rain-bird-3500.jpg',
        'piso-ecologico-40x60': '/productos/piso-ecologico-40x60.jpg',
        'pisos-imitacion-madera': '/productos/pisos-imitacion-madera.jpg',
        'separador-cesped-caminos': '/productos/separador-cesped-caminos.jpg',
        'valvula-riego-rain-bird': '/productos/valvula-riego-rain-bird.jpg',
      };
      
      const imagePath = product.images?.[0] || imageMap[product.slug] || '/productos/default.jpg';
      const imageLink = imagePath.startsWith('http')
        ? imagePath
        : `${SITE_URL}${imagePath}`;

      const price = product.pricePerM2 ?? 0;

      return `    <item>
      <g:id>${escapeXml(String(product.id))}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(product.description)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(imageLink)}</g:image_link>
      <g:availability>in stock</g:availability>
      <g:price>${escapeXml(formatPrice(price))}</g:price>
      <g:condition>new</g:condition>
      <g:brand>Corpicia</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
    })
    .join('\n');

  // ✅ CORREGIDO: Sin espacio en xmlns:g
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Corpicia</title>
    <link>${SITE_URL}/</link>
    <description>Productos de jardinería en Paraguay</description>
${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
