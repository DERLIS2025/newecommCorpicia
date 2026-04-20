// (VERSIÓN LIMPIA Y COMPLETA – SIN CONFLICTOS)

import type { Product } from '@/types';

export type ProductDetail = Product & {
  features: string[];
  specifications: Record<string, string>;
  recommendations: string[];
  relatedSlugs?: string[];
};

const baseProductsCatalog: ProductDetail[] = [
  {
    id: '1',
    name: 'Césped Esmeralda m²',
    slug: 'cesped-esmeralda',
    description:
      'Césped natural premium de alta densidad y color verde intenso, ideal para jardines residenciales y zonas decorativas que buscan una apariencia uniforme, elegante y de rápida cobertura.',
    shortDescription:
      'Césped premium de color intenso, cobertura uniforme y excelente presentación visual.',
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
    recommendations: [
      'Uso ideal en jardines frontales, patios sociales y zonas ornamentales con buen drenaje.',
      'Se recomienda instalar sobre superficie nivelada y con riego regular durante las primeras semanas.',
      'Combina muy bien con bordes en piedra, senderos ecológicos y pisos exteriores drenantes.',
      'Realiza corte de mantenimiento periódico para conservar altura pareja y color uniforme.',
    ],
  },

  {
    id: '2',
    name: 'Césped Siempre Verde m²',
    slug: 'cesped-siempre-verde',
    description:
      'Césped natural versátil y adaptable para proyectos residenciales y comerciales, diseñado para mantener una cobertura verde constante con buena respuesta en diferentes condiciones de uso.',
    shortDescription:
      'Césped adaptable con cobertura estable y apariencia verde durante todo el año.',
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
    recommendations: [
      'Ideal para áreas de tránsito moderado como zonas comunes, jardines familiares y áreas recreativas.',
      'Funciona mejor en superficies con exposición solar parcial o completa y suelo aireado.',
      'Puede combinarse con césped Esmeralda en sectores decorativos para mayor contraste visual.',
      'Riego y fertilización programada ayudan a sostener su color y densidad en el tiempo.',
    ],
  },

  {
    id: '3',
    name: 'Césped Kavaju m²',
    slug: 'cesped-kavaju',
    description:
      'Césped natural de perfil rústico y alta resistencia, recomendado para zonas exigentes que requieren una opción durable, funcional y de fácil adaptación en exteriores.',
    shortDescription:
      'Césped rústico y resistente para zonas de uso exigente y mantenimiento práctico.',
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
    recommendations: [
      'Uso recomendado en áreas amplias, fincas, jardines de alto uso y zonas con desgaste frecuente.',
      'Para mejor desempeño, instala sobre base compacta y capa de tierra fértil bien nivelada.',
      'Se complementa con pisos ecológicos en accesos para reducir barro y mejorar circulación.',
      'Mantenimiento básico con riego regular y cortes menos frecuentes según crecimiento.',
    ],
  },

  {
    id: '4',
    name: 'Piso Ecológico 40x60',
    slug: 'piso-ecologico-40x60',
    description:
      'Piso ecológico drenante 40x60 para exteriores, ideal para controlar escorrentías, mejorar seguridad al caminar y aportar un acabado funcional en terrazas, jardines y senderos.',
    shortDescription:
      'Piso drenante para exteriores con excelente funcionalidad, seguridad y fácil integración.',
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
    recommendations: [
      'Ideal para senderos de jardín, terrazas, accesos peatonales y áreas exteriores húmedas.',
      'Se recomienda instalar sobre base firme y nivelada para garantizar estabilidad y drenaje.',
      'Combina perfectamente con césped natural para crear zonas verdes funcionales y estéticas.',
      'Limpia periódicamente con agua a presión moderada para conservar textura y rendimiento.',
    ],
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
