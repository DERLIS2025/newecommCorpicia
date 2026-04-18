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

function getCalculatedQuantity(product: Product, quantity: number): number {
  const safeQuantity = Math.max(quantity, product.minQuantity);

  switch (product.unit) {
    case 'm2':
      return safeQuantity;
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
    const calculatedQuantity = getCalculatedQuantity(product, quantity);
    addItem(product, calculatedQuantity);
    trackAddToBudget(product.name, calculatedQuantity);
  };

  const handleWhatsAppClick = () => {
    trackWhatsAppClick('product_detail', product.slug);
  };

  const productImages =
    product.images && product.images.length > 0 ? product.images : ['/productos/default.jpg'];

  const selectedImage = productImages[selectedImageIndex] || productImages[0];

  return (
    <div className="min-h-screen bg-[#f7faf7]">

      {/* HEADER */}
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

      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">

          {/* IMÁGENES */}
          <div className="space-y-4 lg:sticky lg:top-24">
            <Card className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
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
          </div>

          {/* INFO */}
          <div className="space-y-6">
            <Card className="rounded-2xl border border-gray-200 shadow-sm">
              <CardContent className="space-y-5 p-6">

                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-gray-600">{product.description}</p>

                <div className="text-3xl font-bold text-corpicia-green">
                  {formatPrice(currentPrice)}
                </div>

                <Button onClick={handleAddToBudget} className="w-full">
                  <ShoppingCart className="mr-2" />
                  Agregar al Presupuesto
                </Button>

                <a
                  href={getWhatsAppUrl(`Hola, quiero consultar por ${product.name}`)}
                  target="_blank"
                  onClick={handleWhatsAppClick}
                >
                  <Button variant="outline" className="w-full">
                    <Phone className="mr-2" />
                    Consultar por WhatsApp
                  </Button>
                </a>

              </CardContent>
            </Card>
          </div>

        </div>

        {/* RELACIONADOS */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-5">También te puede interesar</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {productsToShow.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <p>{item.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}