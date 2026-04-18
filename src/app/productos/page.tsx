import { ProductCard } from '@/components/ProductCard';
import { Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { productsCatalog } from './[slug]/productsData';

export const metadata: Metadata = {
  title: 'Productos de césped y jardinería en Paraguay | Corpicia',
  description:
    'Catálogo de productos Corpicia: césped natural, riego, pisos y soluciones de jardinería en Paraguay.',
  alternates: {
    canonical: '/productos/',
  },
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#f8faf8]">

      {/* HEADER */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-10">
          <span className="inline-flex items-center gap-2 text-xs text-corpicia-green">
            <Sparkles size={14} />
            Catálogo Corpicia
          </span>

          <h1 className="text-3xl font-bold mt-3">
            Césped en Paraguay, riego y jardinería
          </h1>

          <p className="text-gray-600 mt-2">
            Soluciones para proyectos en Asunción y todo Paraguay
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <section>
          <p className="text-sm text-gray-500 mb-4">
            {productsCatalog.length} productos
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {productsCatalog.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

        </section>
      </div>
    </div>
  );
}
