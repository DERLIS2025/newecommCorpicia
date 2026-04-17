'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatUnit, getPriceForQuantity, getWhatsAppUrl } from '@/lib/utils';
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

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const product = productsData[slug];
  const addItem = useBudgetStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(product.minQuantity);
  const [showPriceTiers, setShowPriceTiers] = useState(false);

  useEffect(() => {
    trackProductView(product.name, product.slug);
  }, [product.name, product.slug]);

  const { price: currentPrice, tier: currentTier, isPromo } = useMemo(() => {
    return getPriceForQuantity(quantity, product.priceTiers, product.pricePerM2);
  }, [quantity, product.priceTiers, product.pricePerM2]);

  const estimatedPrice = useMemo(
    () => currentPrice * Math.max(quantity, product.minQuantity),
    [currentPrice, quantity, product.minQuantity]
  );

  const highestTierPrice = product.priceTiers?.[0]?.price || product.pricePerM2;
  const promoTier = product.priceTiers?.find((tier) => tier.isPromo);
  const volumeSavings = useMemo(
    () => Math.max(0, (highestTierPrice - currentPrice) * Math.max(quantity, product.minQuantity)),
    [highestTierPrice, currentPrice, quantity, product.minQuantity]
  );

  const missingForPromo = useMemo(
    () => (promoTier ? Math.max(0, promoTier.min - Math.max(quantity, product.minQuantity)) : 0),
    [promoTier, quantity, product.minQuantity]
  );

  const promoSavingsIfReached = useMemo(() => {
    if (!promoTier || isPromo) return 0;
    return Math.max(0, (currentPrice - promoTier.price) * Math.max(quantity, product.minQuantity));
  }, [promoTier, isPromo, currentPrice, quantity, product.minQuantity]);

  const handleAddToBudget = () => {
    const calculatedQuantity = getCalculatedQuantity(product, quantity, quantity);
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
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-3xl font-bold text-corpicia-green">
                    {formatPrice(currentPrice)}
                  </p>
                  {isPromo && (
                    <Badge className="bg-red-500 text-white">
                      PROMO
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Unidad: {formatUnit(product.unit)}
                </p>
                <p className="text-sm text-gray-500">
                  Mínimo: {product.minQuantity}
                </p>
                <div className="mt-4 space-y-2">
                  <input
                    type="number"
                    min={product.minQuantity}
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value) || product.minQuantity)}
                    className="h-10 w-full max-w-[220px] px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-corpicia-green/20 focus:border-corpicia-green"
                    aria-label={product.unit === 'm2' ? 'Metros cuadrados' : 'Cantidad'}
                  />
                  {product.priceTiers && product.priceTiers.length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowPriceTiers((prev) => !prev)}
                        className="text-sm text-corpicia-green font-medium hover:underline"
                      >
                        {showPriceTiers ? 'Ocultar precios por volumen' : 'Ver precios por volumen'}
                      </button>

                      {showPriceTiers && (
                        <div className="rounded-lg border border-gray-200 overflow-hidden">
                          {product.priceTiers.map((tier) => {
                            const isActiveTier = currentTier?.label === tier.label;
                            return (
                              <div
                                key={tier.label}
                                className={`flex items-center justify-between px-3 py-2 text-sm ${isActiveTier ? 'bg-corpicia-green/10 border border-corpicia-green/30' : 'bg-white border-b last:border-b-0'}`}
                              >
                                <span>{tier.label}</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">{formatPrice(tier.price)}</span>
                                  {tier.isPromo && (
                                    <Badge className="bg-red-500 text-white">PROMO</Badge>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                  {product.priceTiers && product.priceTiers.length > 0 && !isPromo && missingForPromo > 0 && promoTier && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                      Te faltan {missingForPromo} m² para acceder al precio promo. Ahorrarías {formatPrice(promoSavingsIfReached)} en este pedido.
                    </div>
                  )}
                  <p className="text-sm text-gray-500">
                    Precio unitario: <span className="font-semibold text-corpicia-green">{formatPrice(currentPrice)}</span>
                  </p>
                  {volumeSavings > 0 && (
                    <p className="text-sm text-gray-500">
                      Ahorro por volumen: <span className="font-semibold text-corpicia-green">{formatPrice(volumeSavings)}</span>
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Precio estimado: <span className="font-semibold text-corpicia-green">{formatPrice(estimatedPrice)}</span>
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
