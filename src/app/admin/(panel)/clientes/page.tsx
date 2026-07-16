import { getAdminClients } from '@/lib/repositories/admin-clients';
import { ConnectionNotice } from '@/components/admin/ConnectionNotice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, Users } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminClientesPage() {
  const clients = await getAdminClients();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-gray-500">Base de datos de clientes registrados a través de presupuestos.</p>
        </div>
      </div>

      <ConnectionNotice />

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between gap-3 bg-gray-50/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input className="pl-9" placeholder="Buscar por cliente o teléfono..." disabled />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Contacto</th>
                <th className="px-6 py-4 font-semibold">Ubicación / Notas</th>
                <th className="px-6 py-4 font-semibold text-center">Presupuestos</th>
                <th className="px-6 py-4 font-semibold">Último Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 space-y-2">
                      <Users className="w-8 h-8 text-gray-300" />
                      <p className="text-base font-medium text-gray-900">No hay clientes registrados todavía.</p>
                      <p className="text-sm max-w-md mx-auto">
                        Los clientes aparecerán automáticamente cuando soliciten un presupuesto.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                clients.map((client: any) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{client.name}</div>
                      <div className="text-xs text-gray-400 font-mono mt-1">{client.id.substring(0, 8)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{client.phone}</div>
                      {client.email && <div className="text-gray-500 text-xs">{client.email}</div>}
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                      {client.notes || <span className="italic text-gray-400">Sin detalles</span>}
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                        {client.quotes ? client.quotes.length : 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {format(new Date(client.created_at), "dd MMM yyyy", { locale: es })}
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
