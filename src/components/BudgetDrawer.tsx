'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBudgetStore } from '@/store/budgetStore';
import { formatPrice, formatUnit, generateWhatsAppMessage } from '@/lib/utils';
import { trackWhatsAppClick } from '@/lib/tracking'; // ✅ IMPORTANTE
import { Minus, Plus, Trash2, ShoppingCart, X, MessageCircle } from 'lucide-react';

export function BudgetDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, getTotal } = useBudgetStore();

  const handleWhatsAppClick = () => {
    trackWhatsAppClick('budget_drawer', 'enviar-presupuesto');

    const messageItems = items.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      total: item.total,
      unit: item.product.unit,
    }));

    const url = generateWhatsAppMessage(messageItems, getTotal());
    window.open(url, '_blank');
  };

  if (items.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 bg-corpicia-green text-white px-4 py-3 rounded-full shadow-lg"
      >
        <ShoppingCart className="w-5 h-5" />
        {items.length} productos
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsOpen(false)} />

          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col">

            <div className="flex justify-between p-4 border-b">
              <h2 className="font-bold flex gap-2">
                <ShoppingCart /> Presupuesto
              </h2>
              <button onClick={() => setIsOpen(false)}>
                <X />
              </button>
            </div>

            <div className="flex-1 p-4 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 bg-gray-50 p-3 rounded">

                  <div className="w-20 h-20 bg-white">
                    {item.product.images?.[0] && (
                      <img src={item.product.images[0]} className="object-cover w-full h-full" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>

                    <p className="text-sm text-gray-500">
                      {formatPrice(item.product.pricePerM2)} / {formatUnit(item.product.unit)}
                    </p>

                    <div className="flex justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.product.id, Math.max(item.product.minQuantity, item.quantity - 1))}>
                          <Minus />
                        </button>

                        {item.quantity} {formatUnit(item.product.unit)}

                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                          <Plus />
                        </button>
                      </div>

                      <button onClick={() => removeItem(item.product.id)}>
                        <Trash2 />
                      </button>
                    </div>

                    <p className="text-right font-bold text-green-600">
                      {formatPrice(item.total)}
                    </p>
                  </div>

                </div>
              ))}
            </div>

            <div className="p-4 border-t space-y-3">
              <div className="flex justify-between">
                <span>Total</span>
                <span>{formatPrice(getTotal())}</span>
              </div>

              <Button onClick={handleWhatsAppClick}>
                <MessageCircle /> WhatsApp
              </Button>

              <Link href="/presupuesto">
                <Button variant="outline" className="w-full">
                  Ver detalle
                </Button>
              </Link>
            </div>

          </div>
        </>
      )}
    </>
  );
}