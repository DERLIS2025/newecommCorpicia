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
import { ServiceFormModal } from './ServiceFormModal';
import { toggleServiceStatusAction, deleteServiceAction } from '@/lib/actions/admin-services';
import { toast } from 'sonner';

type ServicesTableProps = {
  services: any[];
};

export function ServicesTable({ services }: ServicesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNew = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (service: any) => {
    const result = await toggleServiceStatusAction(service.id, service.is_active);
    if (result.success) {
      toast.success(`Servicio ${service.is_active ? 'desactivado' : 'activado'}`);
    } else {
      toast.error(result.error || 'Error al cambiar el estado');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer.')) {
      const result = await deleteServiceAction(id);
      if (result.success) {
        toast.success('Servicio eliminado');
      } else {
        toast.error(result.error || 'Error al eliminar');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Servicios</h1>
          <p className="text-gray-500">Administra los servicios que ofrece Corpicia.</p>
        </div>
        <Button onClick={handleNew} className="w-full sm:w-auto gap-2 bg-corpicia-green hover:bg-green-700">
          <Plus className="w-4 h-4" /> Nuevo Servicio
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar servicio..."
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
              <TableHead>Estado</TableHead>
              <TableHead className="hidden md:table-cell">Orden</TableHead>
              <TableHead className="hidden sm:table-cell">Última Actualización</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                  {searchTerm ? 'No se encontraron resultados.' : 'No hay servicios cargados todavía.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">
                    {service.title}
                    <div className="text-xs text-gray-500 font-normal md:hidden mt-1">
                      Orden: {service.order_index}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={service.is_active ? 'default' : 'secondary'} className={service.is_active ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                      {service.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{service.order_index}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {new Date(service.updated_at).toLocaleDateString('es-PY')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleStatus(service)}
                      >
                        {service.is_active ? 'Desactivar' : 'Activar'}
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleEdit(service)}>
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </Button>
                      <Button variant="outline" size="icon" className="hover:bg-red-50" onClick={() => handleDelete(service.id)}>
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

      <ServiceFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={editingService}
      />
    </div>
  );
}
