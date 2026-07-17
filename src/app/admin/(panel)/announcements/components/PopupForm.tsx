'use client';

import { useState, useTransition } from 'react';
import { PopupSettings } from '@/types/announcement';
import { updatePopupSettings } from '@/lib/actions/admin-announcements';

export default function PopupForm({ initialSettings }: { initialSettings: PopupSettings | null }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [previewImage, setPreviewImage] = useState(initialSettings?.image_url || '');
  const [previewTitle, setPreviewTitle] = useState(initialSettings?.title || '');
  const [previewDesc, setPreviewDesc] = useState(initialSettings?.description || '');
  const [previewBtn, setPreviewBtn] = useState(initialSettings?.button_text || '');

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    if (initialSettings?.id) {
      formData.append('id', initialSettings.id);
    }
    
    startTransition(async () => {
      const res = await updatePopupSettings(null, formData);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form */}
      <div>
        {message && (
          <div className={`p-4 rounded-md mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Configuración General</h3>
            
            <div className="flex items-center gap-2">
              <input type="checkbox" name="enabled" value="true" defaultChecked={initialSettings?.enabled ?? false} id="enabled_popup" />
              <label htmlFor="enabled_popup" className="font-medium text-gray-900">Activar Popup Promocional</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">URL de la Imagen</label>
              <input
                type="url"
                name="image_url"
                defaultValue={initialSettings?.image_url || ''}
                onChange={(e) => setPreviewImage(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-corpicia-green focus:ring-corpicia-green sm:text-sm p-2 border"
              />
              <p className="mt-1 text-xs text-gray-500">Pegá aquí la URL pública de la imagen subida a Supabase Storage.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={initialSettings?.title || ''}
                  onChange={(e) => setPreviewTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-corpicia-green focus:ring-corpicia-green sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <input
                  type="text"
                  name="description"
                  defaultValue={initialSettings?.description || ''}
                  onChange={(e) => setPreviewDesc(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-corpicia-green focus:ring-corpicia-green sm:text-sm p-2 border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Texto del Botón</label>
                <input
                  type="text"
                  name="button_text"
                  defaultValue={initialSettings?.button_text || ''}
                  onChange={(e) => setPreviewBtn(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-corpicia-green focus:ring-corpicia-green sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL del Botón</label>
                <input
                  type="url"
                  name="button_url"
                  defaultValue={initialSettings?.button_url || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-corpicia-green focus:ring-corpicia-green sm:text-sm p-2 border"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Comportamiento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Demora (segundos)</label>
                <input
                  type="number"
                  name="show_after_seconds"
                  min="0"
                  defaultValue={initialSettings?.show_after_seconds ?? 5}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-corpicia-green focus:ring-corpicia-green sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Frecuencia</label>
                <select
                  name="frequency_days"
                  defaultValue={initialSettings?.frequency_days ?? 30}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-corpicia-green focus:ring-corpicia-green sm:text-sm p-2 border bg-white"
                >
                  <option value="0">Mostrar Siempre</option>
                  <option value="-1">Una vez por sesión</option>
                  <option value="1">Una vez al día</option>
                  <option value="7">Una vez a la semana</option>
                  <option value="30">Una vez al mes</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Inicio (opcional)</label>
                <input
                  type="datetime-local"
                  name="start_at"
                  defaultValue={initialSettings?.start_at ? new Date(initialSettings.start_at).toISOString().slice(0, 16) : ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-corpicia-green focus:ring-corpicia-green sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Fin (opcional)</label>
                <input
                  type="datetime-local"
                  name="end_at"
                  defaultValue={initialSettings?.end_at ? new Date(initialSettings.end_at).toISOString().slice(0, 16) : ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-corpicia-green focus:ring-corpicia-green sm:text-sm p-2 border"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 text-sm font-medium text-white bg-corpicia-green border border-transparent rounded-md hover:bg-corpicia-green/90 disabled:opacity-50 flex items-center gap-2"
            >
              {isPending && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>}
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>

      {/* Preview */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Vista Previa</h3>
        <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center border-2 border-dashed border-gray-300 min-h-[400px]">
          <div className="bg-white rounded-lg max-w-md w-full p-4 relative shadow-2xl">
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close popup"
            >
              ✕
            </button>
            {previewImage ? (
              <div className="mb-4 bg-gray-200 rounded min-h-[150px] flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewImage} alt="Preview" className="w-full h-auto object-cover" />
              </div>
            ) : (
              <div className="mb-4 bg-gray-200 rounded h-32 flex items-center justify-center text-gray-400 text-sm">
                Sin Imagen
              </div>
            )}
            
            {(previewTitle || previewDesc || previewBtn) ? (
              <>
                {previewTitle && <h2 className="text-xl font-bold mb-2 text-gray-900">{previewTitle}</h2>}
                {previewDesc && <p className="mb-4 text-gray-600">{previewDesc}</p>}
                {previewBtn && (
                  <div className="block text-center bg-corpicia-green text-white py-2 rounded cursor-pointer mt-4">
                    {previewBtn}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-400 text-sm py-4">Completá los campos para ver el contenido</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
