'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { createServiceAction, updateServiceAction } from '@/lib/actions/admin-services';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type ServiceFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  service?: any;
};

export function ServiceFormModal({ isOpen, onClose, service }: ServiceFormModalProps) {
  const [loading, setLoading] = useState(false);
  
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
        toast.success(service ? 'Servicio actualizado' : 'Servicio creado');
        onClose();
      } else {
        toast.error(result.error || 'Error al guardar el servicio');
      }
    } catch (error) {
      toast.error('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service ? 'Editar Servicio' : 'Nuevo Servicio'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <Textarea
              id="description"
              name="description"
              defaultValue={service?.description}
              rows={4}
              placeholder="Descripción del servicio que se mostrará al público"
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
                <Switch
                  id="is_active"
                  name="is_active"
                  defaultChecked={service ? service.is_active : true}
                />
                <span className="text-sm text-gray-500">
                  {service?.is_active !== false ? 'Público' : 'Oculto'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-corpicia-green hover:bg-green-700">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {service ? 'Guardar Cambios' : 'Crear Servicio'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
