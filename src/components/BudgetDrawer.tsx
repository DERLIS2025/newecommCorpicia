'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBudgetStore } from '@/store/budgetStore';
import { formatPrice, formatUnit, generateWhatsAppMessage } from '@/lib/utils';
import { trackWhatsAppClick } from '@/lib/tracking';
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
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Mi Presupuesto
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  {/* Image */}
                  <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.images && item.product.images.length > 0 ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingCart className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 line-clamp-2">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatPrice(item.product.pricePerM2)} / {formatUnit(item.product.unit)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(item.product.minQuantity, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity} {formatUnit(item.product.unit)}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-right font-bold text-corpicia-green mt-2">
                      {formatPrice(item.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total estimado:</span>
                <span className="text-2xl font-bold text-corpicia-green">
                  {formatPrice(getTotal())}
                </span>
              </div>

              <Button
                onClick={handleWhatsAppClick}
                className="w-full gap-2 bg-green-500 hover:bg-green-600 h-12"
              >
                <MessageCircle className="w-5 h-5" />
                Enviar por WhatsApp
              </Button>

              <div className="flex gap-2">
                <Link href="/presupuesto/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Ver Detalle Completo
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={clearBudget}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
