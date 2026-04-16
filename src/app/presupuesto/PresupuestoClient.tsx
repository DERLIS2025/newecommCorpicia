'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBudgetStore } from '@/store/budgetStore';
import { formatPrice, generateWhatsAppMessage } from '@/lib/utils';
import { trackWhatsAppClick } from '@/lib/tracking';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  MessageCircle,
  ArrowLeft,
  Package,
} from 'lucide-react';

export default function PresupuestoClient() {
  const { items, removeItem, updateQuantity, getTotal, clearBudget } = useBudgetStore();

  const handleWhatsAppClick = () => {
    trackWhatsAppClick('budget_summary', 'enviar-presupuesto');

    const messageItems = items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      total: item.total,
    }));

    const url = generateWhatsAppMessage(messageItems, getTotal());
    window.open(url, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Tu presupuesto está vacío
            </h1>

            <p className="text-gray-500 mb-8">
              Agregá productos para armar tu presupuesto personalizado
            </p>

            <Link href="/productos/">
              <Button className="gap-2">
                <Package className="w-4 h-4" />
                Ver Productos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/productos/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-corpicia-green transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Seguir comprando
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Mi Presupuesto
          </h1>

          <p className="text-gray-500 mt-2">
            {items.length} {items.length === 1 ? 'producto' : 'productos'} en tu presupuesto
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Products */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-48 h-48 bg-gray-100">
                      {item.product.images?.length > 0 ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={192}
                          height={192}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="w-10 h-10 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-6">
                      <Link href={`/productos/${item.product.slug}/`} className="font-semibold">
                        {item.product.name}
                      </Link>

                      <p className="text-sm text-gray-500">
                        {formatPrice(item.product.pricePerM2)} / m²
                      </p>

                      <div className="flex justify-between mt-4">
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                Math.max(item.product.minQuantity, item.quantity - 1)
                              )
                            }
                          >
                            <Minus />
                          </button>

                          <span className="mx-3">{item.quantity}</span>

                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                            <Plus />
                          </button>
                        </div>

                        <span className="font-bold text-corpicia-green">
                          {formatPrice(item.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" onClick={clearBudget}>
              Vaciar presupuesto
            </Button>
          </div>

          {/* Summary */}
          <div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="font-bold text-lg">Resumen</h2>

                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>

                <Button onClick={handleWhatsAppClick} className="w-full">
                  Enviar por WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}