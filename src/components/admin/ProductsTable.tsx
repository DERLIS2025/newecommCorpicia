'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, ExternalLink, Copy } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { deleteProduct, duplicateProduct, toggleProductStatus } from '@/lib/actions/admin-products';

const ADMIN_PRODUCT_IMAGE_FALLBACKS: Record<string, string> = {
  'cesped-esmeralda': '/productos/cesped-esmeralda.jpg',
  'cesped-siempre-verde': '/productos/cesped-siempre-verde.jpg',
  'cesped-kavaju': '/productos/cesped-kavaju.jpg',
  'cesped-mani-docena': '/productos/cesped-mani-docena.jpg',
  'granza-blanca-fina-decorativa': '/productos/granza-blanca-fina-decorativa.jpg',
  'canto-rodado': '/productos/canto-rodado.jpg',
  'separador-cesped-caminos': '/productos/separador-cesped-caminos.jpg',
  'piso-ecologico-40x60': '/productos/piso-ecologico-40x60.jpg',
  'pisos-imitacion-madera': '/productos/pisos-imitacion-madera.jpg',
  'aspersor-rain-bird-5004': '/productos/aspersor-rain-bird-5004.jpg',
  'valvula-riego-rain-bird': '/productos/valvula-riego-rain-bird.jpg',
  'difusor-riego': '/productos/difusor-riego.jpg',
  'mini-rotor-rain-bird-3500': '/productos/mini-rotor-rain-bird-3500.jpg',
  'servicio-mantenimiento-jardin': '/productos/servicio-mantenimiento-jardin.jpg',
};

export default function ProductsTable({ products }: { products: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    setLoading(true);
    try {
      const res = await deleteProduct(id);
      if (!res.success) {
        alert(`Error: ${res.message}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    setLoading(true);
    try {
      const res = await duplicateProduct(id);
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
      const res = await toggleProductStatus(id, !currentStatus);
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
          <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
          <p className="text-gray-500">Catálogo actual de {products.length} productos.</p>
        </div>
        <Link href="/admin/productos/nuevo">
          <Button className="w-full sm:w-auto gap-2">
            <Plus className="w-4 h-4" /> Nuevo Producto
          </Button>
        </Link>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              className="pl-9" 
              placeholder="Buscar productos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                <th className="px-6 py-4 font-semibold text-center">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((product) => {
                const fallbackImg = ADMIN_PRODUCT_IMAGE_FALLBACKS[product.slug] || '/og-image.jpg';
                const mainImg = product.product_images?.find((img: any) => img.order_index === 0)?.image_url || product.product_images?.[0]?.image_url || fallbackImg;
                
                return (
                  <tr key={product.id} className={`hover:bg-gray-50/50 ${!product.is_active ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 relative overflow-hidden">
                          <Image src={mainImg} alt={product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            {product.name}
                            {product.is_featured && (
                              <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 rounded uppercase">Dest.</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                        {product.categories?.name || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatPrice(product.price_amount)}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {product.unit} (Mín: {product.min_order_quantity})
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleToggleStatus(product.id, product.is_active)}
                        disabled={loading}
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${product.is_active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                        title="Clic para cambiar estado"
                      >
                        {product.is_active ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-corpicia-green" disabled={loading} onClick={() => handleDuplicate(product.id)} title="Duplicar">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Link href={`/admin/productos/${product.id}/editar`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600" disabled={loading} title="Editar">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600" onClick={() => handleDelete(product.id)} disabled={loading} title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Link href={`/productos/${product.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900" title="Ver en tienda">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No se encontraron productos.
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
