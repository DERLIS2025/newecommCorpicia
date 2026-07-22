export const PRODUCT_IMAGE_FALLBACKS: Record<string, string> = {
  'cesped-esmeralda': '/productos/cesped-esmeralda.jpg',
  'cesped-siempre-verde': '/productos/cesped-siempre-verde.jpg',
  'cesped-kavaju': '/productos/cesped-kavaju.jpg',
  'cesped-mani-docena': '/productos/cesped-mani-docena.jpg',
  'granza-blanca-fina-decorativa': '/productos/granza-blanca-fina-decorativa.jpg',
  'canto-rodado': '/productos/canto-rodado.jpg',
  'separador-cesped-caminos': '/productos/separador-cesped-caminos.jpg',
  'piso-ecologico-40x60': '/productos/piso-ecologico-40x60.jpg',
  'pisos-imitacion-madera': '/productos/pisos-imitacion-madera.jpg',
  'aspersor-rain-bird-5004': '/productos/aspersor-rain-bird-5004.jpg',
  'valvula-riego-rain-bird': '/productos/valvula-riego-rain-bird.jpg',
  'difusor-riego': '/productos/difusor-riego.jpg',
  'mini-rotor-rain-bird-3500': '/productos/mini-rotor-rain-bird-3500.jpg',
  'servicio-mantenimiento-jardin':
    '/trabajos/instalacion-cesped-asuncion.jpg',
};

export function hasProductFallbackImage(slug?: string | null) {
  return Boolean(slug && PRODUCT_IMAGE_FALLBACKS[slug]);
}
