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
  Send
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
        <div className="flex items-center gap-1 text-green-600 text-[11px] sm:text-xs font-medium mt-1.5">
          <CheckCircle2 size={12} className="flex-shrink-0" />
          <span>¡Tenés el mejor precio disponible!</span>
        </div>
      );
    }
    
    const missing = nextTier.min - item.quantity;
    const currentTotal = item.unitPrice * item.quantity;
    const nextTotal = nextTier.price * nextTier.min;
    const savings = currentTotal - nextTotal;
    
    return (
      <div className="flex items-start gap-1 text-amber-600 text-[11px] sm:text-xs mt-1.5">
        <TrendingDown size={12} className="mt-[2px] flex-shrink-0" />
        <span className="leading-tight">
          Agregá <strong>{missing} {formatUnit(item.product.unit)}</strong> más para bajar a{' '}
          <strong>Gs. {nextTier.price.toLocaleString()}</strong>
          {savings > 0 && (
            <> y <strong>ahorrar Gs. {savings.toLocaleString()}</strong></>
          )}
        </span>
      </div>
    );
  };

  // 🟡 ESTADO ÉXITO
  if (submitResult?.success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-corpicia-green w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold mb-3 text-gray-900">¡Solicitud enviada!</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Hemos recibido tu presupuesto correctamente. Nuestro equipo comercial lo revisará y se pondrá en contacto contigo a la brevedad.
          </p>
          <Link href="/">
            <Button className="w-full h-12 text-base font-medium rounded-xl">Volver al inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 🟡 ESTADO VACÍO
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-center px-4 py-12">
        <div className="max-w-md w-full flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="text-gray-300" size={48} />
          </div>
          <h1 className="text-2xl font-bold mb-3 text-gray-900">Tu presupuesto está vacío</h1>
          <p className="text-gray-500 mb-8">No has agregado ningún producto para cotizar. Explora nuestro catálogo y selecciona lo que necesites.</p>
          <Link href="/productos/">
            <Button className="h-12 px-8 text-base font-medium rounded-xl bg-[#1F4E79] hover:bg-[#163A5A]">Ver Productos</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 🟢 PRESUPUESTO CON PRODUCTOS
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <Link href="/productos/" className="inline-flex items-center gap-2 text-sm text-gray-500 mb-6 hover:text-gray-900 font-medium transition-colors">
        <ArrowLeft size={16} /> Volver al catálogo
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 tracking-tight">Solicitar Presupuesto</h1>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* COLUMNA IZQUIERDA: PRODUCTOS (7 columnas) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-gray-500" />
                Productos agregados ({items.length})
              </h2>
              <button 
                onClick={clearBudget}
                className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline transition-all"
              >
                Vaciar todo
              </button>
            </div>
            
            <div className="divide-y divide-gray-100">
              {items.map((item) => {
                const hasTiers = item.product.priceTiers && item.product.priceTiers.length > 0;
                const { activeTier: currentTier } = hasTiers 
                  ? getPriceForQuantity(item.product, item.quantity) 
                  : { activeTier: null };

                return (
                  <div key={item.product.id} className="p-4 sm:p-5 hover:bg-gray-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                      
                      {/* Imagen - Horizontal y compacta */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200">
                        {item.product.images?.length ? (
                          <Image
                             src={item.product.images[0]}
                             alt={item.product.name}
                             width={96}
                             height={96}
                             className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-300">
                            <Package size={28} />
                          </div>
                        )}
                      </div>

                      {/* Detalles principales */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="pr-8 sm:pr-0 relative">
                          <h3 className="font-bold text-gray-900 leading-tight mb-1" style={{ wordBreak: 'break-word' }}>
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-500 font-medium">
                            {formatPrice(item.unitPrice)} / {formatUnit(item.product.unit)}
                          </p>
                          
                          {/* Trash button absolute on mobile, inline on desktop */}
                          <button 
                            onClick={() => removeItem(item.product.id)}
                            className="absolute top-0 right-0 sm:hidden p-2 -mt-2 -mr-2 text-gray-400 hover:text-red-500 rounded-lg"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* Controles y Total (Fila inferior) */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-4 sm:mt-auto gap-4 sm:gap-2">
                          
                          {/* Controles de Cantidad */}
                          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg p-1 w-fit shadow-sm">
                            <button
                              onClick={() => {
                                updateQuantity(item.product.id, Math.max(item.product.minQuantity, item.quantity - 1));
                                trackQuoteStarted();
                              }}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              <Minus size={16} strokeWidth={2.5} />
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
                              className="w-12 text-center text-sm font-semibold bg-transparent focus:outline-none"
                            />

                            <button 
                              onClick={() => {
                                updateQuantity(item.product.id, item.quantity + 1);
                                trackQuoteStarted();
                              }}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              <Plus size={16} strokeWidth={2.5} />
                            </button>
                          </div>

                          {/* Subtotal y Eliminar (Desktop) */}
                          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                            <div className="text-left sm:text-right">
                              <span className="text-[11px] text-gray-400 font-medium block sm:hidden uppercase tracking-wider mb-0.5">Subtotal</span>
                              <p className="font-bold text-gray-900 text-lg">
                                {formatPrice(item.total)}
                              </p>
                            </div>
                            <button 
                              onClick={() => removeItem(item.product.id)}
                              className="hidden sm:flex p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>

                        </div>
                        
                        {/* Mensaje de Volumen (Si aplica) */}
                        {hasTiers && (
                          <div className="mt-3 pt-3 border-t border-gray-100 border-dashed">
                            {getTierMessage(item)}
                          </div>
                        )}
                        
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: RESUMEN Y FORMULARIO (5 columnas) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto custom-scrollbar">
            
            {/* Cabecera Resumen Total */}
            <div className="bg-gray-900 p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-gray-300 text-sm font-medium mb-1">Total Estimado</p>
                <p className="text-3xl sm:text-4xl font-bold tracking-tight">{formatPrice(getTotal())}</p>
                <div className="text-xs text-gray-400 mt-3 flex flex-col gap-1">
                  <p>• Los precios no incluyen IVA.</p>
                  <p>• Empastado: no incluye preparación del terreno.</p>
                </div>
              </div>
              <div className="absolute -right-10 -top-10 opacity-10">
                <ShoppingCart size={140} strokeWidth={1} />
              </div>
            </div>

            {/* Formulario */}
            <div className="p-6 sm:p-8">
              <h3 className="font-bold text-gray-900 text-lg mb-6 tracking-tight">Completá tus datos</h3>
              
              {submitResult?.success === false && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200 font-medium">
                  {submitResult.message}
                </div>
              )}
              
              <form onSubmit={handleFormSubmit} onChangeCapture={trackQuoteStarted} className="space-y-8">
                
                {/* SECCIÓN A: CONTACTO */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-[1px] bg-gray-300"></span> Datos de contacto
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre completo *</label>
                      <Input name="name" required placeholder="Ej: Juan Pérez" className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white" onFocus={trackQuoteStarted} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teléfono / WhatsApp *</label>
                      <Input name="phone" required placeholder="Ej: 0981 123 456" className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white" />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email <span className="font-normal text-gray-400">(Opcional)</span></label>
                        <Input name="email" type="email" placeholder="Ej: juan@mail.com" className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ciudad <span className="font-normal text-gray-400">(Opcional)</span></label>
                        <Input name="location" placeholder="Ej: Asunción" className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN B: UBICACIÓN EXACTA */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-[1px] bg-gray-300"></span> Envío (Opcional)
                  </h4>
                  <div className="space-y-4">
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
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Referencia adicional <span className="font-normal text-gray-400">(Opcional)</span></label>
                      <Input 
                        name="locationReference"
                        placeholder="Ej: Portón negro, frente a la plaza"
                        value={locationReference}
                        onChange={(e) => setLocationReference(e.target.value)}
                        disabled={isSubmitting}
                        className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
                
                {/* SECCIÓN C: COMENTARIOS */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-[1px] bg-gray-300"></span> Comentarios
                  </h4>
                  <div>
                    <textarea 
                      name="notes"
                      className="w-full flex min-h-[100px] rounded-xl border border-gray-200 bg-gray-50 focus:bg-white px-4 py-3 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F4E79]/20 focus:border-[#1F4E79] transition-all resize-y"
                      placeholder="Detalles sobre tu proyecto, dudas, requerimientos especiales..."
                    />
                  </div>
                </div>
                
                {/* BOTONES */}
                <div className="pt-4 space-y-4">
                  <Button type="submit" className="w-full bg-[#1F4E79] hover:bg-[#163A5A] text-white h-14 rounded-xl text-base font-bold shadow-md shadow-[#1F4E79]/20 transition-all hover:shadow-lg hover:-translate-y-0.5" disabled={isSubmitting}>
                    {isSubmitting ? 'Procesando...' : (
                      <>
                        <Send className="mr-2" size={20} />
                        Enviar solicitud de presupuesto
                      </>
                    )}
                  </Button>
                  
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-medium uppercase tracking-wider">o si preferís</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>
                  
                  <Button onClick={handleWhatsAppClick} variant="outline" className="w-full border-2 border-green-600 text-green-700 hover:bg-green-50 h-14 rounded-xl text-base font-bold transition-colors" type="button">
                    <MessageCircle className="mr-2" size={20} />
                    Consultar por WhatsApp
                  </Button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Scrollbar personalizado para el contenedor sticky del formulario */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
