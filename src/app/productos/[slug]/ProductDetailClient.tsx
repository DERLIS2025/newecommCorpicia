'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Phone, Shield, ShoppingCart, Truck } from 'lucide-react';

import { QuantitySelector } from '@/components/QuantitySelector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { trackAddToBudget, trackProductView, trackWhatsAppClick } from '@/lib/tracking';
import { formatPrice, formatUnit, getPriceForQuantity, getWhatsAppUrl } from '@/lib/utils';
import { useBudgetStore } from '@/store/budgetStore';
import type { Product } from '@/types';

import { getRelatedProducts, productsData } from './productsData';

type ProductDetailClientProps = {
  slug: string;
};

function getCalculatedQuantity(product: Product, quantity: number): number {
  const safeQuantity = Math.max(quantity, product.minQuantity);

  switch (product.unit) {
    case 'm2':
      return safeQuantity;
    case 'docena':
      return safeQuantity * 12;
    case 'visita':
    case 'servicio':
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    trackProductView(product.name, product.slug);
  }, [product.name, product.slug]);

  const safeQuantity = Math.max(quantity, product.minQuantity);

  const { unitPrice, totalPrice, activeTier } = useMemo(
    () => getPriceForQuantity(product, quantity),
    [product, quantity]
  );

  const promoTier = useMemo(
    () => product.priceTiers?.find((tier) => tier.isPromo),
    [product.priceTiers]
  );

  const missingForPromo = useMemo(() => {
    if (!promoTier) return 0;
    return Math.max(0, promoTier.min - safeQuantity);
  }, [promoTier, safeQuantity]);

  const productsToShow = useMemo(() => getRelatedProducts(product, 4), [product]);

  const productImages =
    product.images && product.images.length > 0 ? product.images : ['/productos/default.jpg'];

  const selectedImage = productImages[selectedImageIndex] || productImages[0];

  const handleAddToBudget = () => {
    const calculatedQuantity = getCalculatedQuantity(product, quantity);
    addItem(product, calculatedQuantity);
    trackAddToBudget(product.name, calculatedQuantity);
  };

  const handleWhatsAppClick = () => {
    trackWhatsAppClick('product_detail', product.slug);
  };

  return (
    <div className="min-h-screen bg-[#f7faf7]">
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/productos/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-corpicia-green"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a productos
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-10 lg:py-12">
        <section className="grid xl:grid-cols-[1.35fr_1fr] gap-8 lg:gap-10 xl:gap-12 items-start">
          <div className="space-y-4">
            <Card className="overflow-hidden border border-gray-200 shadow-sm rounded-2xl">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <Image
                    src={selectedImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative overflow-hidden rounded-xl border ${
                      selectedImageIndex === index
                        ? 'border-corpicia-green ring-2 ring-corpicia-green/20'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <Card className="border border-gray-200 rounded-2xl shadow-sm">
              <CardContent className="p-6 md:p-7 space-y-5">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="capitalize bg-gray-100 text-gray-700">
                    {product.category.replace('-', ' ')}
                  </Badge>
                  {product.isFeatured && (
                    <Badge className="bg-corpicia-green text-white">Destacado</Badge>
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  <p className="mt-3 text-gray-600">{product.description}</p>
                </div>

                <Card className="border-corpicia-green/20 bg-corpicia-green/[0.04] rounded-xl shadow-none">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-end gap-2 border-b border-corpicia-green/20 pb-3">
                      <span className="text-3xl font-bold text-corpicia-green">
                        {formatPrice(unitPrice)}
                      </span>
                      <span className="text-gray-500 pb-1">/ {formatUnit(product.unit)}</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Cantidad ({formatUnit(product.unit)}) - Mínimo: {product.minQuantity}{' '}
                        {formatUnit(product.unit)}
                      </label>
                      <QuantitySelector
                        quantity={quantity}
                        minQuantity={product.minQuantity}
                        onChange={setQuantity}
                      />
                    </div>

                    <div className="pt-4 border-t border-corpicia-green/20 space-y-3">
                      {product.priceTiers && product.priceTiers.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Precios por volumen</p>
                          <div className="rounded-lg border border-gray-200 overflow-hidden">
                            {product.priceTiers.map((tier) => {
                              const isActiveTier = activeTier?.label === tier.label;
                              return (
                                <div
                                  key={tier.label}
                                  className={`px-3 py-2 text-sm flex items-center justify-between border-b last:border-b-0 ${
                                    isActiveTier
                                      ? 'bg-corpicia-green/10 border-corpicia-green/20'
                                      : 'bg-white'
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

                          {promoTier && missingForPromo > 0 && (
                            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                              Te faltan {missingForPromo} {formatUnit(product.unit)} para acceder al
                              precio promo.
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Precio estimado:</span>
                        <span className="text-2xl font-bold text-corpicia-green">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>

                      <Button
                        onClick={handleAddToBudget}
                        className="w-full h-12 gap-2 text-base"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Agregar al Presupuesto
                      </Button>

                      <a
                        href={getWhatsAppUrl(`Hola, quiero consultar por ${product.name}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                        onClick={handleWhatsAppClick}
                      >
                        <Button
                          variant="outline"
                          className="w-full h-12 gap-2 border-corpicia-green/30 text-corpicia-green hover:bg-corpicia-green/5"
                        >
                          <Phone className="w-5 h-5" />
                          Consultar por WhatsApp
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 rounded-2xl shadow-sm">
              <CardContent className="p-5">
                <h2 className="font-semibold text-gray-900 mb-3">Características</h2>
                <ul className="space-y-2">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-corpicia-green flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 rounded-2xl shadow-sm">
              <CardContent className="p-5">
                <h2 className="font-semibold text-gray-900 mb-3">Especificaciones</h2>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <span className="text-xs text-gray-500 uppercase">{key}</span>
                      <p className="font-medium text-gray-900 text-sm">{value as string}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 rounded-2xl shadow-sm">
              <CardContent className="p-5">
                <h2 className="font-semibold text-gray-900 mb-4">
                  Beneficios de comprar en Corpicia
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-gray-100 p-4 text-center bg-gray-50">
                    <Truck className="w-6 h-6 text-corpicia-green mx-auto mb-2" />
                    <p className="text-sm text-gray-700">Envío a domicilio</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 p-4 text-center bg-gray-50">
                    <Shield className="w-6 h-6 text-corpicia-green mx-auto mb-2" />
                    <p className="text-sm text-gray-700">Garantía de calidad</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 p-4 text-center bg-gray-50">
                    <Phone className="w-6 h-6 text-corpicia-green mx-auto mb-2" />
                    <p className="text-sm text-gray-700">Soporte personalizado</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-14 md:mt-16 pt-8 border-t border-gray-200/80">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">
            También te puede interesar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {productsToShow.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}