'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-md transition-shadow border border-gray-200 rounded-xl">
      <Link href={`/productos/${product.slug}/`}>
        <div className="aspect-[4/3] sm:aspect-square bg-gray-100 relative overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {product.isFeatured && (
            <Badge className="absolute top-2 left-2 bg-amber-500 text-[10px] sm:text-xs px-2 py-0.5">
              Destacado
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-2 sm:p-4">
        <Link href={`/productos/${product.slug}/`}>
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-1 sm:mb-2 group-hover:text-corpicia-green transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-2 sm:mb-3">
          {product.shortDescription || product.description}
        </p>

        <div className="flex items-baseline gap-1 mb-2 sm:mb-4">
          <span className="text-base sm:text-lg font-bold text-corpicia-green">
            {formatPrice(product.pricePerM2)}
          </span>
          <span className="text-xs sm:text-sm text-gray-400">/ m²</span>
        </div>

        <Link href={`/productos/${product.slug}/`}>
          <Button className="w-full gap-1.5 h-9 sm:h-10 text-xs sm:text-sm">
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Agregar al Presupuesto
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
