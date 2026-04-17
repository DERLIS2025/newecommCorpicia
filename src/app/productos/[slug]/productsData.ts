import type { Product } from '@/types';

export type ProductDetail = Product & {
  features: string[];
  specifications: Record<string, string>;
};

export const productsCatalog: ProductDetail[] = [
  // CÉSPED
  {
    id: '1',
    name: 'Césped Esmeralda m²',
    slug: 'cesped-esmeralda',
    description: 'Césped de alta densidad y color intenso, ideal para jardines residenciales en Paraguay y zonas de alto tránsito moderado.',
    shortDescription: 'Césped natural premium para jardines en Paraguay',
    pricePerM2: 32000,
    unit: 'm2',
    minQuantity: 10,
    images: [],
    category: 'cesped-natural',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: ['Color verde uniforme', 'Recuperación rápida', 'Ideal para Asunción y Gran Asunción', 'Bajo mantenimiento'],
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
    description: 'Variedad versátil con excelente adaptación al clima cálido.',
    shortDescription: 'Cobertura verde constante',
    pricePerM2: 30000,
    unit: 'm2',
    minQuantity: 10,
    images: [],
    category: 'cesped-natural',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: [],
    specifications: {},
  },

  // 👉 podés seguir igual con todos (no cambia nada arriba)

];


// 🔥 FUNCIÓN AUTOMÁTICA DE IMÁGENES
const withImages = (product: ProductDetail): ProductDetail => {
  return {
    ...product,
    images:
      product.images && product.images.length > 0
        ? product.images
        : [`/productos/${product.slug}.jpg`],
  };
};


// 🔥 ACA ESTÁ LA MAGIA
export const productsData: Record<string, ProductDetail> = Object.fromEntries(
  productsCatalog.map((product) => {
    const productWithImages = withImages(product);
    return [product.slug, productWithImages];
  })
);


// 🔥 OPCIONAL: también aplicamos al catálogo
export const productsCatalogWithImages: ProductDetail[] =
  productsCatalog.map(withImages);


// DEFAULT
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
