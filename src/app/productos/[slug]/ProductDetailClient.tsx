'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatPrice, formatUnit, getWhatsAppUrl } from '@/lib/utils';
import { trackAddToBudget, trackProductView, trackWhatsAppClick } from '@/lib/tracking';
import { useBudgetStore } from '@/store/budgetStore';
import { productsData } from './productsData';
import type { Product } from '@/types';

type ProductDetailClientProps = {
  slug: string;
};

function getCalculatedQuantity(product: Product, quantity: number, areaM2: number): number {
  const safeQuantity = Math.max(quantity, product.minQuantity);
  const safeArea = Math.max(areaM2, product.minQuantity);

  switch (product.unit) {
    case 'm2':
      return safeArea;
    case 'docena':
      return safeQuantity * 12;
    case 'servicio':
    case 'visita':
      return 1;
    case 'unidad':
    default:
      return safeQuantity;
  }
}

function getEstimatedTotal(product: Product, quantity: number, areaM2: number): number {
  const calculatedQuantity = getCalculatedQuantity(product, quantity, areaM2);
  return product.pricePerM2 * calculatedQuantity;
}

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const product = productsData[slug];
  const addItem = useBudgetStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(product.minQuantity);
  const [areaM2, setAreaM2] = useState(product.minQuantity);

  useEffect(() => {
    trackProductView(product.name, product.slug);
  }, [product.name, product.slug]);

  const estimatedTotal = useMemo(
    () => getEstimatedTotal(product, quantity, areaM2),
    [product, quantity, areaM2]
  );

  const handleAddToBudget = () => {
    const calculatedQuantity = getCalculatedQuantity(product, quantity, areaM2);
    addItem(product, calculatedQuantity);
    trackAddToBudget(product.name, calculatedQuantity);
  };

  const handleWhatsAppClick = () => {
    trackWhatsAppClick('product_detail', product.slug);
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b bg-[#f8faf8]">
        <div className="container mx-auto px-4 py-10">
          <Link
            href="/productos/"
            className="text-sm text-corpicia-green font-medium"
          >
            ← Volver a productos
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div className="rounded-2xl border bg-gray-50 min-h-[320px] flex items-center justify-center">
              <span className="text-gray-400">Imagen del producto</span>
            </div>

            <div>
              <p className="text-sm font-medium text-corpicia-green uppercase tracking-wide">
                {product.category}
              </p>

              <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>

              <p className="mt-4 text-gray-600">
                {product.description}
              </p>

              <div className="mt-6">
                <p className="text-3xl font-bold text-corpicia-green">
                  {formatPrice(product.pricePerM2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Unidad: {formatUnit(product.unit)}
                </p>
                <p className="text-sm text-gray-500">
                  Mínimo: {product.minQuantity}
                </p>
                <div className="mt-4 space-y-2">
                  {product.unit === 'm2' ? (
                    <input
                      type="number"
                      min={product.minQuantity}
                      value={areaM2}
                      onChange={(event) => setAreaM2(Number(event.target.value) || product.minQuantity)}
                      className="h-10 w-full max-w-[220px] px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-corpicia-green/20 focus:border-corpicia-green"
                      aria-label="Metros cuadrados"
                    />
                  ) : (
                    <input
                      type="number"
                      min={product.minQuantity}
                      value={quantity}
                      onChange={(event) => setQuantity(Number(event.target.value) || product.minQuantity)}
                      className="h-10 w-full max-w-[220px] px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-corpicia-green/20 focus:border-corpicia-green"
                      aria-label="Cantidad"
                    />
                  )}
                  <p className="text-sm text-gray-500">
                    Total estimado: <span className="font-semibold text-corpicia-green">{formatPrice(estimatedTotal)}</span>
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={handleAddToBudget}>
                  Agregar al presupuesto
                </Button>

                <a
                  href={getWhatsAppUrl(`Hola, quiero consultar por ${product.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                >
                  <Button variant="outline">
                    Consultar por WhatsApp
                  </Button>
                </a>
              </div>

              {product.features?.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Características
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    {product.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Especificaciones
                  </h2>
                  <div className="rounded-xl border overflow-hidden">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="grid grid-cols-2 border-b last:border-b-0"
                      >
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-700">
                          {key}
                        </div>
                        <div className="px-4 py-3 text-gray-600">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
