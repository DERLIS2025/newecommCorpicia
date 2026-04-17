'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuantitySelector } from '@/components/QuantitySelector';
import { useBudgetStore } from '@/store/budgetStore';
import { formatPrice, formatUnit, getWhatsAppUrl } from '@/lib/utils';
import { trackAddToBudget, trackProductView, trackWhatsAppClick } from '@/lib/tracking';
import { Check, ArrowLeft, ShoppingCart, Phone, Leaf, Truck, Shield } from 'lucide-react';
import { productsCatalog, productsData } from './productsData';

type ProductDetailClientProps = {
  slug: string;
};

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const product = productsData[slug];

  const [quantity, setQuantity] = useState(product.minQuantity);
  const addItem = useBudgetStore((state) => state.addItem);

  useEffect(() => {
    trackProductView(product.name, product.slug);
  }, [product.name, product.slug]);

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
    trackAddToBudget(product.name, quantity);
    addItem(product, quantity);
  };

  const estimatedPrice = product.pricePerM2 * quantity;

  return (
    <div className="min-h-screen bg-[#f7faf7]">
      <div className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/productos/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-corpicia-green transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a productos
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-10 items-start">
          <div className="space-y-4 lg:sticky lg:top-24">
            <Card className="overflow-hidden border border-gray-200 shadow-sm rounded-2xl">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-[#edf8ef] to-white flex items-center justify-center">
                  <div className="text-center px-6">
                    <div className="w-24 h-24 bg-corpicia-green/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Leaf className="w-12 h-12 text-corpicia-green" />
                    </div>
                    <p className="text-gray-500">Imagen del producto</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  className="aspect-square rounded-xl border border-gray-200 bg-white hover:border-corpicia-green/30 hover:shadow-sm transition-all"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-gray-300" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
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
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    {product.name}
                  </h1>
                  <p className="text-gray-600 leading-relaxed mt-3">{product.description}</p>
                </div>

                <Card className="border-corpicia-green/20 bg-corpicia-green/[0.04] rounded-xl shadow-none">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-end gap-2 border-b border-corpicia-green/20 pb-3">
                      <span className="text-3xl font-bold text-corpicia-green">
                        {formatPrice(product.pricePerM2)}
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
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Precio estimado:</span>
                        <span className="text-2xl font-bold text-corpicia-green">
                          {formatPrice(estimatedPrice)}
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
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                        onClick={() => trackWhatsAppClick('product_detail', product.slug)}
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

            <div className="grid md:grid-cols-2 gap-4">
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
            </div>

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
        </div>

        <section className="mt-12 md:mt-14">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">
            También te puede interesar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {productsToShow.map((item) => (
              <Card
                key={item.id}
                className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center text-gray-300">
                    <Leaf className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 leading-snug">{item.name}</p>
                    <p className="text-corpicia-green font-bold mt-1">
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
                        trackAddToBudget(item.name, item.minQuantity);
                        addItem(item, item.minQuantity);
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
