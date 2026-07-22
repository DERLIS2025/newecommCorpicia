'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatPrice, formatUnit } from '@/lib/utils';
import { useBudgetStore } from '@/store/budgetStore';
import type { Product } from '@/types';
import type { CommercialAssistantProduct } from '@/lib/actions/commercial-assistant';

export function AssistantProductCard({
  product,
}: {
  product: CommercialAssistantProduct;
}) {
  const addItem = useBudgetStore(
    (state) => state.addItem
  );

  const storeProduct = product as Product;

  const handleAdd = () => {
    addItem(
      storeProduct,
      product.minQuantity || 1
    );
  };

  return (
    <div className="rounded-xl border bg-white p-3 shadow-sm">
      <div className="flex gap-3">
        <Link
          href={`/productos/${product.slug}/`}
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100"
        >
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              <ShoppingCart className="h-6 w-6" />
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={`/productos/${product.slug}/`}
            className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-green-700"
          >
            {product.name}
          </Link>

          <p className="mt-1 text-xs text-gray-500">
            {formatPrice(product.pricePerM2)} /{' '}
            {formatUnit(product.unit)}
          </p>

          <Button
            type="button"
            size="sm"
            onClick={handleAdd}
            className="mt-2 h-8 w-full gap-1.5 text-xs"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Agregar al presupuesto
          </Button>
        </div>
      </div>
    </div>
  );
}
