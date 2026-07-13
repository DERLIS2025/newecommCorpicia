'use client';

import Link from 'next/link';
import { ConnectionNotice } from '@/components/admin/ConnectionNotice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { productsCatalog } from '@/data/productsData';
import { Plus, Search, Edit, Trash2, ExternalLink } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export default function AdminProductosPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
          <p className="text-gray-500">Catálogo actual de {productsCatalog.length} productos.</p>
        </div>
        <Link href="/admin/productos/nuevo">
          <Button className="w-full sm:w-auto gap-2">
            <Plus className="w-4 h-4" /> Nuevo Producto
          </Button>
        </Link>
      </div>

      <ConnectionNotice />

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input className="pl-9" placeholder="Buscar productos..." disabled />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Producto</th>
                <th className="px-6 py-4 font-semibold">Categoría</th>
                <th className="px-6 py-4 font-semibold">Precio Base</th>
                <th className="px-6 py-4 font-semibold">Unidad</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {productsCatalog.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 relative overflow-hidden">
                        <Image src={product.images[0] || '/og-image.jpg'} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatPrice(product.pricePerM2)}
                    {product.priceTiers && product.priceTiers.length > 0 && (
                      <span className="block text-xs text-corpicia-green font-normal mt-0.5">
                        {product.priceTiers.length} escalas
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {product.unit}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-corpicia-green" disabled>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600" disabled>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Link href={`/productos/${product.slug}`} target="_blank">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
