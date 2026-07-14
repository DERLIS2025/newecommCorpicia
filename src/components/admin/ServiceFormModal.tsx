'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createServiceAction, updateServiceAction } from '@/lib/actions/admin-services';
import { Loader2, X } from 'lucide-react';

type ServiceFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  service?: any;
};

export function ServiceFormModal({ isOpen, onClose, service }: ServiceFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  if (!isOpen) return null;

  // Basic slug generator helper
  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slugInput = document.getElementById('slug') as HTMLInputElement;
    if (title && slugInput && !slugInput.value) {
      slugInput.value = generateSlug(title);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    formData.set('is_active', formData.has('is_active') ? 'true' : 'false');

    try {
      let result;
      if (service?.id) {
        result = await updateServiceAction(service.id, formData);
      } else {
        result = await createServiceAction(formData);
      }

      if (result.success) {
        onClose();
      } else {
        setErrorMsg(result.error || 'Error al guardar el servicio');
      }
    } catch (error) {
      setErrorMsg('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative flex flex-col">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold">{service ? 'Editar Servicio' : 'Nuevo Servicio'}</h2>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título / Nombre *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={service?.title}
                onBlur={handleTitleBlur}
                required
                placeholder="Ej: Instalación de Césped"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={service?.slug}
                required
                placeholder="ej: instalacion-de-cesped"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
              name="description"
              defaultValue={service?.description}
              rows={4}
              placeholder="Descripción del servicio que se mostrará al público"
              className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corpicia-green focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">URL de la Imagen</Label>
            <Input
              id="image_url"
              name="image_url"
              defaultValue={service?.image_url}
              placeholder="https://..."
            />
            <p className="text-xs text-gray-500">
              Pegá la URL directa de la imagen. El upload de archivos queda para una fase posterior.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order_index">Orden</Label>
              <Input
                id="order_index"
                name="order_index"
                type="number"
                min="0"
                defaultValue={service?.order_index || 0}
              />
            </div>
            <div className="flex flex-col space-y-2 justify-center">
              <Label htmlFor="is_active">Activo (Visible)</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  defaultChecked={service ? service.is_active : true}
                  className="w-4 h-4 text-corpicia-green bg-gray-100 border-gray-300 rounded focus:ring-corpicia-green"
                />
                <span className="text-sm text-gray-500">
                  Visible al público
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-corpicia-green hover:bg-green-700 text-white">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {service ? 'Guardar Cambios' : 'Crear Servicio'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
