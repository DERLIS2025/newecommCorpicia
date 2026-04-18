'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, ShoppingCart } from 'lucide-react';

import { QuantitySelector } from '@/components/QuantitySelector';
import { Button } from '@/components/ui/button';
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
      <div className="container mx-auto px-4 py-8 md:py-10">

        <Link href="/productos" className="flex items-center gap-2 mb-5 md:mb-6 text-sm text-gray-700">
          <ArrowLeft size={16} /> Volver
        </Link>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-10">

          {/* GALERÍA */}
          <div>
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-sm">
              <Image src={selectedImage} alt={product.name} fill className="object-cover" />
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4">
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
          <div className="space-y-5 md:space-y-6">

            <div className="space-y-2">
              <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            <div className="border rounded-xl p-5 md:p-6 bg-white space-y-5 shadow-sm">

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500">Precio por unidad</p>
                <div className="text-3xl md:text-4xl font-bold text-green-600">
                  {formatPrice(unitPrice)} <span className="text-lg md:text-xl font-semibold text-green-700">/ {formatUnit(product.unit)}</span>
                </div>
              </div>

              <QuantitySelector
                quantity={quantity}
                minQuantity={product.minQuantity}
                onChange={setQuantity}
              />

              {product.priceTiers && (
                <div className="pt-1 border-t">
                  <p className="text-sm font-semibold mb-2">Precios por volumen</p>
                  {product.priceTiers.map((tier) => (
                    <div key={tier.label} className="flex justify-between text-sm py-0.5">
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

              <div className="text-xl font-bold pt-1 border-t">
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

            <div className="border rounded-xl bg-white p-5 md:p-6 space-y-4 shadow-sm">
              <h2 className="text-lg font-semibold">Características y especificaciones</h2>

              <div className="space-y-2">
                {product.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check size={16} className="mt-0.5 text-green-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-sm text-gray-700">
                {Object.entries(product.specifications).map(([label, value]) => (
                  <p key={label}>
                    <span className="font-semibold">{label}:</span> {value}
                  </p>
                ))}
              </div>

              {product.recommendations?.length > 0 && (
                <div className="pt-2 border-t space-y-2">
                  <h3 className="text-base font-semibold">Recomendaciones de uso</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 leading-relaxed">
                    {product.recommendations.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
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
