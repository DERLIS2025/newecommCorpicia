import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, Sparkles, ChevronDown } from 'lucide-react';
import type { Metadata } from 'next';
import { productCategories, productsCatalog } from './[slug]/productsData';

export const metadata: Metadata = {
  title: 'Productos de césped y jardinería en Paraguay | Corpicia',
  description: 'Catálogo de productos Corpicia: césped natural, riego, pisos, decorativos y servicios de jardinería en Asunción y todo Paraguay.',
  alternates: {
    canonical: '/productos/',
  },
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-10 md:py-12">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-corpicia-green bg-corpicia-green/10 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Catálogo Corpicia
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mt-4 tracking-tight">
              Césped en Paraguay, riego, pisos y jardinería
            </h1>
            <p className="text-gray-600 mt-3 text-base md:text-lg">
              Soluciones reales para proyectos residenciales y comerciales en Asunción y todo Paraguay.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-corpicia-green" />
                <h2 className="font-semibold text-gray-900">Filtros</h2>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Categorías</h3>
                <div className="space-y-2.5">
                  {productCategories.map((category) => (
                    <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
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

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Rango de Precio</h3>
                <div className="flex items-center gap-2">
                  <Input type="number" placeholder="Min" className="h-10 rounded-lg" />
                  <span className="text-gray-400">-</span>
                  <Input type="number" placeholder="Max" className="h-10 rounded-lg" />
                </div>
              </div>

              <Button className="w-full">Aplicar filtros</Button>
            </div>
          </aside>

          <section>
            <div className="rounded-2xl border border-gray-200 bg-white p-3 md:p-5 mb-4 md:mb-5 shadow-sm">
              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <div className="relative flex-1 max-w-xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Buscar productos..." className="pl-10 h-11 rounded-xl" />
                </div>

                <div className="relative w-full md:w-auto">
                  <select className="w-full md:min-w-[230px] h-11 px-4 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-corpicia-green/20 focus:border-corpicia-green appearance-none bg-white">
                    <option>Ordenar por: Relevancia</option>
                    <option>Precio: Menor a Mayor</option>
                    <option>Precio: Mayor a Menor</option>
                    <option>Nombre: A-Z</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-4">Mostrando {productsCatalog.length} productos</p>

            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
              {productsCatalog.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="flex justify-center mt-9">
              <div className="inline-flex gap-2 rounded-xl border border-gray-200 bg-white p-2">
                <Button variant="outline" disabled>
                  Anterior
                </Button>
                <Button variant="default" className="bg-corpicia-green hover:bg-corpicia-green-dark">
                  1
                </Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Siguiente</Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
