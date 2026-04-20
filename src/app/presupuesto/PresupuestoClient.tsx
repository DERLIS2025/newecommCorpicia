'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBudgetStore } from '@/store/budgetStore';
import { formatPrice, formatUnit, generateWhatsAppMessage, getPriceForQuantity } from '@/lib/utils';
import { trackWhatsAppClick } from '@/lib/tracking';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  MessageCircle,
  ArrowLeft,
  Package,
  TrendingDown,
  CheckCircle2,
} from 'lucide-react';

export default function PresupuestoClient() {
  const { items, removeItem, updateQuantity, getTotal, clearBudget } = useBudgetStore();

  const handleWhatsAppClick = () => {
    trackWhatsAppClick('budget_summary', 'enviar-presupuesto');

    const messageItems = items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      total: item.total,
      unit: item.product.unit,
      unitPrice: item.unitPrice,
    }));

    const url = generateWhatsAppMessage(messageItems, getTotal());
    window.open(url, '_blank');
  };

  // Mensaje dinámico según tier
  const getTierMessage = (item: typeof items[0]) => {
    if (!item.product.priceTiers || item.product.priceTiers.length === 0) return null;
    
    const { activeTier: currentTier } = getPriceForQuantity(item.product, item.quantity);
    const nextTier = item.product.priceTiers.find(t => t.min > item.quantity);
    
    if (!nextTier) {
      return (
        <div className="flex items-center gap-1 text-green-600 text-xs font-medium mt-1">
          <CheckCircle2 size={12} />
          ¡Tenés el mejor precio disponible!
        </div>
      );
    }
    
    const missing = nextTier.min - item.quantity;
    const currentTotal = item.unitPrice * item.quantity;
    const nextTotal = nextTier.price * nextTier.min;
    const savings = currentTotal - nextTotal;
    
    return (
      <div className="flex items-start gap-1 text-amber-600 text-xs mt-1">
        <TrendingDown size={12} className="mt-0.5 flex-shrink-0" />
        <span>
          Si comprás <strong>{missing} m²</strong> más, pasás a{' '}
          <strong>Gs. {nextTier.price.toLocaleString()}/m²</strong>
          {savings > 0 && (
            <> y <strong>ahorrás Gs. {savings.toLocaleString()}</strong></>
          )}
        </span>
      </div>
    );
  };

  // 🟡 ESTADO VACÍO
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
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

  // 🟢 PRESUPUESTO CON PRODUCTOS
  return (
    <div className="container mx-auto px-4 py-10">
      <Link href="/productos/" className="flex items-center gap-2 text-gray-500 mb-6">
        <ArrowLeft size={16} /> Seguir comprando
      </Link>

      <h1 className="text-3xl font-bold mb-6">Mi Presupuesto</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* PRODUCTOS */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => {
            const isM2 = item.product.unit === 'm2';
            const hasTiers = item.product.priceTiers && item.product.priceTiers.length > 0;
            const { activeTier: currentTier } = hasTiers 
              ? getPriceForQuantity(item.product, item.quantity) 
              : { activeTier: null };

            return (
              <Card key={item.product.id}>
                <CardContent className="p-4 flex gap-4">
                  <div className="w-32 h-32 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
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

                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold">{item.product.name}</h2>

                    {/* Precio unitario actual (dinámico según tier) */}
                    <p className="text-sm text-gray-600">
                      {formatPrice(item.unitPrice)} / {formatUnit(item.product.unit)}
                    </p>

                    {/* Input de cantidad editable */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            Math.max(item.product.minQuantity, item.quantity - 1)
                          )
                        }
                        className="p-1.5 hover:bg-gray-200 rounded bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>

                      <input
                        type="number"
                        min={item.product.minQuantity}
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || item.product.minQuantity;
                          updateQuantity(item.product.id, Math.max(item.product.minQuantity, val));
                        }}
                        className="w-16 text-center text-sm font-medium border rounded py-1 px-1"
                      />

                      <span className="text-sm text-gray-500">
                        {formatUnit(item.product.unit)}
                      </span>

                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-gray-200 rounded bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* TABLA DE PRECIOS POR VOLUMEN (solo para productos con tiers) */}
                    {hasTiers && (
                      <div className="mt-3 bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          📊 Precios por volumen
                        </p>
                        <div className="space-y-1">
                          {item.product.priceTiers!.map((tier) => {
                            const isActive = currentTier?.min === tier.min;
                            return (
                              <div
                                key={tier.min}
                                className={`flex justify-between text-xs px-2 py-1 rounded ${
                                  isActive
                                    ? 'bg-green-100 text-green-800 font-medium'
                                    : 'text-gray-500'
                                }`}
                              >
                                <span>
                                  {tier.max === null
                                    ? `${tier.min}+ m²`
                                    : `${tier.min}-${tier.max} m²`}
                                </span>
                                <span>
                                  {isActive && '← ACTUAL '}
                                  Gs. {tier.price.toLocaleString()}/m²
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Mensaje de ahorro / siguiente tier */}
                        {getTierMessage(item)}
                      </div>
                    )}

                    {/* Subtotal */}
                    <p className="mt-2 font-bold text-corpicia-green text-lg">
                      {formatPrice(item.total)}
                    </p>
                  </div>

                  <button 
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded self-start"
                  >
                    <Trash2 size={18} />
                  </button>
                </CardContent>
              </Card>
            );
          })}

          <Button variant="outline" onClick={clearBudget}>
            Vaciar presupuesto
          </Button>
        </div>

        {/* RESUMEN */}
        <div>
          <Card className="sticky top-4">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-bold text-lg">Resumen</h2>

              {/* Lista de items en resumen */}
              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-gray-600">
                    <span>{item.quantity} {formatUnit(item.product.unit)} × {item.product.name}</span>
                    <span>{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(getTotal())}</span>
              </div>

              {/* NOTAS DE ACLARACIÓN */}
              <div className="text-xs text-gray-500 space-y-1 border-t border-gray-200 pt-3">
                <p className="flex items-start gap-1">
                  <span>•</span>
                  <span>Los precios no incluyen IVA</span>
                </p>
                <p className="flex items-start gap-1">
                  <span>•</span>
                  <span>Empastado e instalación de riego: el precio no incluye preparación del terreno</span>
                </p>
              </div>

              <Button onClick={handleWhatsAppClick} className="w-full bg-green-600 hover:bg-green-700">
                <MessageCircle className="mr-2" size={18} />
                Enviar por WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
