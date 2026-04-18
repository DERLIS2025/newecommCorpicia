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

type Props = { slug: string };

function getCalculatedQuantity(product: Product, quantity: number) {
  const safe = Math.max(quantity, product.minQuantity);
  if (product.unit === 'docena') return safe * 12;
  if (product.unit === 'visita' || product.unit === 'servicio') return 1;
  return safe;
}

export default function ProductDetailClient({ slug }: Props) {
  const product = productsData[slug];
  const addItem = useBudgetStore((s) => s.addItem);

  const [quantity, setQuantity] = useState(product.minQuantity);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    trackProductView(product.name, product.slug);
  }, [product]);

  const safeQuantity = Math.max(quantity, product.minQuantity);

  const { unitPrice, totalPrice, activeTier } = useMemo(
    () => getPriceForQuantity(product, quantity),
    [product, quantity]
  );

  const promoTier = product.priceTiers?.find((t) => t.isPromo);
  const missingForPromo = promoTier ? Math.max(0, promoTier.min - safeQuantity) : 0;

  const related = getRelatedProducts(product, 4);

  const images =
    product.images?.length > 0 ? product.images : ['/productos/default.jpg'];

  const selectedImage = images[selectedImageIndex];

  const handleAdd = () => {
    addItem(product, getCalculatedQuantity(product, quantity));
    trackAddToBudget(product.name, quantity);
  };

  return (
    <div className="bg-[#f7faf7] min-h-screen">
      <div className="container mx-auto px-4 py-10">

        <Link href="/productos" className="flex items-center gap-2 mb-6 text-sm">
          <ArrowLeft size={16} /> Volver
        </Link>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10">

          {/* GALERÍA */}
          <div>
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white">
              <Image src={selectedImage} alt={product.name} fill className="object-cover" />
            </div>

            <div className="grid grid-cols-4 gap-2 mt-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImageIndex(i)}>
                  <div className="relative aspect-square">
                    <Image src={img} alt="" fill className="object-cover rounded" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div>

            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-600 mt-2">{product.description}</p>

            <div className="mt-6 border rounded-xl p-5 bg-white space-y-4">

              <div className="text-3xl font-bold text-green-600">
                {formatPrice(unitPrice)} / {formatUnit(product.unit)}
              </div>

              <QuantitySelector
                quantity={quantity}
                minQuantity={product.minQuantity}
                onChange={setQuantity}
              />

              {product.priceTiers && (
                <div>
                  <p className="text-sm font-semibold mb-2">Precios por volumen</p>
                  {product.priceTiers.map((tier) => (
                    <div key={tier.label} className="flex justify-between text-sm">
                      <span>{tier.label}</span>
                      <span>{formatPrice(tier.price)}</span>
                    </div>
                  ))}

                  {missingForPromo > 0 && (
                    <p className="text-xs text-orange-600 mt-2">
                      Te faltan {missingForPromo} {formatUnit(product.unit)} para promo
                    </p>
                  )}
                </div>
              )}

              <div className="text-xl font-bold">
                Total: {formatPrice(totalPrice)}
              </div>

              <Button onClick={handleAdd}>
                <ShoppingCart /> Agregar
              </Button>

              <a
                href={getWhatsAppUrl(`Hola quiero ${product.name}`)}
                target="_blank"
                onClick={() => trackWhatsAppClick('pdp', product.slug)}
              >
                <Button variant="outline">WhatsApp</Button>
              </a>

            </div>

          </div>
        </div>

        {/* RELACIONADOS */}
        <div className="mt-14">
          <h2 className="text-xl font-bold mb-4">También te puede interesar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}