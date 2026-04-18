'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBudgetStore } from '@/store/budgetStore';
import { formatPrice, formatUnit, generateWhatsAppMessage } from '@/lib/utils';
import { trackWhatsAppClick } from '@/lib/tracking'; // ✅ ESTA LÍNEA ES LA CLAVE
import { Minus, Plus, Trash2, ShoppingCart, X, MessageCircle } from 'lucide-react';

export function BudgetDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, getTotal, clearBudget } = useBudgetStore();

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

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 bg-corpicia-green hover:bg-corpicia-green-dark text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="font-medium">{items.length} productos</span>
      </button>

      {/* Drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Mi Presupuesto
              </h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">

                  <div className="w-20 h-20 bg-white rounded-lg overflow-hidden">
                    {item.product.images?.[0] ? (
                      <img src={item.product.images[0]} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingCart />
                    )}
                  </div>

                  <div className="flex-1">
                    <h4>{item.product.name}</h4>

                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                        <Minus />
                      </button>

                      <span>
                        {item.quantity} {formatUnit(item.product.unit)}
                      </span>

                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                        <Plus />
                      </button>
                    </div>

                    <p className="text-right font-bold text-corpicia-green">
                      {formatPrice(item.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between">
                <span>Total:</span>
                <span>{formatPrice(getTotal())}</span>
              </div>

              <Button onClick={handleWhatsAppClick}>
                <MessageCircle />
                Enviar por WhatsApp
              </Button>

              <Link href="/presupuesto/">
                <Button variant="outline" className="w-full">
                  Ver Detalle
                </Button>
              </Link>
            </div>

          </div>
        </>
      )}
    </>
  );
}