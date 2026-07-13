'use client';

import { ConnectionNotice } from '@/components/admin/ConnectionNotice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function AdminPresupuestosPage() {
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
              <option>Pendiente</option>
              <option>Contactado</option>
              <option>Cerrado</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Cliente / Teléfono</th>
                <th className="px-6 py-4 font-semibold">Total Estimado</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {/* Ejemplo vacío, ya que actualmente no se guardan en BD */}
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 space-y-2">
                    <Clock className="w-8 h-8 text-gray-300" />
                    <p className="text-base font-medium text-gray-900">No hay presupuestos registrados</p>
                    <p className="text-sm max-w-md mx-auto">
                      Actualmente los presupuestos se envían directamente a WhatsApp sin guardarse en el sistema. Esta funcionalidad estará disponible al conectar la base de datos.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
