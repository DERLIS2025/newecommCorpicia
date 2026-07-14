'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { ProjectFormModal } from './ProjectFormModal';
import { toggleProjectStatusAction, deleteProjectAction } from '@/lib/actions/admin-projects';

type ProjectsTableProps = {
  projects: any[];
};

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.category && project.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNew = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (project: any) => {
    const result = await toggleProjectStatusAction(project.id, project.is_active);
    if (result.success) {
      // Usar alert simple como fallback o dejar sin notificacion en pantalla si cambia en tiempo real
    } else {
      alert(result.error || 'Error al cambiar el estado');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.')) {
      const result = await deleteProjectAction(id);
      if (!result.success) {
        alert(result.error || 'Error al eliminar');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proyectos</h1>
          <p className="text-gray-500">Administra los trabajos y proyectos realizados.</p>
        </div>
        <Button onClick={handleNew} className="w-full sm:w-auto gap-2 bg-corpicia-green hover:bg-green-700 text-white">
          <Plus className="w-4 h-4" /> Nuevo Proyecto
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar proyecto..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg bg-white overflow-x-auto shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-700">Título</th>
              <th className="px-4 py-3 font-medium text-gray-700 hidden md:table-cell">Categoría</th>
              <th className="px-4 py-3 font-medium text-gray-700">Estado</th>
              <th className="px-4 py-3 font-medium text-gray-700 hidden sm:table-cell">Fecha del Proyecto</th>
              <th className="px-4 py-3 font-medium text-gray-700 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  {searchTerm ? 'No se encontraron resultados.' : 'No hay proyectos cargados todavía.'}
                </td>
              </tr>
            ) : (
              filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {project.title}
                    <div className="text-xs text-gray-500 font-normal md:hidden mt-1">
                      {project.category}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{project.category || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      project.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    {project.project_date ? new Date(project.project_date).toLocaleDateString('es-PY') : '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleStatus(project)}
                      >
                        {project.is_active ? 'Desactivar' : 'Activar'}
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleEdit(project)}>
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </Button>
                      <Button variant="outline" size="icon" className="hover:bg-red-50" onClick={() => handleDelete(project.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProjectFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={editingProject}
      />
    </div>
  );
}
