// (VERSIÓN LIMPIA Y COMPLETA – SIN CONFLICTOS)

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
    description: 'Césped de alta densidad y color intenso.',
    shortDescription: 'Césped premium',
    pricePerM2: 32000,
    unit: 'm2',
    minQuantity: 10,
    priceTiers: [
      { min: 10, max: 24, price: 36000, label: '10 a 24 m²' },
      { min: 25, max: 49, price: 34000, label: '25 a 49 m²' },
      { min: 50, max: null, price: 32000, label: '50+ m²', isPromo: true },
    ],
    images: [],
    category: 'cesped-natural',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: ['Color uniforme', 'Alta calidad'],
    relatedSlugs: ['cesped-siempre-verde', 'cesped-kavaju'],
    specifications: { Tipo: 'Césped' },
  },

  {
    id: '2',
    name: 'Césped Siempre Verde m²',
    slug: 'cesped-siempre-verde',
    description: 'Césped adaptable',
    shortDescription: 'Cobertura verde',
    pricePerM2: 30000,
    unit: 'm2',
    minQuantity: 10,
    images: [],
    category: 'cesped-natural',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: ['Alta adaptabilidad'],
    relatedSlugs: ['cesped-esmeralda'],
    specifications: { Tipo: 'Césped' },
  },

  {
    id: '3',
    name: 'Césped Kavaju m²',
    slug: 'cesped-kavaju',
    description: 'Césped resistente',
    shortDescription: 'Rústico',
    pricePerM2: 28000,
    unit: 'm2',
    minQuantity: 15,
    images: [],
    category: 'cesped-natural',
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: ['Resistente'],
    relatedSlugs: ['cesped-esmeralda'],
    specifications: { Tipo: 'Césped' },
  },

  {
    id: '4',
    name: 'Piso Ecológico 40x60',
    slug: 'piso-ecologico-40x60',
    description: 'Piso drenante',
    shortDescription: 'Exterior',
    pricePerM2: 85000,
    unit: 'm2',
    minQuantity: 1,
    images: [],
    category: 'pisos-exteriores',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: ['Durable'],
    relatedSlugs: [],
    specifications: { Tipo: 'Piso' },
  },
];

// 🔥 IMÁGENES AUTOMÁTICAS
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

// 🔥 RELACIONADOS SIN DUPLICADOS
export function getRelatedProducts(product: ProductDetail, limit = 4): ProductDetail[] {
  const unique = new Map<string, ProductDetail>();

  (product.relatedSlugs || []).forEach((slug) => {
    const p = productsData[slug];
    if (p && p.slug !== product.slug) unique.set(p.slug, p);
  });

  productsCatalog.forEach((p) => {
    if (unique.size >= limit) return;
    if (p.slug !== product.slug) unique.set(p.slug, p);
  });

  return Array.from(unique.values()).slice(0, limit);
}