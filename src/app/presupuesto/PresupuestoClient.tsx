'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useBudgetStore } from '@/store/budgetStore';
import { trackWhatsAppClick, trackQuoteStarted, trackQuoteSubmitted } from '@/lib/tracking';
import { submitQuoteRequest } from '@/lib/actions/public-quotes';
import {
  formatPrice,
  formatUnit,
  generateWhatsAppMessage,
  getPriceForQuantity,
} from '@/lib/utils';
import LocationPicker, { SelectedLocation } from '@/components/maps/LocationPicker';
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
  Send,
  MapPin,
  Map
} from 'lucide-react';

export default function PresupuestoClient() {
  const { items, removeItem, updateQuantity, getTotal, clearBudget } = useBudgetStore();
  
  // Ubicación
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [locationReference, setLocationReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

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
  
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);
    
    const formData = new FormData(e.currentTarget);
    
    // Preparar items
    const payloadItems = items.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unit: item.product.unit,
      unitPrice: item.unitPrice,
      total: item.total
    }));
    
    formData.append('items', JSON.stringify(payloadItems));
    formData.append('totalAmount', getTotal().toString());
    
    const result = await submitQuoteRequest(null, formData);
    
    setSubmitResult(result);
    setIsSubmitting(false);
    
    if (result.success) {
      if (result.quoteId) {
        trackQuoteSubmitted(result.quoteId, items.length, getTotal());
      }
      clearBudget();
    }
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

  // 🟡 ESTADO ÉXITO
  if (submitResult?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4 py-20">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border p-8">
          <CheckCircle2 className="mx-auto mb-4 text-corpicia-green w-16 h-16" />
          <h1 className="text-2xl font-bold mb-2">¡Solicitud enviada correctamente!</h1>
          <p className="text-gray-600 mb-6">Hemos recibido tu solicitud de presupuesto. Nuestro equipo comercial se pondrá en contacto contigo a la brevedad por WhatsApp o email.</p>
          <Link href="/">
            <Button className="w-full">Volver al inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

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
      <Link href="/productos/" className="flex items-center gap-2 text-gray-500 mb-6 w-fit hover:text-gray-900 transition-colors">
        <ArrowLeft size={16} /> Seguir comprando
      </Link>

      <h1 className="text-3xl font-bold mb-6">Mi Presupuesto</h1>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* PRODUCTOS */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => {
            const hasTiers = item.product.priceTiers && item.product.priceTiers.length > 0;
            const { activeTier: currentTier } = hasTiers 
              ? getPriceForQuantity(item.product, item.quantity) 
              : { activeTier: null };

            return (
              <Card key={item.product.id}>
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gray-100 flex-shrink-0 rounded overflow-hidden aspect-video sm:aspect-square">
                    {item.product.images?.length ? (
                      <Image
                         src={item.product.images[0]}
                         alt={item.product.name}
                         width={128}
                         height={128}
                         className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <Package />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h2 className="font-semibold text-lg leading-tight mb-1" style={{ wordBreak: 'break-word' }}>
                        {item.product.name}
                      </h2>
                      <p className="text-sm text-gray-600 block">
                        {formatPrice(item.unitPrice)} / {formatUnit(item.product.unit)}
                      </p>
                    </div>

                    {/* Input de cantidad editable */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => {
                          updateQuantity(
                            item.product.id,
                            Math.max(item.product.minQuantity, item.quantity - 1)
                          );
                          trackQuoteStarted();
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded bg-gray-100 transition-colors"
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
                          trackQuoteStarted();
                        }}
                        className="w-16 text-center text-sm font-medium border rounded py-1 px-1"
                      />

                      <span className="text-sm text-gray-500">
                        {formatUnit(item.product.unit)}
                      </span>

                      <button 
                        onClick={() => {
                          updateQuantity(item.product.id, item.quantity + 1);
                          trackQuoteStarted();
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded bg-gray-100 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* TABLA DE PRECIOS POR VOLUMEN */}
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
                        {getTierMessage(item)}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between mt-4 w-full pt-3 border-t border-gray-100 sm:border-none sm:pt-0 sm:mt-0 sm:w-auto">
                    <p className="font-bold text-corpicia-green text-lg md:text-xl w-full sm:w-auto text-left sm:text-right mb-2 sm:mb-0">
                      {formatPrice(item.total)}
                    </p>
                    <button 
                      onClick={() => removeItem(item.product.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors self-end sm:ml-4"
                      title="Eliminar producto"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="flex justify-start">
            <Button variant="ghost" className="text-gray-500 hover:text-red-600" onClick={clearBudget}>
              Vaciar presupuesto
            </Button>
          </div>
        </div>

        {/* RESUMEN Y FORMULARIO */}
        <div className="space-y-4">
          <Card className="sticky top-4 overflow-hidden border-2 border-transparent shadow-xl">
            <CardContent className="p-0">
              {/* Encabezado del Resumen */}
              <div className="bg-gray-50 p-6 border-b">
                <h2 className="font-bold text-xl mb-4">Resumen de solicitud</h2>
                <div className="space-y-2 text-sm mb-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-gray-600">
                      <span className="truncate pr-4">{item.quantity} {formatUnit(item.product.unit)} × {item.product.name}</span>
                      <span className="flex-shrink-0">{formatPrice(item.total)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-xl text-gray-900">
                  <span>Total Estimado</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
                
                <div className="text-xs text-gray-500 space-y-1 mt-4">
                  <p>• Los precios no incluyen IVA.</p>
                  <p>• Empastado: el precio no incluye preparación del terreno.</p>
                </div>
              </div>

              {/* Formulario */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Completá tus datos</h3>
                
                {submitResult?.success === false && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                    {submitResult.message}
                  </div>
                )}
                
                <form onSubmit={handleFormSubmit} onChangeCapture={trackQuoteStarted} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre completo *</label>
                    <Input name="name" required placeholder="Ej: Juan Pérez" onFocus={trackQuoteStarted} />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Teléfono / WhatsApp *</label>
                    <Input name="phone" required placeholder="Ej: 0981 123 456" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Email <span className="text-gray-400 font-normal">(Opcional)</span></label>
                    <Input name="email" type="email" placeholder="Ej: juan@mail.com" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Ciudad / Zona <span className="text-gray-400 font-normal">(Opcional)</span></label>
                    <Input name="location" placeholder="Ej: Asunción, Carmelitas" />
                  </div>

                  {/* Ubicación exacta interactiva */}
                  <div className="pt-2">
                    <LocationPicker 
                      onLocationChange={setSelectedLocation}
                      disabled={isSubmitting}
                    />
                    
                    {/* Campos hidden para enviar en el form */}
                    {selectedLocation && (
                      <>
                        <input type="hidden" name="exactLatitude" value={selectedLocation.latitude} />
                        <input type="hidden" name="exactLongitude" value={selectedLocation.longitude} />
                        <input type="hidden" name="exactAddress" value={selectedLocation.formattedAddress} />
                        <input type="hidden" name="exactMapUrl" value={selectedLocation.mapUrl} />
                      </>
                    )}
                    
                    <div className="mt-3 space-y-1">
                      <label className="block text-xs font-medium text-gray-700">Referencia adicional (Opcional)</label>
                      <Input 
                        name="locationReference"
                        placeholder="Ej: Portón negro, frente a la plaza, etc."
                        value={locationReference}
                        onChange={(e) => setLocationReference(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Mensaje adicional <span className="text-gray-400 font-normal">(Opcional)</span></label>
                    <textarea 
                      name="notes"
                      className="w-full flex min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="Detalles sobre tu proyecto, dudas..."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-[#1F4E79] hover:bg-[#163A5A] text-white h-12 text-base font-semibold transition-colors" disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : (
                      <>
                        <Send className="mr-2" size={18} />
                        Enviar solicitud de presupuesto
                      </>
                    )}
                  </Button>
                </form>
                
                <div className="relative flex items-center py-6">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">o también podés</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>
                
                <Button onClick={handleWhatsAppClick} variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50 h-12" type="button">
                  <MessageCircle className="mr-2" size={18} />
                  Enviar directo por WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
