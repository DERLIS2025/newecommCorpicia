'use client';

import Link from 'next/link';
import { ConnectionNotice } from '@/components/admin/ConnectionNotice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { productCategories } from '@/data/productsData';

export default function AdminNuevoProductoPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/productos">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nuevo Producto</h1>
          <p className="text-gray-500">Agrega un nuevo producto al catálogo.</p>
        </div>
      </div>

      <ConnectionNotice />

      <form className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* INFORMACIÓN BÁSICA */}
            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
              <h2 className="font-semibold text-lg">Información Básica</h2>
              <div className="space-y-4">
                <div>
                  <Label>Nombre del Producto</Label>
                  <Input placeholder="Ej: Césped Esmeralda" disabled />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Slug (URL)</Label>
                    <Input placeholder="cesped-esmeralda" disabled />
                  </div>
                  <div>
                    <Label>Categoría</Label>
                    <select disabled className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="">Selecciona...</option>
                      {productCategories.filter(c => c.id !== 'all').map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Descripción Corta (SEO / Cards)</Label>
                  <Input placeholder="Resumen breve del producto..." disabled />
                </div>
                <div>
                  <Label>Descripción Detallada</Label>
                  <textarea 
                    disabled 
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Descripción completa..."
                  />
                </div>
              </div>
            </div>

            {/* PRECIOS Y UNIDADES */}
            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
              <h2 className="font-semibold text-lg">Precios y Configuración</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Precio Base</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Gs.</span>
                    <Input className="pl-9" placeholder="0" type="number" disabled />
                  </div>
                </div>
                <div>
                  <Label>Unidad de medida</Label>
                  <select disabled className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="m2">m²</option>
                    <option value="unidad">Unidad</option>
                    <option value="docena">Docena</option>
                    <option value="visita">Visita</option>
                  </select>
                </div>
                <div>
                  <Label>Cantidad mínima</Label>
                  <Input placeholder="1" type="number" disabled />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* IMAGEN PRINCIPAL */}
            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
              <h2 className="font-semibold text-lg">Imagen Principal</h2>
              <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center gap-2 bg-gray-50">
                <ImageIcon className="w-8 h-8 text-gray-400" />
                <div className="text-sm">
                  <span className="text-corpicia-green font-medium cursor-pointer">Sube un archivo</span> o arrástralo aquí
                </div>
                <p className="text-xs text-gray-500">PNG, JPG o WEBP hasta 2MB</p>
              </div>
            </div>

            {/* ESTADO */}
            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
              <h2 className="font-semibold text-lg">Estado</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" disabled defaultChecked className="rounded text-corpicia-green focus:ring-corpicia-green" />
                  Activo (Visible en la tienda)
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" disabled className="rounded text-corpicia-green focus:ring-corpicia-green" />
                  Destacado (Página principal)
                </label>
              </div>
            </div>

            {/* ACCIONES */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" disabled>Cancelar</Button>
              <Button type="button" className="flex-1 gap-2" disabled>
                <Save className="w-4 h-4" /> Guardar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
