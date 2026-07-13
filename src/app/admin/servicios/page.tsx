'use client';

import { ConnectionNotice } from '@/components/admin/ConnectionNotice';
import { Clock } from 'lucide-react';

export default function AdminServiciosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Servicios</h1>
        <p className="text-gray-500">Gestión de la página de servicios.</p>
      </div>

      <ConnectionNotice />

      <div className="bg-white border rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
        <Clock className="w-12 h-12 text-gray-300" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Módulo en Desarrollo</h2>
          <p className="text-gray-500 max-w-md mx-auto mt-1">
            La administración de este contenido estará disponible una vez que se conecte el sistema a la base de datos.
          </p>
        </div>
      </div>
    </div>
  );
}
