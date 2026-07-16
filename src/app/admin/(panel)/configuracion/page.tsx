'use client';

import { ConnectionNotice } from '@/components/admin/ConnectionNotice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

export default function AdminConfiguracionPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración Global</h1>
        <p className="text-gray-500">Administra los datos generales de la empresa y la estructura base del sitio.</p>
      </div>

      <ConnectionNotice />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* INFORMACIÓN DE LA EMPRESA */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>WhatsApp Principal (Ventas)</Label>
                  <Input defaultValue="595992588770" disabled className="mt-1 font-mono text-sm" />
                  <p className="text-xs text-gray-500 mt-1">Este número se usará en el botón flotante y botones de catálogo.</p>
                </div>
                <div>
                  <Label>Email Público</Label>
                  <Input defaultValue="info@corpicia.com" disabled className="mt-1" />
                </div>
                <div>
                  <Label>Email de Recepción de Formularios</Label>
                  <Input defaultValue="corpicia@gmail.com" disabled className="mt-1" />
                </div>
                <div>
                  <Label>Dirección Física</Label>
                  <Input defaultValue="Tu calle y número, Asunción" disabled className="mt-1" />
                </div>
                <Button className="w-full mt-2" disabled>
                  <Save className="w-4 h-4 mr-2" /> Guardar Contactos
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* REDES SOCIALES */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Redes Sociales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Facebook URL</Label>
                  <Input defaultValue="https://www.facebook.com/corpicia" disabled className="mt-1 text-sm" />
                </div>
                <div>
                  <Label>Instagram URL</Label>
                  <Input defaultValue="https://www.instagram.com/corpicia" disabled className="mt-1 text-sm" />
                </div>
                <Button className="w-full mt-2" disabled>
                  <Save className="w-4 h-4 mr-2" /> Guardar Redes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* TOPBAR */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Topbar Marquee</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm mb-2">
                  <input type="checkbox" disabled defaultChecked className="rounded text-corpicia-green focus:ring-corpicia-green" />
                  Mostrar barra superior promocional
                </label>
                <div>
                  <Label>Texto Promocional</Label>
                  <Input defaultValue="¡Oferta Especial! Césped Esmeralda a Gs. 11.500 x m2" disabled className="mt-1" />
                </div>
                <Button className="w-full mt-2" disabled>
                  <Save className="w-4 h-4 mr-2" /> Guardar Topbar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ENLACES Y NAVEGACIÓN */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Páginas de Contenido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-4">
                  El contenido de estas páginas se integrará con el editor de base de datos próximamente.
                </p>
                <Button variant="outline" className="w-full justify-start" disabled>
                  Editar &quot;Nosotros&quot;
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  Editar &quot;Términos y Condiciones&quot;
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  Editar &quot;Políticas de Privacidad&quot;
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
