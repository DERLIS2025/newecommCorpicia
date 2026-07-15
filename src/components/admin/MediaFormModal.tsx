'use client';

import { useState } from 'react';
import { createMediaAssetAction, updateMediaAssetAction } from '@/lib/actions/admin-media';
import { Loader2, X } from 'lucide-react';

type MediaFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  asset?: any;
};

export function MediaFormModal({ isOpen, onClose, asset }: MediaFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const url = formData.get('url') as string;

    // Simple URL validation
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setErrorMsg('La URL debe comenzar con http:// o https://');
      setLoading(false);
      return;
    }

    try {
      let result;
      if (asset?.id) {
        result = await updateMediaAssetAction(asset.id, formData);
      } else {
        result = await createMediaAssetAction(formData);
      }

      if (result.success) {
        onClose();
      } else {
        setErrorMsg(result.error || 'Error al guardar el recurso multimedia');
      }
    } catch (error) {
      setErrorMsg('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto relative flex flex-col">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold">{asset ? 'Editar Recurso Multimedia' : 'Nuevo Recurso Multimedia'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="file_name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Título *
            </label>
            <input
              id="file_name"
              name="file_name"
              defaultValue={asset?.file_name}
              required
              placeholder="Ej: Foto principal hero"
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corpicia-green focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              URL de la Imagen *
            </label>
            <input
              id="url"
              name="url"
              defaultValue={asset?.url}
              required
              placeholder="https://..."
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corpicia-green focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-xs text-gray-500">
              Pegá la URL directa de la imagen. La subida directa de archivos queda para una fase posterior.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="alt_text" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Texto Alternativo (Alt Text)
            </label>
            <input
              id="alt_text"
              name="alt_text"
              defaultValue={asset?.alt_text}
              placeholder="Descripción corta para SEO y accesibilidad"
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corpicia-green focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="file_type" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Tipo
            </label>
            <input
              id="file_type"
              name="file_type"
              defaultValue={asset?.file_type || 'image'}
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corpicia-green focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 h-10 px-4 py-2"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corpicia-green focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-corpicia-green text-white hover:bg-green-700 h-10 px-4 py-2"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {asset ? 'Guardar Cambios' : 'Crear Recurso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
