'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuantitySelector } from '@/components/QuantitySelector';
import { useBudgetStore } from '@/store/budgetStore';
import { formatPrice } from '@/lib/utils';
import { Check, ArrowLeft, ShoppingCart, Phone, Leaf, Truck, Shield } from 'lucide-react';
import { defaultProduct, productsData } from './productsData';

type ProductDetailClientProps = {
  slug: string;
};

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const product = productsData[slug] || defaultProduct;

  const [quantity, setQuantity] = useState(product.minQuantity);
  const addItem = useBudgetStore((state) => state.addItem);

  const handleAddToBudget = () => {
    addItem(product, quantity);
  };

  const estimatedPrice = product.pricePerM2 * quantity;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/productos/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-corpicia-green transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a productos
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden border">
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-24 h-24 bg-corpicia-green/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Leaf className="w-12 h-12 text-corpicia-green" />
                  </div>
                  <p className="text-gray-400">Imagen del producto</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-corpicia-green transition-all"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-gray-300" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="capitalize">
                  {product.category}
                </Badge>
                {product.isFeatured && (
                  <Badge className="bg-amber-500">Destacado</Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Calculator */}
            <Card className="border-corpicia-green/20 bg-corpicia-green/5">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-corpicia-green">
                    {formatPrice(product.pricePerM2)}
                  </span>
                  <span className="text-gray-500">/ m²</span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Cantidad (m²) - Mínimo: {product.minQuantity}m²
                  </label>
                  <QuantitySelector
                    quantity={quantity}
                    minQuantity={product.minQuantity}
                    onChange={setQuantity}
                  />
                </div>

                <div className="pt-4 border-t border-corpicia-green/20">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Precio estimado:</span>
                    <span className="text-2xl font-bold text-corpicia-green">
                      {formatPrice(estimatedPrice)}
                    </span>
                  </div>

                  <Button
                    onClick={handleAddToBudget}
                    className="w-full h-12 gap-2 text-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Agregar al Presupuesto
                  </Button>

                  <a
                    href="https://wa.me/595992588770"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full"
                  >
                    <Button variant="outline" className="w-full h-12 gap-2">
                      <Phone className="w-5 h-5" />
                      Consultar por WhatsApp
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Características</h3>
              <ul className="space-y-2">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-corpicia-green flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Especificaciones</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-xs text-gray-500 uppercase">{key}</span>
                    <p className="font-medium text-gray-900">{value as string}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <Truck className="w-6 h-6 text-corpicia-green mx-auto mb-2" />
                <p className="text-xs text-gray-600">Envío a domicilio</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-corpicia-green mx-auto mb-2" />
                <p className="text-xs text-gray-600">Garantía de calidad</p>
              </div>
              <div className="text-center">
                <Phone className="w-6 h-6 text-corpicia-green mx-auto mb-2" />
                <p className="text-xs text-gray-600">Soporte personalizado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
