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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="mx-auto mb-4 text-gray-400" size={40} />
          <h1 className="text-xl font-bold">Tu presupuesto está vacío</h1>
          <p className="text-gray-500">Agregá productos para comenzar</p>

          <Link href="/productos/">
            <Button className="mt-4">Ver Productos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Link href="/productos/" className="flex items-center gap-2 text-gray-500 mb-6">
        <ArrowLeft size={16} /> Seguir comprando
      </Link>

      <h1 className="text-3xl font-bold mb-6">Mi Presupuesto</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Productos */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.product.id}>
              <CardContent className="p-4 flex gap-4">
                <div className="w-32 h-32 bg-gray-100">
                  {item.product.images?.length ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="font-semibold">{item.product.name}</h2>

                  <p className="text-sm text-gray-500">
                    {formatPrice(item.product.pricePerM2)} / m²
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          Math.max(item.product.minQuantity, item.quantity - 1)
                        )
                      }
                    >
                      <Minus size={16} />
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                      <Plus size={16} />
                    </button>
                  </div>

                  <p className="mt-2 font-bold text-corpicia-green">
                    {formatPrice(item.total)}
                  </p>
                </div>

                <button onClick={() => removeItem(item.product.id)}>
                  <Trash2 className="text-red-500" />
                </button>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" onClick={clearBudget}>
            Vaciar presupuesto
          </Button>
        </div>

        {/* Resumen */}
        <div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="font-bold text-lg">Resumen</h2>

              <div className="flex justify-between">
                <span>Total</span>
                <span>{formatPrice(getTotal())}</span>
              </div>

              <Button onClick={handleWhatsAppClick} className="w-full">
                <MessageCircle className="mr-2" />
                Enviar por WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}