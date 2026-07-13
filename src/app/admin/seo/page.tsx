'use client';

import { ConnectionNotice } from '@/components/admin/ConnectionNotice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

export default function AdminSeoPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">SEO & Analytics</h1>
        <p className="text-gray-500">Configuración global de indexación y métricas.</p>
      </div>

      <ConnectionNotice />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* META TAGS GLOBALES */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Meta Tags Globales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Título del Sitio (Default)</Label>
                  <Input defaultValue="Césped Natural, Riego & Jardinería en Paraguay | Corpicia" disabled className="mt-1" />
                </div>
                <div>
                  <Label>Template de Título</Label>
                  <Input defaultValue="%s | Corpicia" disabled className="mt-1 font-mono text-sm" />
                </div>
                <div>
                  <Label>URL Canónica Base</Label>
                  <Input defaultValue="https://www.corpicia.com" disabled className="mt-1 text-sm" />
                </div>
                <div>
                  <Label>Descripción General</Label>
                  <textarea 
                    disabled 
                    className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="Especialistas en césped natural, sistemas de riego automático, paisajismo y mantenimiento de jardines en Paraguay."
                  />
                </div>
                <Button className="w-full mt-2" disabled>
                  <Save className="w-4 h-4 mr-2" /> Guardar Meta Tags
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* TRACKING E INTEGRACIONES */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Tracking e Integraciones (Scripts)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Google Analytics Measurement ID (GA4)</Label>
                  <Input defaultValue="G-9FBEL0RKMY" disabled className="mt-1 font-mono text-sm" />
                </div>
                <div>
                  <Label>Google Tag Manager ID</Label>
                  <Input placeholder="GTM-XXXXXXX" disabled className="mt-1 font-mono text-sm" />
                </div>
                <div>
                  <Label>Google Ads ID</Label>
                  <Input placeholder="AW-XXXXXXXXX" disabled className="mt-1 font-mono text-sm" />
                </div>
                <div>
                  <Label>Meta Pixel ID (Facebook)</Label>
                  <Input placeholder="XXXXXXXXXXXXXXX" disabled className="mt-1 font-mono text-sm" />
                </div>
                <Button className="w-full mt-2" disabled>
                  <Save className="w-4 h-4 mr-2" /> Guardar Trackers
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ROBOTS Y SITEMAP */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Indexación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" disabled defaultChecked className="rounded text-corpicia-green focus:ring-corpicia-green" />
                  Permitir a los motores de búsqueda indexar este sitio
                </label>
                <div className="pt-2">
                  <Button variant="outline" className="w-full" disabled>
                    Regenerar Sitemap.xml
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
