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

type ProductDetailType = Product & {
  minOrderQuantity?: number;
  features: string[];
  specifications: Record<string, string>;
  recommendations?: string[];
};

type Props = { 
  product: ProductDetailType;
  relatedProducts: Product[];
};

function getCalculatedQuantity(product: ProductDetailType, quantity: number) {
  const safe = Math.max(quantity, product.minOrderQuantity || product.minQuantity || 1);
  if (product.unit === 'docena') return safe * 12;
  if (product.unit === 'visita' || product.unit === 'servicio') return 1;
  return safe;
}

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const addItem = useBudgetStore((s) => s.addItem);

  const [quantity, setQuantity] = useState(product.minOrderQuantity || product.minQuantity || 1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    trackProductView(product.name, product.slug);
  }, [product]);

  const minimumQuantity =
    Number(product.minOrderQuantity ?? product.minQuantity) || 1;

  const safeQuantity = Math.max(Number(quantity) || minimumQuantity, minimumQuantity);

  const { unitPrice, totalPrice } = useMemo(
    () => getPriceForQuantity(product, quantity),
    [product, quantity]
  );

  const priceTiers = product.priceTiers ?? [];
  const features = product.features ?? [];
  const specifications = product.specifications ?? {};
  const recommendations = product.recommendations ?? [];
  const fallbackImage = `/productos/${product.slug}.jpg`;
  const images = product.images?.length > 0 ? product.images : [fallbackImage];
  const related = relatedProducts ?? [];

  const promoTier = priceTiers.find((t) => t.isPromo);
  const missingForPromo = promoTier ? Math.max(0, promoTier.min - safeQuantity) : 0;

  const selectedImage = images[selectedImageIndex];

  const handleAdd = () => {
    addItem(product, getCalculatedQuantity(product, quantity));
    trackAddToBudget(product.name, product.slug, quantity);
  };

  return (
    <div className="bg-[#f7faf7] min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-10">

        <Link href="/productos" className="flex items-center gap-2 mb-5 md:mb-6 text-sm text-gray-700">
          <ArrowLeft size={16} /> Volver
        </Link>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-10">

          <div>
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-sm">
              <Image src={selectedImage} alt={product.name} fill className="object-cover" />
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImageIndex(i)} aria-label={`Ver imagen ${i + 1} de ${product.name}`}>
                  <div className={`relative aspect-square ${selectedImageIndex === i ? 'ring-2 ring-green-600 rounded' : ''}`}>
                    <Image src={img} alt="" fill className="object-cover rounded" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5 md:space-y-6">

            <div className="space-y-2">
              <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>
              <p className="text-sm text-green-700 font-medium">{product.shortDescription}</p>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            <div className="border rounded-xl p-5 md:p-6 bg-white space-y-5 shadow-sm">

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500">Precio aplicado por {formatUnit(product.unit)}</p>
                <div className="text-3xl md:text-4xl font-bold text-green-600">
                  {formatPrice(unitPrice)} <span className="text-lg md:text-xl font-semibold text-green-700">/ {formatUnit(product.unit)}</span>
                </div>
              </div>

              <QuantitySelector
                quantity={quantity}
                minQuantity={product.minQuantity}
                onChange={setQuantity}
              />

              {priceTiers.length > 0 && (
                <div className="pt-1 border-t space-y-3">
                  <p className="text-sm font-semibold mt-2">Precios por volumen</p>
                  
                  <div className="space-y-2">
                    {priceTiers.map((tier, idx) => {
                      const normalizedTier = tier as typeof tier & { minQuantity?: number; maxQuantity?: number | null; };
                      const min = normalizedTier.min ?? normalizedTier.minQuantity ?? 0;
                      const max = normalizedTier.max ?? normalizedTier.maxQuantity ?? null;
                      
                      const isActive = safeQuantity >= min && (max === null || safeQuantity <= max);
                      const isLowestPrice = tier.price === Math.min(...priceTiers.map(t => t.price));
                      
                      const label = max !== null
                          ? `${min} a ${max} ${formatUnit(product.unit)}`
                          : `Desde ${min} ${formatUnit(product.unit)}`;

                      return (
                        <div key={idx} className={`flex flex-col sm:flex-row justify-between sm:items-center text-sm p-2 rounded-lg transition-colors ${isActive ? 'bg-green-50 border border-green-200 shadow-sm' : 'border border-transparent'}`}>
                          <div className="flex items-center flex-wrap gap-2 mb-1 sm:mb-0">
                            <span className={`${isActive ? 'font-semibold text-green-800' : 'text-gray-700'}`}>{label}</span>
                            {tier.isPromo && (
                              <span className="px-1.5 py-0.5 text-[10px] uppercase tracking-wide bg-blue-100 text-blue-700 rounded font-bold">
                                Promoción
                              </span>
                            )}
                            {isLowestPrice && (
                              <span className="px-1.5 py-0.5 text-[10px] uppercase tracking-wide bg-corpicia-green/10 text-corpicia-green rounded font-bold">
                                Mejor Precio
                              </span>
                            )}
                            {isActive && (
                              <span className="px-1.5 py-0.5 text-[10px] uppercase tracking-wide bg-green-200 text-green-800 rounded font-bold">
                                Aplicado
                              </span>
                            )}
                          </div>
                          <span className={`${isActive ? 'font-bold text-green-800' : 'font-medium text-gray-800'}`}>
                            {formatPrice(tier.price)} / {formatUnit(product.unit)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {(() => {
                    const sortedTiers = [...priceTiers].sort((a, b) => {
                      const minA = (a as any).min ?? (a as any).minQuantity ?? 0;
                      const minB = (b as any).min ?? (b as any).minQuantity ?? 0;
                      return minA - minB;
                    });
                    const nextTier = sortedTiers.find(t => {
                      const min = (t as any).min ?? (t as any).minQuantity ?? 0;
                      return min > safeQuantity;
                    });
                    
                    if (nextTier) {
                      const nextMin = (nextTier as any).min ?? (nextTier as any).minQuantity ?? 0;
                      const missing = nextMin - safeQuantity;
                      return (
                        <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-100 mt-2">
                          Te faltan {missing} {formatUnit(product.unit)} para acceder a {formatPrice(nextTier.price)} / {formatUnit(product.unit)}.
                        </p>
                      );
                    } else {
                      return (
                        <p className="text-xs text-green-700 bg-green-50 p-2 rounded border border-green-100 mt-2">
                          Ya tenés el mejor precio disponible.
                        </p>
                      );
                    }
                  })()}
                </div>
              )}

              <div className="pt-3 border-t">
                <p className="text-sm text-gray-500 mb-1">
                  {safeQuantity} {formatUnit(product.unit)} × {formatPrice(unitPrice)} / {formatUnit(product.unit)}
                </p>
                <div className="text-xl font-bold">
                  Total: {formatPrice(totalPrice)}
                </div>
              </div>

              {/* ✅ BOTONES CORREGIDOS: Con gap y responsive */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button onClick={handleAdd} className="flex-1 min-h-[44px]">
                  <ShoppingCart className="mr-2" size={18} /> Agregar al Presupuesto
                </Button>

                <a
                  href={getWhatsAppUrl(`Hola quiero ${product.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick('pdp', product.slug)}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full min-h-[44px]">
                    WhatsApp
                  </Button>
                </a>
              </div>

            </div>

            <div className="border rounded-xl bg-white p-5 md:p-6 space-y-4 shadow-sm">
              <h2 className="text-lg font-semibold">Características y especificaciones</h2>

              <div className="space-y-2">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check size={16} className="mt-0.5 text-green-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-sm text-gray-700">
                {Object.entries(specifications).map(([label, value]) => (
                  <p key={label}>
                    <span className="font-semibold">{label}:</span> {value}
                  </p>
                ))}
              </div>

              {recommendations.length > 0 && (
                <div className="pt-2 border-t space-y-2">
                  <h3 className="text-base font-semibold">Recomendaciones de uso</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 leading-relaxed">
                    {recommendations.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-14">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-green-700">
                  Completá tu proyecto
                </p>
                <h2 className="text-xl font-bold">
                  También te puede interesar
                </h2>
              </div>

              <Link
                href="/productos"
                className="text-sm font-medium text-green-700 hover:underline"
              >
                Ver todos los productos
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
