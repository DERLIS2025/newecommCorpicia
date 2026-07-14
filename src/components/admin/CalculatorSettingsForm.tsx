'use client';

import { useFormState } from 'react-dom';
import { Save, AlertCircle } from 'lucide-react';
import { updateCalculatorSettings } from '@/lib/actions/admin-calculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialState = {
  success: false,
  message: '',
};

export default function CalculatorSettingsForm({
  productsWithTiers,
  settings,
}: {
  productsWithTiers: any[];
  settings: Record<string, string>;
}) {
  const [state, formAction] = useFormState(updateCalculatorSettings, initialState);

  return (
    <form action={formAction} className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Reglas de Escalas (Tiers)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 border-blue-200 text-blue-800 p-3 rounded-lg flex gap-2 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>
                  La lógica actual de cálculo dinámico se aplica automáticamente a{' '}
                  <strong>{productsWithTiers.length} productos</strong> en el catálogo.
                </p>
              </div>

              <div className="border rounded-lg overflow-hidden divide-y">
                {productsWithTiers.map((p) => (
                  <div key={p.id} className="p-3 bg-white">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="font-semibold text-sm">{p.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{p.slug}</div>
                      </div>

                      <a
                        href={`/admin/productos/${p.id}/editar`}
                        className="inline-flex items-center rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                      >
                        Editar escalas
                      </a>
                    </div>

                    <div className="space-y-1">
                      {p.product_price_tiers?.map((tier: any, i: number) => (
                        <div key={i} className="flex justify-between text-xs text-gray-600 bg-gray-50 p-1.5 rounded">
                          <span>{tier.label || `${tier.min_quantity} a ${tier.max_quantity || '∞'}`}</span>
                          <span className="font-mono font-medium">Gs. {Number(tier.price || 0).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="/admin/productos"
                className="inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                Ver todos los productos
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Notas del Presupuesto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Nota 1 (Carrito)</Label>
                <Input
                  name="budget_note_1"
                  defaultValue={settings.budget_note_1}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs">Nota 2 (Carrito)</Label>
                <Input
                  name="budget_note_2"
                  defaultValue={settings.budget_note_2}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Mensaje de WhatsApp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Saludo inicial</Label>
                <Input
                  name="whatsapp_greeting"
                  defaultValue={settings.whatsapp_greeting}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs">Estructura del Ítem</Label>
                <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-600 mt-1 whitespace-pre-line">
                  1. Césped Esmeralda m²{'\n'}
                  Cantidad: 50 m²{'\n'}
                  Precio estimado: Gs. 1.550.000
                </div>
              </div>

              <div>
                <Label className="text-xs">Estructura del Total</Label>
                <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-600 mt-1">
                  Total estimado: Gs. 1.550.000
                </div>
              </div>

              <div>
                <Label className="text-xs">Despedida</Label>
                <Input
                  name="whatsapp_goodbye"
                  defaultValue={settings.whatsapp_goodbye}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
              La creación de nuevas unidades requiere actualización de la lógica base de la calculadora.
            </p>
          </CardContent>
        </Card>

        {state?.message && (
          <div className={`p-3 rounded-md text-sm ${
            state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {state.message}
          </div>
        )}

        <Button type="submit" className="w-full">
          <Save className="w-4 h-4 mr-2" /> Guardar Configuración
        </Button>
      </div>
    </form>
  );
}
