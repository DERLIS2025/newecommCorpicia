'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, formatUnit } from '@/lib/utils';
import { Product } from '@/types';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
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
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <svg
                className="h-14 w-14 sm:h-16 sm:w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {product.isFeatured && (
            <Badge className="absolute left-2 top-2 bg-amber-500 px-2 py-0.5 text-[10px] sm:text-xs">
              Destacado
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="flex flex-1 flex-col p-3 sm:p-4">
        <Link href={`/productos/${product.slug}/`}>
          <h3 className="mb-1 min-h-[2.75rem] text-sm font-semibold leading-tight text-gray-900 transition-colors group-hover:text-corpicia-green sm:mb-2 sm:min-h-[3rem] sm:text-base">
            <span className="line-clamp-2">{product.name}</span>
          </h3>
        </Link>

        <p className="mb-3 min-h-[2.5rem] text-xs text-gray-500 sm:min-h-[2.75rem] sm:text-sm">
          <span className="line-clamp-2">
            {product.shortDescription || product.description}
          </span>
        </p>

        <div className="mb-3 flex items-baseline gap-1 sm:mb-4">
          <span className="text-base font-bold text-corpicia-green sm:text-lg">
            {formatPrice(product.pricePerM2)}
          </span>
          <span className="text-xs text-gray-400 sm:text-sm">
            / {formatUnit(product.unit)}
          </span>
        </div>

        <div className="mt-auto">
          <Link href={`/productos/${product.slug}/`} className="block">
            <Button className="h-9 w-full gap-1.5 text-xs sm:h-10 sm:text-sm">
              <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Agregar al Presupuesto
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
