import { getAdminQuotes } from '@/lib/repositories/admin-quotes';
import { ConnectionNotice } from '@/components/admin/ConnectionNotice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPresupuestosPage() {
  const quotes = await getAdminQuotes();

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'nuevo':
      case 'nueva':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Nuevo</span>;
      case 'en_revision':
      case 'en revisión':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">En revisión</span>;
      case 'respondido':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Respondido</span>;
      case 'ganado':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Ganado</span>;
      case 'perdido':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Perdido</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Presupuestos</h1>
          <p className="text-gray-500">Historial de solicitudes de presupuesto enviadas por los clientes.</p>
        </div>
      </div>

      <ConnectionNotice />

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between gap-3 bg-gray-50/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input className="pl-9" placeholder="Buscar por cliente o teléfono..." disabled />
          </div>
          <div className="flex gap-2">
            <select disabled className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
              <option>Todos los estados</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">N° Solicitud</th>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Cliente / Teléfono</th>
                <th className="px-6 py-4 font-semibold">Total Estimado</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 space-y-2">
                      <FileText className="w-8 h-8 text-gray-300" />
                      <p className="text-base font-medium text-gray-900">No hay presupuestos registrados todavía.</p>
                      <p className="text-sm max-w-md mx-auto">
                        Cuando un cliente complete el formulario en la web pública, aparecerá aquí.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                quotes.map((quote: any) => (
                  <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{quote.request_number}</td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {format(new Date(quote.created_at), "dd 'de' MMMM, yyyy", { locale: es })}
                      <div className="text-xs text-gray-400">{format(new Date(quote.created_at), "HH:mm")} hs</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{quote.clients?.name || 'Cliente sin nombre'}</div>
                      <div className="text-gray-500">{quote.clients?.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-corpicia-green">
                      {formatPrice(quote.total_amount)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(quote.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/presupuestos/${quote.id}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                          <Eye className="w-4 h-4 mr-2" /> Ver detalle
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
