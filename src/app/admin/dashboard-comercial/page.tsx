import { getDashboardSummary } from '@/lib/repositories/analytics';
import { Users, ShoppingCart, Activity, FileText, CheckCircle, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CommercialDashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Comercial</h1>
          <p className="text-sm text-gray-500">Resumen del rendimiento comercial (Fase 1)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Leads */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Leads Totales</h3>
            <Users className="w-5 h-5 text-corpicia-green" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{summary.leads.total}</p>
          <p className="mt-1 text-xs text-gray-500">Registrados en el CRM</p>
        </div>

        {/* Presupuestos Totales */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Presupuestos Generados</h3>
            <ShoppingCart className="w-5 h-5 text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{summary.quotes.total}</p>
          <p className="mt-1 text-xs text-gray-500">Histórico de presupuestos</p>
        </div>

        {/* Presupuestos Pendientes */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Presupuestos Nuevos</h3>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{summary.quotes.pending}</p>
          <p className="mt-1 text-xs text-gray-500">Esperando atención</p>
        </div>

        {/* Presupuestos Aprobados */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Presupuestos Aprobados</h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{summary.quotes.approved}</p>
          <p className="mt-1 text-xs text-gray-500">Cotizaciones cerradas exitosamente</p>
        </div>
      </div>

      {/* Analytics Preview */}
      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Rendimiento Web</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Páginas Vistas (Histórico)</h3>
            <FileText className="w-5 h-5 text-purple-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {summary.analytics.hasData ? summary.analytics.pageViews : 'Sin datos'}
          </p>
          {!summary.analytics.hasData && (
            <p className="mt-1 text-xs text-orange-500">Recolectando información...</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Dispositivo Principal</h3>
            <Activity className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {summary.analytics.hasData ? summary.analytics.topDevice : 'Sin datos'}
          </p>
          {!summary.analytics.hasData && (
            <p className="mt-1 text-xs text-orange-500">Esperando primeras visitas</p>
          )}
        </div>
      </div>
      
      {!summary.analytics.hasData && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Activity className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Tracking activado</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>El sistema interno de analíticas está escuchando. Los primeros datos aparecerán aquí a medida que los visitantes naveguen por la web.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
