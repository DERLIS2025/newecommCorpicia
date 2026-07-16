'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createProjectAction, updateProjectAction } from '@/lib/actions/admin-projects';
import { Loader2, X } from 'lucide-react';

type ProjectFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  project?: any;
};

export function ProjectFormModal({ isOpen, onClose, project }: ProjectFormModalProps) {
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
      if (project?.id) {
        result = await updateProjectAction(project.id, formData);
      } else {
        result = await createProjectAction(formData);
      }

      if (result.success) {
        onClose();
      } else {
        setErrorMsg(result.error || 'Error al guardar el proyecto');
      }
    } catch (error) {
      setErrorMsg('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const defaultDate = project?.project_date 
    ? new Date(project.project_date).toISOString().split('T')[0]
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative flex flex-col">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold">{project ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
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
            <textarea
              id="description"
              name="description"
              defaultValue={project?.description}
              rows={4}
              placeholder="Descripción detallada del proyecto y los trabajos realizados"
              className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corpicia-green focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
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
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  defaultChecked={project ? project.is_active : true}
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
              {project ? 'Guardar Cambios' : 'Crear Proyecto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
