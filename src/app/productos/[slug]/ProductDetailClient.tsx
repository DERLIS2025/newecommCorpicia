'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Leaf, Phone, Shield, ShoppingCart, Truck } from 'lucide-react';

import { QuantitySelector } from '@/components/QuantitySelector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trackAddToBudget, trackProductView, trackWhatsAppClick } from '@/lib/tracking';
import { formatPrice, formatUnit, getPriceForQuantity, getWhatsAppUrl } from '@/lib/utils';
import { useBudgetStore } from '@/store/budgetStore';
import type { Product } from '@/types';

import { productsCatalog, productsData } from './productsData';

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

  const relatedProducts = useMemo(
    () =>
      productsCatalog
        .filter((item) => item.slug !== product.slug && item.category === product.category)
        .slice(0, 4),
    [product.category, product.slug]
  );

  const fallbackRelated = useMemo(
    () => productsCatalog.filter((item) => item.slug !== product.slug).slice(0, 4),
    [product.slug]
  );

  const productsToShow = relatedProducts.length > 0 ? relatedProducts : fallbackRelated;

  const handleAddToBudget = () => {
    const calculatedQuantity = getCalculatedQuantity(product, quantity, quantity);
    addItem(product, calculatedQuantity);
    trackAddToBudget(product.name, calculatedQuantity);
  };

  const handleWhatsAppClick = () => {
    trackWhatsAppClick('product_detail', product.slug);
  };

  const productImages =
    product.images && product.images.length > 0 ? product.images : ['/productos/default.jpg'];

  return (
    <div className="min-h-screen bg-[#f7faf7]">
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/productos/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-corpicia-green"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a productos
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          <div className="space-y-4 lg:sticky lg:top-24">
            <Card className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
              <CardContent className="p-0">
                <div className="relative aspect-square bg-gradient-to-br from-[#edf8ef] to-white">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={productImages[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="px-6 text-center">
                        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-corpicia-green/10">
                          <Leaf className="h-12 w-12 text-corpicia-green" />
                        </div>
                        <p className="text-gray-500">Imagen del producto</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-4 gap-2">
              {productImages.slice(0, 4).map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  type="button"
                  className="aspect-square overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-corpicia-green/30 hover:shadow-sm"
                >
                  <div className="relative h-full w-full">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Leaf className="h-5 w-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="rounded-2xl border border-gray-200 shadow-sm">
              <CardContent className="space-y-5 p-6 md:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="capitalize bg-gray-100 text-gray-700">
                    {product.category.replace('-', ' ')}
                  </Badge>
                  {product.isFeatured && (
                    <Badge className="bg-corpicia-green text-white">Destacado</Badge>
                  )}
                  {isPromo && <Badge className="bg-red-500 text-white">PROMO</Badge>}
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                    {product.name}
                  </h1>
                  <p className="mt-3 leading-relaxed text-gray-600">{product.description}</p>
                </div>

                <Card className="rounded-xl border-corpicia-green/20 bg-corpicia-green/[0.04] shadow-none">
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-end gap-2 border-b border-corpicia-green/20 pb-3">
                      <span className="text-3xl font-bold text-corpicia-green">
                        {formatPrice(currentPrice)}
                      </span>
                      <span className="pb-1 text-gray-500">/ {formatUnit(product.unit)}</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Cantidad ({formatUnit(product.unit)}) - Mínimo: {product.minQuantity}{' '}
                        {formatUnit(product.unit)}
                      </label>

                      {product.unit === 'm2' ? (
                        <QuantitySelector
                          quantity={quantity}
                          minQuantity={product.minQuantity}
                          onChange={setQuantity}
                        />
                      ) : (
                        <input
                          type="number"
                          min={product.minQuantity}
                          value={quantity}
                          onChange={(event) =>
                            setQuantity(Number(event.target.value) || product.minQuantity)
                          }
                          className="h-10 w-full rounded-lg border border-gray-200 px-3 focus:border-corpicia-green focus:outline-none focus:ring-2 focus:ring-corpicia-green/20"
                          aria-label={product.unit === 'm2' ? 'Metros cuadrados' : 'Cantidad'}
                        />
                      )}
                    </div>

                    {product.priceTiers && product.priceTiers.length > 0 && (
                      <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
                        <button
                          type="button"
                          onClick={() => setShowPriceTiers((prev) => !prev)}
                          className="text-sm font-medium text-corpicia-green hover:underline"
                        >
                          {showPriceTiers ? 'Ocultar precios por volumen' : 'Ver precios por volumen'}
                        </button>

                        {showPriceTiers && (
                          <div className="overflow-hidden rounded-lg border border-gray-200">
                            {product.priceTiers.map((tier) => {
                              const isActiveTier = currentTier?.label === tier.label;

                              return (
                                <div
                                  key={tier.label}
                                  className={`flex items-center justify-between px-3 py-2 text-sm ${
                                    isActiveTier
                                      ? 'border-corpicia-green/30 bg-corpicia-green/10'
                                      : 'border-b bg-white last:border-b-0'
                                  }`}
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

                        {!isPromo && missingForPromo > 0 && promoTier && (
                          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                            Te faltan {missingForPromo} m² para acceder al precio promo.
                            Ahorrarías {formatPrice(promoSavingsIfReached)} en este pedido.
                          </div>
                        )}

                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            Precio unitario:{' '}
                            <span className="font-semibold text-corpicia-green">
                              {formatPrice(currentPrice)}
                            </span>
                          </p>

                          {volumeSavings > 0 && (
                            <p>
                              Ahorro por volumen:{' '}
                              <span className="font-semibold text-corpicia-green">
                                {formatPrice(volumeSavings)}
                              </span>
                            </p>
                          )}

                          <p>
                            Precio estimado:{' '}
                            <span className="font-semibold text-corpicia-green">
                              {formatPrice(estimatedPrice)}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

                    {(!product.priceTiers || product.priceTiers.length === 0) && (
                      <div className="space-y-1 border-t border-corpicia-green/20 pt-4 text-sm text-gray-600">
                        <p>
                          Precio unitario:{' '}
                          <span className="font-semibold text-corpicia-green">
                            {formatPrice(currentPrice)}
                          </span>
                        </p>
                        <p>
                          Precio estimado:{' '}
                          <span className="font-semibold text-corpicia-green">
                            {formatPrice(estimatedPrice)}
                          </span>
                        </p>
                      </div>
                    )}

                    <div className="space-y-3 border-t border-corpicia-green/20 pt-4">
                      <Button onClick={handleAddToBudget} className="h-12 w-full gap-2 text-base">
                        <ShoppingCart className="h-5 w-5" />
                        Agregar al Presupuesto
                      </Button>

                      <a
                        href={getWhatsAppUrl(`Hola, quiero consultar por ${product.name}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                        onClick={handleWhatsAppClick}
                      >
                        <Button
                          variant="outline"
                          className="h-12 w-full gap-2 border-corpicia-green/30 text-corpicia-green hover:bg-corpicia-green/5"
                        >
                          <Phone className="h-5 w-5" />
                          Consultar por WhatsApp
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {product.features?.length > 0 && (
              <Card className="rounded-2xl border border-gray-200 shadow-sm">
                <CardContent className="p-5">
                  <h2 className="mb-3 font-semibold text-gray-900">Características</h2>
                  <ul className="space-y-2">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-corpicia-green" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <Card className="rounded-2xl border border-gray-200 shadow-sm">
                <CardContent className="p-5">
                  <h2 className="mb-3 font-semibold text-gray-900">Especificaciones</h2>
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                      >
                        <span className="text-xs uppercase text-gray-500">{key}</span>
                        <p className="text-sm font-medium text-gray-900">{value as string}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="rounded-2xl border border-gray-200 shadow-sm">
              <CardContent className="p-5">
                <h2 className="mb-4 font-semibold text-gray-900">
                  Beneficios de comprar en Corpicia
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
                    <Truck className="mx-auto mb-2 h-6 w-6 text-corpicia-green" />
                    <p className="text-sm text-gray-700">Envío a domicilio</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
                    <Shield className="mx-auto mb-2 h-6 w-6 text-corpicia-green" />
                    <p className="text-sm text-gray-700">Garantía de calidad</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
                    <Phone className="mx-auto mb-2 h-6 w-6 text-corpicia-green" />
                    <p className="text-sm text-gray-700">Soporte personalizado</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 md:mt-14">
          <h2 className="mb-5 text-2xl font-bold text-gray-900 md:text-3xl">
            También te puede interesar
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productsToShow.map((item) => (
              <Card
                key={item.id}
                className="rounded-2xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="space-y-3 p-4">
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 text-gray-300">
                    {item.images && item.images.length > 0 ? (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Leaf className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold leading-snug text-gray-900">{item.name}</p>
                    <p className="mt-1 font-bold text-corpicia-green">
                      {formatPrice(item.pricePerM2)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/productos/${item.slug}/`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Ver
                      </Button>
                    </Link>

                    <Button
                      onClick={() => {
                        const calculatedQuantity = getCalculatedQuantity(
                          item,
                          item.minQuantity,
                          item.minQuantity
                        );
                        trackAddToBudget(item.name, calculatedQuantity);
                        addItem(item, calculatedQuantity);
                      }}
                      className="flex-1"
                    >
                      Agregar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}