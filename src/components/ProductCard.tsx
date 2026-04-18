'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, formatUnit } from '@/lib/utils';
import { Product } from '@/types';
import { ShoppingCart } from 'lucide-react';
import { useBudgetStore } from '@/store/budgetStore';
import { trackAddToBudget } from '@/lib/tracking';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useBudgetStore((state) => state.addItem);

  const handleAddToBudget = () => {
    addItem(product, product.minQuantity);
    trackAddToBudget(product.name, product.minQuantity);
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-md">

      <Link href={`/productos/${product.slug}/`} className="block">
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <ShoppingCart />
            </div>
          )}

          {product.isFeatured && (
            <Badge className="absolute left-2 top-2 bg-amber-500 text-xs">
              Destacado
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="flex flex-1 flex-col p-3 sm:p-4">

        <Link href={`/productos/${product.slug}/`}>
          <h3 className="text-sm sm:text-base font-semibold line-clamp-2 mb-2 group-hover:text-corpicia-green">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3">
          {product.shortDescription || product.description}
        </p>

        <div className="mb-3 flex items-baseline gap-1">
          <span className="text-base sm:text-lg font-bold text-corpicia-green">
            {formatPrice(product.pricePerM2)}
          </span>
          <span className="text-xs text-gray-400">
            / {formatUnit(product.unit)}
          </span>
        </div>

        {product.priceTiers && product.priceTiers.length > 0 && (
          <p className="text-xs text-gray-500 mb-3">
            Precios por volumen disponibles
          </p>
        )}

        <div className="mt-auto">
          <Button
            onClick={handleAddToBudget}
            className="w-full h-9 sm:h-10 text-xs sm:text-sm"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Agregar al Presupuesto
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}