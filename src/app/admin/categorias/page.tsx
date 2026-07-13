'use client';

import { ConnectionNotice } from '@/components/admin/ConnectionNotice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { productCategories, productsCatalog } from '@/data/productsData';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function AdminCategoriasPage() {
  // Filtramos la categoría "all" ya que es del front y no debería ser administrable
  const categoriasReales = productCategories.filter(c => c.id !== 'all');

  const getProductCount = (categoryId: string) => {
    return productsCatalog.filter(p => p.category === categoryId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categorías</h1>
          <p className="text-gray-500">Gestión de las agrupaciones del catálogo.</p>
        </div>
        <Button className="w-full sm:w-auto gap-2" disabled>
          <Plus className="w-4 h-4" /> Nueva Categoría
        </Button>
      </div>

      <ConnectionNotice />

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input className="pl-9" placeholder="Buscar categorías..." disabled />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Nombre</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold text-center">Productos</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categoriasReales.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {cat.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                    {cat.slug}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full min-w-[2rem]">
                      {getProductCount(cat.id)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-corpicia-green" disabled>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600" disabled>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {categoriasReales.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No hay categorías registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
