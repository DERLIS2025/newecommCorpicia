'use client';

import { ConnectionNotice } from '@/components/admin/ConnectionNotice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { productsCatalog } from '@/data/productsData';
import { Save, AlertCircle } from 'lucide-react';

export default function AdminCalculadoraPage() {
  const productsWithTiers = productsCatalog.filter(p => p.priceTiers && p.priceTiers.length > 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calculadora de Presupuestos</h1>
        <p className="text-gray-500">Reglas de cálculo por volumen, unidades y mensajes del carrito.</p>
      </div>

      <ConnectionNotice />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* VARIABLES DE CÁLCULO */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Reglas de Escalas (Tiers)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 border-blue-200 text-blue-800 p-3 rounded-lg flex gap-2 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>La lógica actual de cálculo dinámico se aplica automáticamente a <strong>{productsWithTiers.length} productos</strong> en el catálogo.</p>
                </div>

                <div className="border rounded-lg overflow-hidden divide-y">
                  {productsWithTiers.map(p => (
                    <div key={p.id} className="p-3 bg-white">
                      <div className="font-semibold text-sm mb-2">{p.name}</div>
                      <div className="space-y-1">
                        {p.priceTiers?.map((tier, i) => (
                          <div key={i} className="flex justify-between text-xs text-gray-600 bg-gray-50 p-1.5 rounded">
                            <span>{tier.label}</span>
                            <span className="font-mono font-medium">Gs. {tier.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full text-xs" disabled>Administrar Escalas por Producto</Button>
              </div>
            </CardContent>
          </Card>

          {/* NOTAS Y DISCLAIMERS */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Notas del Presupuesto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Nota 1 (Carrito)</Label>
                  <Input defaultValue="Los precios no incluyen IVA" disabled className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Nota 2 (Carrito)</Label>
                  <Input defaultValue="Empastado e instalación de riego: el precio no incluye preparación del terreno" disabled className="mt-1" />
                </div>
                <Button className="w-full mt-2" disabled>
                  <Save className="w-4 h-4 mr-2" /> Guardar Notas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* WHATSAPP TEMPLATE */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Mensaje de WhatsApp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs">Saludo inicial</Label>
                  <Input defaultValue="Hola, quiero solicitar un presupuesto:" disabled className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Estructura del Ítem (Ejemplo dinámico)</Label>
                  <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-600 mt-1 whitespace-pre-line">
                    1. Césped Esmeralda m²{'\n'}
                       Cantidad: 50 m²{'\n'}
                       Precio estimado: Gs. 1.550.000
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Estructura del Total (Ejemplo dinámico)</Label>
                  <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-600 mt-1">
                    Total estimado: Gs. 1.550.000
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Despedida</Label>
                  <Input defaultValue="¡Gracias!" disabled className="mt-1" />
                </div>
                <Button className="w-full mt-2" disabled>
                  <Save className="w-4 h-4 mr-2" /> Guardar Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* UNIDADES Y MÍNIMOS GLOBALES */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Unidades Soportadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">m²</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">unidad</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">docena</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">visita</span>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                La creación de nuevas unidades requiere actualización de la lógica en el sistema base de la calculadora.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
