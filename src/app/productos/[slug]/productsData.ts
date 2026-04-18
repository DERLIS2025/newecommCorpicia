import type { Product } from '@/types';

export type ProductDetail = Product & {
  features: string[];
  specifications: Record<string, string>;
  relatedSlugs?: string[];
};

const baseProductsCatalog: ProductDetail[] = [
  {
    id: '1',
    name: 'Césped Esmeralda m²',
    slug: 'cesped-esmeralda',
    description:
      'Césped de alta densidad y color intenso, ideal para jardines residenciales en Paraguay y zonas de alto tránsito moderado.',
    shortDescription: 'Césped natural premium para jardines en Paraguay',
    pricePerM2: 31000,
    unit: 'm2',
    minQuantity: 1,
    priceTiers: [
      { min: 1, max: 25, price: 48000, label: '1 a 25 m²' },
      { min: 26, max: 50, price: 43000, label: '26 a 50 m²' },
      { min: 51, max: null, price: 31000, label: 'Más de 50 m²', isPromo: true },
    ],
    images: [],
    category: 'cesped-natural',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: [
      'Color verde uniforme',
      'Recuperación rápida',
      'Ideal para Asunción y Gran Asunción',
      'Bajo mantenimiento',
    ],
    specifications: {
      Tipo: 'Césped natural',
      Presentación: 'm²',
      Resistencia: 'Alta',
      Uso: 'Residencial y comercial',
    },
  },

  {
    id: '2',
    name: 'Césped Siempre Verde m²',
    slug: 'cesped-siempre-verde',
    description:
      'Variedad versátil con excelente adaptación al clima cálido, recomendada para cobertura uniforme durante todo el año.',
    shortDescription: 'Cobertura verde constante para jardines familiares',
    pricePerM2: 25000,
    unit: 'm2',
    minQuantity: 1,
    priceTiers: [
      { min: 1, max: 25, price: 38000, label: '1 a 25 m²' },
      { min: 26, max: 50, price: 34000, label: '26 a 50 m²' },
      { min: 51, max: null, price: 25000, label: 'Más de 50 m²', isPromo: true },
    ],
    images: [],
    category: 'cesped-natural',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: [
      'Alta adaptabilidad',
      'Textura agradable',
      'Crecimiento uniforme',
      'Buena tolerancia al sol',
    ],
    specifications: {
      Tipo: 'Césped natural',
      Presentación: 'm²',
      Resistencia: 'Media/Alta',
      Uso: 'Residencial',
    },
  },

  // (continúa igual… TODO el resto del archivo queda igual que tu versión main)
];

// función automática de imágenes
const withImages = (product: ProductDetail): ProductDetail => ({
  ...product,
  images:
    product.images && product.images.length > 0
      ? product.images
      : [`/productos/${product.slug}.jpg`],
});

// catálogo final con imágenes automáticas
export const productsCatalog: ProductDetail[] = baseProductsCatalog.map(withImages);

export const productsData: Record<string, ProductDetail> = Object.fromEntries(
  productsCatalog.map((product) => [product.slug, product])
);

export const defaultProduct: ProductDetail = {
  id: '0',
  name: 'Producto Corpicia',
  slug: 'producto-corpicia',
  description: 'Descripción del producto',
  shortDescription: 'Producto disponible en Corpicia',
  pricePerM2: 0,
  unit: 'm2',
  minQuantity: 1,
  images: ['/productos/default.jpg'],
  category: 'general',
  isActive: true,
  isFeatured: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  features: [],
  specifications: {},
};

export const productCategories = [
  { id: 'all', name: 'Todos', slug: 'all' },
  { id: 'cesped-natural', name: 'Césped Natural', slug: 'cesped-natural' },
  { id: 'ornamentales', name: 'Ornamentales', slug: 'ornamentales' },
  { id: 'decorativos', name: 'Decorativos', slug: 'decorativos' },
  { id: 'insumos-jardin', name: 'Insumos de Jardín', slug: 'insumos-jardin' },
  { id: 'pisos-exteriores', name: 'Pisos Exteriores', slug: 'pisos-exteriores' },
  { id: 'riego', name: 'Riego', slug: 'riego' },
  { id: 'servicios', name: 'Servicios', slug: 'servicios' },
];