'use client';

import { useMemo, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles } from 'lucide-react';
import type { ProductDetail } from './[slug]/productsData';

type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

type ProductsClientProps = {
  products: ProductDetail[];
  categories: ProductCategory[];
  initialQuery?: string;
};

export default function ProductsClient({
  products,
  categories,
  initialQuery = '',
}: ProductsClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);

  const toggleCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      setSelectedCategories(['all']);
      return;
    }

    setSelectedCategories((current) => {
      const withoutAll = current.filter((item) => item !== 'all');
      if (withoutAll.includes(categoryId)) {
        const next = withoutAll.filter((item) => item !== categoryId);
        return next.length > 0 ? next : ['all'];
      }
      return [...withoutAll, categoryId];
    });
  };

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const hasCategoryFilter = !selectedCategories.includes('all');

    return products.filter((product) => {
      const matchesCategory = !hasCategoryFilter || selectedCategories.includes(product.category);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [products, query, selectedCategories]);

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

              <div className="space-y-2">
                {categories.map((c) => (
                  <label key={c.id} className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(c.id)}
                      onChange={() => toggleCategory(c.id)}
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <section>
            <div className="bg-white p-4 rounded-xl border mb-5 flex gap-3">
              <Input
                placeholder="Buscar productos..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Button type="button" onClick={() => setQuery(query.trim())}>Buscar</Button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Mostrando {filteredProducts.length} productos
            </p>

            {filteredProducts.length === 0 ? (
              <div className="bg-white border rounded-xl p-6 text-center text-gray-600">
                No encontramos productos para tu búsqueda.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
