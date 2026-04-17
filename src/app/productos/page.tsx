import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { productCategories, productsCatalog } from './[slug]/productsData';

export const metadata: Metadata = {
  title: 'Productos de césped y jardinería en Paraguay | Corpicia',
  description:
    'Catálogo de productos Corpicia: césped natural, riego, pisos, decorativos y servicios de jardinería en Asunción y todo Paraguay.',
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

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mt-4">
              Césped en Paraguay, riego, pisos y jardinería
            </h1>

            <p className="text-gray-600 mt-3">
              Soluciones reales para proyectos residenciales y comerciales en Asunción y todo Paraguay.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          <aside>
            <div className="bg-white p-5 rounded-xl border">
              <h2 className="font-bold mb-4">Filtros</h2>

              {productCategories.map((c) => (
                <label key={c.id} className="flex gap-2">
                  <input type="checkbox" />
                  {c.name}
                </label>
              ))}
            </div>
          </aside>

          <section>
            <div className="bg-white p-4 rounded-xl border mb-5 flex gap-3">
              <Input placeholder="Buscar productos..." />
              <Button>Buscar</Button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Mostrando {productsCatalog.length} productos
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
              {productsCatalog.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
