'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { createProjectAction, updateProjectAction } from '@/lib/actions/admin-projects';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type ProjectFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  project?: any;
};

export function ProjectFormModal({ isOpen, onClose, project }: ProjectFormModalProps) {
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
      if (project?.id) {
        result = await updateProjectAction(project.id, formData);
      } else {
        result = await createProjectAction(formData);
      }

      if (result.success) {
        toast.success(project ? 'Proyecto actualizado' : 'Proyecto creado');
        onClose();
      } else {
        toast.error(result.error || 'Error al guardar el proyecto');
      }
    } catch (error) {
      toast.error('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  // Extraer valor de fecha yyyy-mm-dd si existe
  const defaultDate = project?.project_date 
    ? new Date(project.project_date).toISOString().split('T')[0]
    : '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? 'Editar Proyecto' : 'Nuevo Proyecto'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título del Proyecto *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={project?.title}
                onBlur={handleTitleBlur}
                required
                placeholder="Ej: Jardín Residencial Mburucuyá"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={project?.slug}
                required
                placeholder="ej: jardin-residencial-mburucuya"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                name="category"
                defaultValue={project?.category}
                placeholder="Ej: Paisajismo Residencial"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación / Cliente</Label>
              <Input
                id="location"
                name="location"
                defaultValue={project?.location}
                placeholder="Ej: Asunción, Barrio Carmelitas"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={project?.description}
              rows={4}
              placeholder="Descripción detallada del proyecto y los trabajos realizados"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">URL de la Imagen Principal</Label>
            <Input
              id="image_url"
              name="image_url"
              defaultValue={project?.image_url}
              placeholder="https://..."
            />
            <p className="text-xs text-gray-500">
              Pegá la URL directa de la imagen. La galería completa de imágenes se habilitará en una fase posterior.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project_date">Fecha del Proyecto</Label>
              <Input
                id="project_date"
                name="project_date"
                type="date"
                defaultValue={defaultDate}
              />
            </div>
            <div className="flex flex-col space-y-2 justify-center">
              <Label htmlFor="is_active">Activo (Visible)</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  name="is_active"
                  defaultChecked={project ? project.is_active : true}
                />
                <span className="text-sm text-gray-500">
                  {project?.is_active !== false ? 'Público' : 'Oculto'}
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
              {project ? 'Guardar Cambios' : 'Crear Proyecto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
