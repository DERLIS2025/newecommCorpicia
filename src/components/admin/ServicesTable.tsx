'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { ServiceFormModal } from './ServiceFormModal';
import { toggleServiceStatusAction, deleteServiceAction } from '@/lib/actions/admin-services';

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
    if (!result.success) {
      alert(result.error || 'Error al cambiar el estado');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer.')) {
      const result = await deleteServiceAction(id);
      if (!result.success) {
        alert(result.error || 'Error al eliminar');
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
        <Button onClick={handleNew} className="w-full sm:w-auto gap-2 bg-corpicia-green hover:bg-green-700 text-white">
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

      <div className="border rounded-lg bg-white overflow-x-auto shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-700">Título</th>
              <th className="px-4 py-3 font-medium text-gray-700">Estado</th>
              <th className="px-4 py-3 font-medium text-gray-700 hidden md:table-cell">Orden</th>
              <th className="px-4 py-3 font-medium text-gray-700 hidden sm:table-cell">Última Actualización</th>
              <th className="px-4 py-3 font-medium text-gray-700 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  {searchTerm ? 'No se encontraron resultados.' : 'No hay servicios cargados todavía.'}
                </td>
              </tr>
            ) : (
              filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {service.title}
                    <div className="text-xs text-gray-500 font-normal md:hidden mt-1">
                      Orden: {service.order_index}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      service.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{service.order_index}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    {new Date(service.updated_at).toLocaleDateString('es-PY')}
                  </td>
                  <td className="px-4 py-3 text-right">
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ServiceFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={editingService}
      />
    </div>
  );
}
