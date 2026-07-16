'use client';

import { ConnectionNotice } from '@/components/admin/ConnectionNotice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { homeHeroBanners } from '@/data/banners';
import { Settings, Save, Layout, GripVertical, Image as ImageIcon } from 'lucide-react';

export default function AdminInicioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Página de Inicio</h1>
        <p className="text-gray-500">Configura los bloques estructurales de la página principal.</p>
      </div>

      <ConnectionNotice />

      <div className="grid gap-6">
        {/* BLOQUE: HERO BANNERS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold">1. Hero Banners</CardTitle>
              <p className="text-sm text-gray-500">Controla el bloque superior de la página principal.</p>
            </div>
            <Button variant="outline" size="sm" disabled>
              <Settings className="w-4 h-4 mr-2" />
              Editar en Banners
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-600">
                <p>Actualmente se muestran <strong>{homeHeroBanners.length} banners</strong> en este bloque.</p>
                <p className="mt-1">Los banners se administran desde el módulo <span className="font-semibold">Banners</span>.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BLOQUE: BENEFICIOS */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">2. Beneficios</CardTitle>
            <p className="text-sm text-gray-500">Tarjetas de beneficios (Icono, Título y Descripción).</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: 'Calidad Premium', desc: 'Productos duraderos.' },
                { title: 'Cobertura Nacional', desc: 'Envíos en Paraguay.' },
                { title: 'Asesoría Experta', desc: 'Acompañamiento total.' },
                { title: 'Compra Segura', desc: 'Transparencia total.' }
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 bg-white border p-3 rounded-lg shadow-sm">
                  <GripVertical className="w-5 h-5 text-gray-300 cursor-move" />
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Título</Label>
                      <Input defaultValue={benefit.title} disabled className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Descripción</Label>
                      <Input defaultValue={benefit.desc} disabled className="h-8 text-sm" />
                    </div>
                  </div>
                </div>
              ))}
              <Button disabled className="w-full mt-2">
                <Save className="w-4 h-4 mr-2" /> Guardar Beneficios
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* BLOQUE: PRODUCTOS DESTACADOS */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">3. Productos Destacados</CardTitle>
            <p className="text-sm text-gray-500">Selecciona hasta 4 productos para mostrar en la grilla principal.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Césped Esmeralda', 'Césped Siempre Verde', 'Césped Kavaju', 'Césped Maní'].map((name, i) => (
                  <div key={i} className="border rounded-lg p-3 text-center bg-gray-50">
                    <div className="w-full aspect-square bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                      <ImageIcon className="text-gray-400 w-8 h-8" />
                    </div>
                    <p className="text-sm font-medium line-clamp-1">{name}</p>
                    <Button variant="link" size="sm" className="text-red-600 h-auto p-0 mt-1" disabled>Quitar</Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" disabled className="w-full">
                <Layout className="w-4 h-4 mr-2" /> Seleccionar Productos
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
