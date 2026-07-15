'use client';

import { useState } from 'react';
import { saveSeoEntryAction } from '@/lib/actions/admin-seo';
import { Loader2, Save } from 'lucide-react';

type SeoSettingsFormProps = {
  routeInfo: { label: string; route: string };
  initialData: any | null;
  onSaved: () => void;
};

export function SeoSettingsForm({ routeInfo, initialData, onSaved }: SeoSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    formData.append('route', routeInfo.route);

    try {
      const result = await saveSeoEntryAction(formData);

      if (result.success) {
        setSuccessMsg('SEO actualizado correctamente.');
        onSaved();
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(result.error || 'No se pudo guardar la configuración SEO.');
      }
    } catch (error) {
      setErrorMsg('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-1">SEO: {routeInfo.label}</h2>
      <p className="text-sm text-gray-500 mb-6 font-mono bg-gray-50 inline-block px-2 py-1 rounded">
        Ruta: {routeInfo.route}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {successMsg && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm border border-green-200">
            {successMsg}
          </div>
        )}
        
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
            {errorMsg}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium leading-none">
            Meta Title *
          </label>
          <input
            id="title"
            name="title"
            defaultValue={initialData?.title}
            required
            placeholder="Ej: Inicio | Corpicia"
            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corpicia-green"
          />
          <p className="text-xs text-gray-500">Longitud recomendada: 50-60 caracteres.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium leading-none">
            Meta Description *
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={initialData?.description}
            required
            rows={3}
            placeholder="Breve descripción del contenido de esta página..."
            className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corpicia-green"
          />
          <p className="text-xs text-gray-500">Longitud recomendada: 150-160 caracteres.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="keywords" className="text-sm font-medium leading-none">
            Palabras Clave (Keywords)
          </label>
          <input
            id="keywords"
            name="keywords"
            defaultValue={initialData?.keywords}
            placeholder="Ej: jardinería, césped, asunción (separados por coma)"
            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corpicia-green"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="og_image" className="text-sm font-medium leading-none">
            URL Imagen Compartir (OpenGraph)
          </label>
          <input
            id="og_image"
            name="og_image"
            defaultValue={initialData?.og_image}
            placeholder="https://..."
            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corpicia-green"
          />
          <p className="text-xs text-gray-500">Opcional. Imagen recomendada: 1200x630px.</p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input 
            type="checkbox" 
            id="is_active"
            name="is_active"
            value="true"
            defaultChecked={initialData ? initialData.is_active : true}
            className="w-4 h-4 text-corpicia-green border-gray-300 rounded focus:ring-corpicia-green"
          />
          <label htmlFor="is_active" className="text-sm font-medium">
            Permitir a los motores de búsqueda indexar esta página (Indexable)
          </label>
        </div>

        <div className="pt-4 border-t">
          <button 
            type="submit" 
            disabled={loading} 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corpicia-green focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-corpicia-green text-white hover:bg-green-700 h-10 px-4 py-2 w-full sm:w-auto"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}
