import { getAdminQuote } from '@/lib/repositories/admin-quotes';
import { QuoteStatusUpdater } from '@/components/admin/QuoteStatusUpdater';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Phone, MapPin, Mail, MessageCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminQuoteDetailPage({ params }: { params: { id: string } }) {
  const quote = (await getAdminQuote(params.id)) as any;

  if (!quote) {
    notFound();
  }

  const client = quote.clients;
  const items = quote.quote_items || [];
  
  const cleanPhone = client?.phone?.replace(/\D/g, '') || '';
  const waLink = `https://wa.me/${cleanPhone.startsWith('0') ? '595' + cleanPhone.slice(1) : cleanPhone}`;

  const renderNotesWithLinks = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(https:\/\/(?:www\.)?google\.com\/maps[^\s]+|https:\/\/maps\.app\.goo\.gl\/[^\s]+)/g);
    
    return (
      <>
        {parts.map((part, i) => {
          if (!part || part === 'www.') return null;
          if (part.startsWith('https://')) {
            return (
              <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium break-all">
                {part}
              </a>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/presupuestos">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Solicitud {quote.request_number}</h1>
          <p className="text-gray-500">Detalles del presupuesto y contacto.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Left Column: Items */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50/50">
              <h2 className="font-semibold text-gray-900">Productos solicitados</h2>
            </div>
            
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b">
                <tr>
                  <th className="px-6 py-3 font-semibold">Producto</th>
                  <th className="px-6 py-3 font-semibold text-center">Cantidad</th>
                  <th className="px-6 py-3 font-semibold text-right">Precio Unit.</th>
                  <th className="px-6 py-3 font-semibold text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.product_name_snapshot}</td>
                    <td className="px-6 py-4 text-center">{item.quantity} <span className="text-gray-500 text-xs ml-1">{item.unit_snapshot}</span></td>
                    <td className="px-6 py-4 text-right text-gray-500">{formatPrice(item.unit_price_amount)}</td>
                    <td className="px-6 py-4 text-right font-medium">{formatPrice(item.subtotal_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
              <span className="font-semibold text-gray-600">Total Estimado</span>
              <span className="text-xl font-bold text-corpicia-green">{formatPrice(quote.total_amount)}</span>
            </div>
          </div>
          
          {quote.notes && (
            <div className="bg-white border rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Mensaje del cliente</h3>
              <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm border">
                {renderNotesWithLinks(quote.notes)}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Client & Status */}
        <div className="space-y-6">
          
          {/* Status Box */}
          <div className="bg-white border rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Estado de Solicitud</h3>
            <QuoteStatusUpdater quoteId={quote.id} currentStatus={quote.status} />
            
            <div className="mt-4 pt-4 border-t flex items-center text-sm text-gray-500 gap-2">
              <Calendar className="w-4 h-4" />
              <span>Recibido el {format(new Date(quote.created_at), "dd MMM yyyy, HH:mm", { locale: es })}</span>
            </div>
          </div>
          
          {/* Client Details */}
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50/50">
              <h2 className="font-semibold text-gray-900">Datos del Cliente</h2>
            </div>
            <div className="p-5 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">{client?.name || 'Sin nombre'}</div>
                  <div className="text-gray-500 text-xs">ID: {client?.id.substring(0,8)}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <div className="text-gray-900 font-medium">{client?.phone}</div>
              </div>
              
              {client?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div className="text-gray-700">{client.email}</div>
                </div>
              )}
              
              {client?.notes && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {renderNotesWithLinks(client.notes)}
                  </div>
                </div>
              )}
              
              <div className="pt-4 mt-4 border-t">
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <MessageCircle className="w-4 h-4 mr-2" /> 
                    Contactar por WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
