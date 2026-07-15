import { getDashboardSummary, DashboardPeriod } from '@/lib/repositories/analytics';
import { Users, FileText, Clock, ShoppingCart, MessageCircle, AlertTriangle, Filter, Eye, MousePointerClick, CheckCircle, Smartphone, Globe, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CommercialDashboardPage({
  searchParams
}: {
  searchParams: { period?: string }
}) {
  const period = (searchParams.period as DashboardPeriod) || '7d';
  
  // Validar periodo
  const validPeriods = ['today', '7d', '30d', 'this_month'];
  const activePeriod = validPeriods.includes(period) ? period : '7d';
  
  const data = await getDashboardSummary(activePeriod as DashboardPeriod);
  const { summary, topProducts, topPages, topSources, topCities, topWhatsApp, funnel, alerts, hasData } = data;

  const getPeriodLabel = (p: string) => {
    if (p === 'today') return 'Hoy';
    if (p === '7d') return '7 Días';
    if (p === '30d') return '30 Días';
    if (p === 'this_month') return 'Este Mes';
    return '7 Días';
  };

  return (
    <div className="space-y-8">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Comercial</h1>
          <p className="text-sm text-gray-500">Métricas avanzadas de tráfico y conversión</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 mr-2">Período:</span>
          {['today', '7d', '30d', 'this_month'].map(p => (
            <Link key={p} href={`?period=${p}`}>
              <button 
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activePeriod === p ? 'bg-corpicia-green text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {getPeriodLabel(p)}
              </button>
            </Link>
          ))}
        </div>
      </div>

      {!hasData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">No hay datos suficientes para el período seleccionado.</h3>
            <p className="mt-1 text-sm text-blue-700">El sistema de analíticas avanzadas está activo, pero aún no se han registrado eventos en este lapso.</p>
          </div>
        </div>
      )}

      {/* BLOQUE H: ALERTS */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <div key={idx} className={`rounded-lg p-4 flex items-start gap-3 border ${
              alert.type === 'danger' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
            }`}>
              <AlertTriangle className={`h-5 w-5 mt-0.5 ${alert.type === 'danger' ? 'text-red-500' : 'text-yellow-500'}`} />
              <p className={`text-sm font-medium ${alert.type === 'danger' ? 'text-red-800' : 'text-yellow-800'}`}>
                {alert.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* BLOQUE A: SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Visitantes Únicos</h3>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{summary.uniqueVisitors}</p>
            <p className="mt-1 text-xs text-gray-500">{summary.sessions} Sesiones</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Páginas Vistas</h3>
              <FileText className="w-5 h-5 text-purple-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{summary.pageViews}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">T. Promedio</h3>
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{summary.avgEngagementSeconds}s</p>
            <p className="mt-1 text-xs text-gray-500">Actividad real por sesión</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Conv. General</h3>
              <CheckCircle className="w-5 h-5 text-corpicia-green" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{summary.conversionRate.toFixed(1)}%</p>
            <p className="mt-1 text-xs text-gray-500">Presupuestos + WhatsApp</p>
          </CardContent>
        </Card>
      </div>

      {/* BLOQUE G: EMBUDO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Embudo Comercial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 p-6 rounded-xl border">
            <div className="text-center w-full">
              <Users className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 font-medium">Visitantes</p>
              <p className="text-2xl font-bold">{funnel.visitors}</p>
            </div>
            <div className="hidden md:block w-8 h-1 bg-gray-200"></div>
            
            <div className="text-center w-full">
              <Eye className="w-8 h-8 mx-auto text-blue-400 mb-2" />
              <p className="text-sm text-gray-500 font-medium">Vistas Prod.</p>
              <p className="text-2xl font-bold">{funnel.productViews}</p>
            </div>
            <div className="hidden md:block w-8 h-1 bg-gray-200"></div>
            
            <div className="text-center w-full">
              <ShoppingCart className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
              <p className="text-sm text-gray-500 font-medium">En Carrito</p>
              <p className="text-2xl font-bold">{funnel.itemAdded}</p>
            </div>
            <div className="hidden md:block w-8 h-1 bg-gray-200"></div>
            
            <div className="text-center w-full">
              <CheckCircle className="w-8 h-8 mx-auto text-corpicia-green mb-2" />
              <p className="text-sm text-gray-500 font-medium">Enviados</p>
              <p className="text-2xl font-bold">{funnel.quoteSubmitted}</p>
            </div>
            <div className="hidden md:block w-8 h-1 bg-gray-200"></div>
            
            <div className="text-center w-full">
              <MessageCircle className="w-8 h-8 mx-auto text-green-500 mb-2" />
              <p className="text-sm text-gray-500 font-medium">WhatsApp</p>
              <p className="text-2xl font-bold">{funnel.whatsappClick}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BLOQUE B: TOP PRODUCTOS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Productos Más Vistos</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="px-4 py-3 border-b">Producto</th>
                  <th className="px-4 py-3 border-b text-right">Vistas</th>
                  <th className="px-4 py-3 border-b text-right">Adds</th>
                  <th className="px-4 py-3 border-b text-right">Conv.</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topProducts.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-4 text-gray-500">Sin datos</td></tr>
                ) : (
                  topProducts.map((p, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{p.id}</td>
                      <td className="px-4 py-3 text-right">{p.views}</td>
                      <td className="px-4 py-3 text-right text-yellow-600 font-medium">{p.adds}</td>
                      <td className="px-4 py-3 text-right text-corpicia-green font-medium">{p.conversion.toFixed(1)}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* BLOQUE C: TOP PAGINAS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Páginas con Mayor Interés</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="px-4 py-3 border-b">Ruta</th>
                  <th className="px-4 py-3 border-b text-right">Vistas</th>
                  <th className="px-4 py-3 border-b text-right">Visitantes</th>
                  <th className="px-4 py-3 border-b text-right">Tiempo Prom.</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topPages.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-4 text-gray-500">Sin datos</td></tr>
                ) : (
                  topPages.map((p, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-900 truncate max-w-[200px]" title={p.path}>{p.path}</td>
                      <td className="px-4 py-3 text-right">{p.views}</td>
                      <td className="px-4 py-3 text-right">{p.visitors}</td>
                      <td className="px-4 py-3 text-right">{p.avgEngagement}s</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* BLOQUE E: FUENTES */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-purple-500" />
              <CardTitle className="text-lg">Fuentes de Tráfico</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="px-4 py-3 border-b">Fuente</th>
                  <th className="px-4 py-3 border-b text-right">Sesiones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topSources.length === 0 ? (
                  <tr><td colSpan={2} className="text-center py-4 text-gray-500">Sin datos</td></tr>
                ) : (
                  topSources.map((s, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-900">{s.source}</td>
                      <td className="px-4 py-3 text-right font-medium">{s.count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* BLOQUE F: UBICACION */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              <CardTitle className="text-lg">Geolocalización (Aprox.)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="px-4 py-3 border-b">Ubicación</th>
                  <th className="px-4 py-3 border-b text-right">Eventos</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topCities.length === 0 ? (
                  <tr><td colSpan={2} className="text-center py-4 text-gray-500">Sin datos</td></tr>
                ) : (
                  topCities.map((c, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-900 truncate max-w-[150px]">{c.city}</td>
                      <td className="px-4 py-3 text-right font-medium">{c.count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <p className="px-4 py-3 text-xs text-gray-400 bg-gray-50 text-center">Ubicación aproximada según la conexión del visitante.</p>
          </CardContent>
        </Card>

        {/* BLOQUE D: WHATSAPP */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-500" />
              <CardTitle className="text-lg">Clics en WhatsApp</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="px-4 py-3 border-b">Ubicación del Botón</th>
                  <th className="px-4 py-3 border-b text-right">Clics</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topWhatsApp.length === 0 ? (
                  <tr><td colSpan={2} className="text-center py-4 text-gray-500">Sin datos</td></tr>
                ) : (
                  topWhatsApp.map((w, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-900">{w.location}</td>
                      <td className="px-4 py-3 text-right text-green-600 font-medium">{w.count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
