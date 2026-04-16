import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import { getProducts, getCategories } from '@/lib/supabase';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Productos - Corpicia | Césped Natural y Jardinería',
  description: 'Descubre nuestra amplia gama de productos para jardinería. Césped natural, fertilizantes, semillas y más. Solicita tu presupuesto.',
};

// Mock data for initial development
const products = [
  {
    id: '1',
    name: 'Césped Esmeralda Premium',
    slug: 'cesped-esmeralda-premium',
    description: 'Césped de alta calidad, resistente y de rápido crecimiento. Ideal para jardines residenciales.',
    shortDescription: 'Césped premium de alta resistencia',
    pricePerM2: 31000,
    minQuantity: 10,
    images: [],
    category: 'cesped',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Césped Bermuda',
    slug: 'cesped-bermuda',
    description: 'Césped resistente a la sequía, perfecto para climas cálidos.',
    shortDescription: 'Ideal para climas cálidos',
    pricePerM2: 28000,
    minQuantity: 15,
    images: [],
    category: 'cesped',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Césped San Agustín',
    slug: 'cesped-san-agustin',
    description: 'Césped de textura fina, ideal para áreas de sombra.',
    shortDescription: 'Perfecto para áreas sombreadas',
    pricePerM2: 35000,
    minQuantity: 10,
    images: [],
    category: 'cesped',
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Fertilizante Orgánico',
    slug: 'fertilizante-organico',
    description: 'Fertilizante 100% orgánico para mantener tu césped verde y saludable.',
    shortDescription: 'Nutrición natural para tu jardín',
    pricePerM2: 15000,
    minQuantity: 5,
    images: [],
    category: 'fertilizantes',
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Fertilizante NPK 20-10-10',
    slug: 'fertilizante-npk',
    description: 'Fertilizante balanceado para crecimiento óptimo.',
    shortDescription: 'Balance nutricional completo',
    pricePerM2: 18000,
    minQuantity: 5,
    images: [],
    category: 'fertilizantes',
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Kit de Riego Automático',
    slug: 'kit-riego-automatico',
    description: 'Sistema completo de riego por aspersión para mantener tu jardín hidratado.',
    shortDescription: 'Riego eficiente y automático',
    pricePerM2: 125000,
    minQuantity: 1,
    images: [],
    category: 'insumos',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const categories = [
  { id: 'all', name: 'Todos', slug: 'all' },
  { id: 'cesped', name: 'Césped Natural', slug: 'cesped' },
  { id: 'fertilizantes', name: 'Fertilizantes', slug: 'fertilizantes' },
  { id: 'semillas', name: 'Semillas', slug: 'semillas' },
  { id: 'insumos', name: 'Insumos', slug: 'insumos' },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Nuestros Productos
          </h1>
          <p className="text-gray-500">
            Todo lo que necesitas para tu jardín
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-corpicia-green" />
                <h2 className="font-semibold">Filtros</h2>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Categorías</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-corpicia-green focus:ring-corpicia-green"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-corpicia-green transition-colors">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Rango de Precio</h3>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    className="h-10"
                  />
                  <span className="text-gray-400">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    className="h-10"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Buscar productos..."
                  className="pl-10 h-12"
                />
              </div>
              <select className="h-12 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-corpicia-green focus:border-transparent">
                <option>Ordenar por: Relevancia</option>
                <option>Precio: Menor a Mayor</option>
                <option>Precio: Mayor a Menor</option>
                <option>Nombre: A-Z</option>
              </select>
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-500 mb-4">
              Mostrando {products.length} productos
            </p>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                <Button variant="outline" disabled>
                  Anterior
                </Button>
                <Button variant="default" className="bg-corpicia-green">
                  1
                </Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
