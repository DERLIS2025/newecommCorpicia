'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBudgetStore } from '@/store/budgetStore';
import { formatPrice, formatUnit, generateWhatsAppMessage } from '@/lib/utils';
import { trackWhatsAppClick } from '@/lib/tracking';
import { Minus, Plus, Trash2, ShoppingCart, X, MessageCircle } from 'lucide-react';

export function BudgetDrawer() {
  const pathname = usePathname();
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
    // ✅ CORREGIDO: Usar api.whatsapp.com en vez de wa.me (evita bloqueo FortiGate)
    const safeUrl = url.replace('https://wa.me/', 'https://api.whatsapp.com/send?phone=');
    window.open(safeUrl, '_blank');
  };

  if (pathname?.startsWith('/admin')) return null;

  if (items.length === 0) return null;

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-[60] flex items-center gap-2 bg-corpicia-green text-white px-4 py-3 rounded-full shadow-lg"
      >
        <ShoppingCart className="w-5 h-5" />
        {items.length} productos
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-[70]" 
            onClick={() => setIsOpen(false)} 
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[80] flex flex-col shadow-2xl">

            {/* Header */}
            <div className="flex justify-between p-4 border-b flex-shrink-0">
              <h2 className="font-bold flex gap-2 items-center">
                <ShoppingCart className="w-5 h-5" /> Presupuesto
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Productos - scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 bg-gray-50 p-3 rounded-lg">

                  <div className="w-20 h-20 bg-white flex-shrink-0 rounded overflow-hidden">
                    {item.product.images?.[0] && (
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        className="object-cover w-full h-full" 
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>

                    <p className="text-sm text-gray-500">
                      {formatPrice(item.product.pricePerM2)} / {formatUnit(item.product.unit)}
                    </p>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item.product.id, Math.max(item.product.minQuantity, item.quantity - 1))}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="text-sm font-medium">
                          {item.quantity} {formatUnit(item.product.unit)}
                        </span>

                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-right font-bold text-green-600 mt-1">
                      {formatPrice(item.total)}
                    </p>
                  </div>

                </div>
              ))}
            </div>

            {/* Footer del drawer - SIEMPRE VISIBLE */}
            <div className="p-4 border-t bg-white flex-shrink-0 space-y-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(getTotal())}</span>
              </div>

              {/* ✅ BOTONES CORREGIDOS: Flex row en mobile, no superpuestos */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={handleWhatsAppClick}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2" /> 
                  Enviar por WhatsApp
                </Button>

                <Link href="/presupuesto" className="flex-1">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Ver detalle
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </>
      )}
    </>
  );
}
