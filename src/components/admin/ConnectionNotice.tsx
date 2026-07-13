'use client';

import { AlertCircle } from 'lucide-react';

export function ConnectionNotice() {
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 flex items-start gap-3 shadow-sm">
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
      <div>
        <h4 className="font-semibold text-sm">Modo Diseño</h4>
        <p className="text-sm mt-1">
          Esta vista es una representación visual del panel. Los datos provienen del sitio público actual y las acciones de guardado estarán disponibles cuando se conecte la base de datos.
        </p>
      </div>
    </div>
  );
}
