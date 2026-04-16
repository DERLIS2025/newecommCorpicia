'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBudgetStore } from '@/store/budgetStore';
import { formatPrice, generateWhatsAppMessage } from '@/lib/utils';
import { Minus, Plus, Trash2, ShoppingCart, MessageCircle, ArrowLeft, Package } from 'lucide-react';

export default function PresupuestoClient() {
  const { items, removeItem, updateQuantity, getTotal, clearBudget } = useBudgetStore();

  const handleWhatsAppClick = () => {
    const messageItems = items.map(item => ({
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
          {/* Products List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="w-full sm:w-48 h-48 bg-gray-100 flex-shrink-0">
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={192}
                          height={192}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package className="w-12 h-12" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <Link
                            href={`/productos/${item.product.slug}/`}
                            className="font-semibold text-lg text-gray-900 hover:text-corpicia-green transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatPrice(item.product.pricePerM2)} / m²
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Mínimo: {item.product.minQuantity} m²
                          </p>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">Cantidad:</span>
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.product.id, Math.max(item.product.minQuantity, item.quantity - 1))}
                              className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-r-0 rounded-l-lg hover:bg-gray-200 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <div className="w-16 h-10 flex items-center justify-center border-y bg-white">
                              <span className="font-medium">{item.quantity}</span>
                            </div>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-l-0 rounded-r-lg hover:bg-gray-200 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="text-sm text-gray-500">m²</span>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.product.pricePerM2)} × {item.quantity} m²
                          </p>
                          <p className="text-xl font-bold text-corpicia-green">
                            {formatPrice(item.total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              onClick={clearBudget}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Vaciar presupuesto
            </Button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-xl font-bold">Resumen</h2>

                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(getTotal())}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Envío</span>
                      <span className="text-corpicia-green">A consultar</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Instalación</span>
                      <span className="text-corpicia-green">A consultar</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total estimado</span>
                      <span className="text-2xl font-bold text-corpicia-green">
                        {formatPrice(getTotal())}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      * El precio final puede variar según ubicación y servicios adicionales
                    </p>
                  </div>

                  <Button
                    onClick={handleWhatsAppClick}
                    className="w-full h-14 gap-2 bg-green-500 hover:bg-green-600 text-lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Enviar por WhatsApp
                  </Button>

                  <a
                    href="https://wa.me/595992588770"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full mt-2">
                      Hacer otra consulta
                    </Button>
                  </a>
                </CardContent>
              </Card>

              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>¿Necesitas ayuda?</strong> Contactanos por WhatsApp y te asesoramos
                  para elegir el producto ideal para tu proyecto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
