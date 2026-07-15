import { ConnectionNotice } from '@/components/admin/ConnectionNotice';
import CalculatorSettingsForm from '@/components/admin/CalculatorSettingsForm';
import { getAdminProducts } from '@/lib/repositories/admin';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const defaultCalculatorSettings: Record<string, string> = {
  budget_note_1: 'Los precios no incluyen IVA',
  budget_note_2: 'Empastado e instalación de riego: el precio no incluye preparación del terreno',
  whatsapp_greeting: 'Hola, quiero solicitar un presupuesto:',
  whatsapp_goodbye: '¡Gracias!',
};

async function getCalculatorSettings() {
  try {
    const { data, error } = await (supabaseAdmin as any)
      .from('calculator_settings')
      .select('key, value');

    if (error || !data) return defaultCalculatorSettings;

    return data.reduce((acc: Record<string, string>, item: any) => {
      acc[item.key] = item.value?.text || defaultCalculatorSettings[item.key] || '';
      return acc;
    }, { ...defaultCalculatorSettings });
  } catch {
    return defaultCalculatorSettings;
  }
}

export default async function AdminCalculadoraPage() {
  const adminProducts = await getAdminProducts();
  const productsWithTiers = adminProducts.filter((p: any) => p.product_price_tiers && p.product_price_tiers.length > 0);
  const settings = await getCalculatorSettings();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calculadora de Presupuestos</h1>
        <p className="text-gray-500">Reglas de cálculo por volumen, unidades y mensajes del carrito.</p>
      </div>

      <ConnectionNotice />

      <CalculatorSettingsForm
        productsWithTiers={productsWithTiers}
        settings={settings}
      />
    </div>
  );
}
