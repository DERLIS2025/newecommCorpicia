'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatUnit, getPriceForQuantity, getWhatsAppUrl } from '@/lib/utils';
import { trackAddToBudget, trackProductView, trackWhatsAppClick } from '@/lib/tracking';
import { useBudgetStore } from '@/store/budgetStore';
import { productsData } from './productsData';
import { ProductCard } from '@/components/ProductCard';
import { CheckCircle2, Truck, ShieldCheck } from 'lucide-react';
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  const productImages = product.images && product.images.length > 0 ? product.images : [''];
  const selectedImage = productImages[selectedImageIndex] || productImages[0];
  const relatedProducts = Object.values(productsData)
    .filter((item) => item.slug !== product.slug && item.category === product.category)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#f8faf8]">
      <section className="border-b">
        <div className="container mx-auto px-4 py-8 md:py-10">
          <Link
            href="/productos/"
            className="text-sm text-corpicia-green font-medium"
          >
            ← Volver a productos
          </Link>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_1fr] lg:items-start">
            {/* GALERÍA */}
            <div className="space-y-3">
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden min-h-[320px]">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-full min-h-[320px] object-cover"
                  />
                ) : (
                  <div className="min-h-[320px] flex items-center justify-center bg-gray-50">
                    <span className="text-gray-400">Imagen del producto</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {productImages.slice(0, 4).map((image, index) => (
                  <button
                    key={`${product.slug}-${index}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`rounded-xl border overflow-hidden h-20 bg-white ${selectedImageIndex === index ? 'border-corpicia-green ring-2 ring-corpicia-green/20' : 'border-gray-200'}`}
                  >
                    {image ? (
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Sin imagen</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CARD DE COMPRA */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 md:p-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-corpicia-green/10 text-corpicia-green border-0">
                  {product.category}
                </Badge>
                {product.isFeatured && (
                  <Badge className="bg-amber-500 text-white border-0">Destacado</Badge>
                )}
                {isPromo && (
                  <Badge className="bg-red-500 text-white border-0">PROMO</Badge>
                )}
              </div>

              <h1 className="mt-3 text-2xl md:text-3xl font-bold text-gray-900">
                {product.name}
              </h1>

              <p className="mt-3 text-gray-600">
                {product.description}
              </p>

              <div className="mt-5">
                <div className="flex items-end gap-2 flex-wrap">
                  <p className="text-3xl font-bold text-corpicia-green">
                    {formatPrice(currentPrice)}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">/ {formatUnit(product.unit)}</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">Mínimo: {product.minQuantity}</p>
              </div>

              <div className="mt-4 space-y-3">
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
                      <div className="rounded-xl border border-gray-200 overflow-hidden">
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
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    Te faltan {missingForPromo} m² para acceder al precio promo. Ahorrarías {formatPrice(promoSavingsIfReached)} en este pedido.
                  </div>
                )}

                <input
                  type="number"
                  min={product.minQuantity}
                  value={quantity}
                  onChange={(event) => setQuantity(Number(event.target.value) || product.minQuantity)}
                  className="h-11 w-full max-w-[220px] px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-corpicia-green/20 focus:border-corpicia-green"
                  aria-label={product.unit === 'm2' ? 'Metros cuadrados' : 'Cantidad'}
                />

                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    Precio unitario: <span className="font-semibold text-corpicia-green">{formatPrice(currentPrice)}</span>
                  </p>
                  {volumeSavings > 0 && (
                    <p>
                      Ahorro por volumen: <span className="font-semibold text-corpicia-green">{formatPrice(volumeSavings)}</span>
                    </p>
                  )}
                  <p>
                    Precio estimado: <span className="font-semibold text-corpicia-green">{formatPrice(estimatedPrice)}</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
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
            </div>
          </div>

          {/* CARACTERÍSTICAS + ESPECIFICACIONES */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {product.features?.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 md:p-6">
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
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 md:p-6">
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

          {/* BENEFICIOS */}
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm p-5 md:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Beneficios</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-corpicia-green mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Calidad garantizada</p>
                  <p className="text-sm text-gray-600">Productos seleccionados para alto rendimiento.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-corpicia-green mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Cobertura nacional</p>
                  <p className="text-sm text-gray-600">Envíos y atención en todo Paraguay.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-corpicia-green mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Asesoría experta</p>
                  <p className="text-sm text-gray-600">Te ayudamos a elegir la mejor solución.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RELACIONADOS */}
          {relatedProducts.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Productos relacionados</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((related) => (
                  <ProductCard key={related.id} product={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
