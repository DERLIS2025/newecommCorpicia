'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { createCategory, updateCategory, deleteCategory, toggleCategoryStatus } from '@/lib/actions/admin-categories';

export default function CategoriesTable({ categories }: { categories: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const formData = new FormData(e.currentTarget);
    
    // Add checkbox manually if not present
    if (!formData.has('is_active')) {
      // HTML forms omit unchecked checkboxes, but we want to explicitly handle it if needed
      // Actually Server Action expects 'on', so if not present it means false.
    }

    try {
      let res;
      if (editingCategory) {
        res = await updateCategory(editingCategory.id, null, formData);
      } else {
        res = await createCategory(null, formData);
      }
      
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        handleCloseModal();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;
    setLoading(true);
    try {
      const res = await deleteCategory(id);
      if (!res.success) {
        alert(`Error: ${res.message}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      const res = await toggleCategoryStatus(id, !currentStatus);
      if (!res.success) {
        alert(`Error: ${res.message}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categorías</h1>
          <p className="text-gray-500">Gestión de las agrupaciones del catálogo.</p>
        </div>
        <Button className="w-full sm:w-auto gap-2" onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" /> Nueva Categoría
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              className="pl-9" 
              placeholder="Buscar categorías..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Nombre</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className={`hover:bg-gray-50/50 ${!cat.is_active ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {cat.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                    {cat.slug}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${cat.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {cat.is_active ? 'Activo' : 'Inactivo'}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(cat.id, cat.is_active === true)}
                        disabled={loading}
                        className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                          cat.is_active
                            ? 'border-red-200 text-red-700 bg-red-50 hover:bg-red-100'
                            : 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100'
                        }`}
                      >
                        {loading ? 'Guardando...' : cat.is_active ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-corpicia-green" onClick={() => handleOpenModal(cat)} disabled={loading}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600" onClick={() => handleDelete(cat.id)} disabled={loading}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No hay categorías.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
                  {errorMsg}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <Input name="name" defaultValue={editingCategory?.name || ''} required />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <Input name="slug" defaultValue={editingCategory?.slug || ''} required />
                <p className="text-xs text-gray-500 mt-1">Identificador único para la URL</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea 
                  name="description" 
                  defaultValue={editingCategory?.description || ''} 
                  className="w-full flex min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL de Imagen (Opcional)</label>
                <Input name="image_url" defaultValue={editingCategory?.image_url || ''} type="url" />
                <p className="text-xs text-gray-500 mt-1">Ingresa una URL manual</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Orden</label>
                <Input name="order_index" type="number" defaultValue={editingCategory?.order_index || 0} />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" name="is_active" value="true" id="is_active" defaultChecked={editingCategory ? editingCategory.is_active === true : true} />
                <label htmlFor="is_active" className="text-sm font-medium cursor-pointer">Categoría Activa</label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t mt-6">
                <Button type="button" variant="outline" onClick={handleCloseModal} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
