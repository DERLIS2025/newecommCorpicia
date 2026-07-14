'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { ProjectFormModal } from './ProjectFormModal';
import { toggleProjectStatusAction, deleteProjectAction } from '@/lib/actions/admin-projects';
import { toast } from 'sonner';

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
      toast.success(`Proyecto ${project.is_active ? 'desactivado' : 'activado'}`);
    } else {
      toast.error(result.error || 'Error al cambiar el estado');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.')) {
      const result = await deleteProjectAction(id);
      if (result.success) {
        toast.success('Proyecto eliminado');
      } else {
        toast.error(result.error || 'Error al eliminar');
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
        <Button onClick={handleNew} className="w-full sm:w-auto gap-2 bg-corpicia-green hover:bg-green-700">
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

      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden sm:table-cell">Fecha del Proyecto</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                  {searchTerm ? 'No se encontraron resultados.' : 'No hay proyectos cargados todavía.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    {project.title}
                    <div className="text-xs text-gray-500 font-normal md:hidden mt-1">
                      {project.category}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{project.category || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={project.is_active ? 'default' : 'secondary'} className={project.is_active ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                      {project.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {project.project_date ? new Date(project.project_date).toLocaleDateString('es-PY') : '-'}
                  </TableCell>
                  <TableCell className="text-right">
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProjectFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={editingProject}
      />
    </div>
  );
}
