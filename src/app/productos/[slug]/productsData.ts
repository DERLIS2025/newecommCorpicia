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
    relatedSlugs: ['cesped-siempre-verde', 'cesped-kavaju'],
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
      'Variedad versátil con excelente adaptación al clima cálido.',
    shortDescription: 'Cobertura verde constante',
    pricePerM2: 25000,
    unit: 'm2',
    minQuantity: 1,
    images: [],
    category: 'cesped-natural',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: ['Alta adaptabilidad', 'Textura agradable'],
    relatedSlugs: ['cesped-esmeralda'],
    specifications: {
      Tipo: 'Césped natural',
      Presentación: 'm²',
    },
  },

  {
    id: '3',
    name: 'Césped Kavaju m²',
    slug: 'cesped-kavaju',
    description: 'Césped rústico de gran cobertura.',
    shortDescription: 'Césped resistente',
    pricePerM2: 28000,
    unit: 'm2',
    minQuantity: 1,
    images: [],
    category: 'cesped-natural',
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: ['Alta resistencia'],
    relatedSlugs: ['cesped-esmeralda'],
    specifications: {
      Tipo: 'Césped natural',
      Presentación: 'm²',
    },
  },

  {
    id: '4',
    name: 'Piso Ecológico 40x60',
    slug: 'piso-ecologico-40x60',
    description: 'Piso drenante para exteriores.',
    shortDescription: 'Piso exterior',
    pricePerM2: 85000,
    unit: 'm2',
    minQuantity: 1,
    images: [],
    category: 'pisos-exteriores',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: ['Alta durabilidad'],
    specifications: {
      Tipo: 'Piso ecológico',
    },
  },
];

// 🔥 ESTO ES LO QUE ARREGLA LAS IMÁGENES
const withImages = (product: ProductDetail): ProductDetail => ({
  ...product,
  images:
    product.images && product.images.length > 0
      ? product.images
      : [`/productos/${product.slug}.jpg`],
});

export const productsCatalog = baseProductsCatalog.map(withImages);

export const productsData: Record<string, ProductDetail> = Object.fromEntries(
  productsCatalog.map((p) => [p.slug, p])
);

// 🔥 ESTO ARREGLA LOS PRODUCTOS RELACIONADOS
export function getRelatedProducts(product: ProductDetail, limit = 4): ProductDetail[] {
  const related =
    product.relatedSlugs?.map((slug) => productsData[slug]).filter(Boolean) || [];

  if (related.length >= limit) return related.slice(0, limit);

  const fallback = productsCatalog.filter(
    (p) => p.slug !== product.slug && p.category === product.category
  );

  return [...related, ...fallback].slice(0, limit);
}