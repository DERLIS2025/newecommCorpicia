'use client';

import { useState } from 'react';
import { SeoSettingsForm } from './SeoSettingsForm';
import { LayoutTemplate, ChevronRight, FileText, Settings } from 'lucide-react';

const ADMIN_PAGES = [
  { label: 'Inicio', route: '/' },
  { label: 'Productos', route: '/productos' },
  { label: 'Servicios', route: '/servicios' },
  { label: 'Presupuesto', route: '/presupuesto' },
  { label: 'Contacto', route: '/contacto' },
  { label: 'Nosotros', route: '/nosotros' }
];

export function SeoTable({ existingEntries }: { existingEntries: any[] }) {
  const [selectedRoute, setSelectedRoute] = useState<typeof ADMIN_PAGES[0]>(ADMIN_PAGES[0]);

  // Find existing data for the selected route
  const currentEntry = existingEntries.find(e => e.route === selectedRoute.route) || null;

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      
      {/* Sidebar de Rutas */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 border-b px-4 py-3 flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-gray-500" />
            <h3 className="font-semibold text-gray-700">Páginas Administrables</h3>
          </div>
          <div className="flex flex-col">
            {ADMIN_PAGES.map((page) => {
              const isSelected = selectedRoute.route === page.route;
              const hasConfig = existingEntries.some(e => e.route === page.route);
              return (
                <button
                  key={page.route}
                  onClick={() => setSelectedRoute(page)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 text-left border-b last:border-b-0 transition-colors
                    ${isSelected ? 'bg-green-50 border-l-4 border-l-corpicia-green' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <FileText className={`w-4 h-4 ${isSelected ? 'text-corpicia-green' : 'text-gray-400'}`} />
                    <div>
                      <span className={`block font-medium ${isSelected ? 'text-corpicia-green' : 'text-gray-700'}`}>
                        {page.label}
                      </span>
                      <span className="text-xs text-gray-500 font-mono block mt-0.5">{page.route}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {hasConfig && (
                      <span className="w-2 h-2 rounded-full bg-green-500" title="Configuración Activa"></span>
                    )}
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-corpicia-green' : 'text-gray-300'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-blue-800 text-sm">
          <Settings className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
          <p>
            Nota: La configuración SEO de las páginas de detalles de productos individuales (ej: <code className="bg-blue-100 px-1 rounded">/productos/[slug]</code>) se genera automáticamente usando los datos del producto respectivo.
          </p>
        </div>
      </div>

      {/* Formulario Principal */}
      <div className="lg:col-span-8">
        <SeoSettingsForm 
          key={selectedRoute.route} // Force remount on route change
          routeInfo={selectedRoute} 
          initialData={currentEntry}
          onSaved={() => {
            // El action ya hace revalidatePath, 
            // no hace falta recargar manualmente.
          }} 
        />
      </div>

    </div>
  );
}
