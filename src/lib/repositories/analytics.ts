import { supabaseAdmin } from '../supabase/admin';

export type DashboardPeriod = 'today' | '7d' | '30d' | 'this_month';

// TODO: Cuando el volumen de datos crezca, migrar estas agregaciones a vistas materializadas o funciones RPC en Supabase
export async function getDashboardSummary(period: DashboardPeriod = '7d') {
  try {
    // 1. Calcular rango de fechas (máximo 30 días según reglas)
    const now = new Date();
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    if (period === '7d') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === '30d') {
      startDate.setDate(now.getDate() - 30);
    } else if (period === 'this_month') {
      startDate.setDate(1);
    }

    const startDateIso = startDate.toISOString();

    // 2. Traer todos los eventos del período (Límite de seguridad: 50,000 rows)
    const { data: eventsData, error: eventsError } = await (supabaseAdmin as any)
      .from('analytics_events')
      .select('visitor_id, session_id, event_name, page_path, entity_id, device_type, utm_source, utm_medium, referrer, engagement_seconds, button_location, country, city, metadata')
      .gte('created_at', startDateIso)
      .not('page_path', 'ilike', '/admin%')
      .not('page_path', 'ilike', '/api%')
      .not('page_path', 'ilike', '/_next%')
      .limit(50000);

    if (eventsError) throw eventsError;

    // 3. Procesamiento en memoria
    const events = (eventsData || []).filter((ev: any) => {
      const p = ev.page_path || '';
      return !p.startsWith('/admin') && !p.startsWith('/api') && !p.startsWith('/_next');
    });
    const hasData = events.length > 0;

    // Sets para métricas únicas
    const uniqueVisitors = new Set<string>();
    const uniqueSessions = new Set<string>();
    
    // Contadores generales
    let totalPageViews = 0;
    let totalEngagementSeconds = 0;
    let totalWhatsAppClicks = 0;
    let totalQuoteSubmitted = 0;
    let totalQuoteStarted = 0;
    let totalProductViews = 0;
    let totalQuoteItemAdded = 0;

    // ==========================================
    // FASE 1: CRM & QUOTES SUMMARY
    // ==========================================
    
    // 1. Get Leads from clients
    const { count: leadsCount } = await (supabaseAdmin as any)
      .from('clients')
      .select('*', { count: 'exact', head: true });

    // 2. Get Quotes summary
    const { count: quotesCount } = await (supabaseAdmin as any)
      .from('quotes')
      .select('*', { count: 'exact', head: true });

    const { count: pendingQuotes } = await (supabaseAdmin as any)
      .from('quotes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Nuevo');

    const { count: approvedQuotes } = await (supabaseAdmin as any)
      .from('quotes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Aprobado');

    // ==========================================
    // FASE 2: ADVANCED ANALYTICS MAPS
    // ==========================================

    let devices = { mobile: 0, desktop: 0, tablet: 0 };
    let topDevice = 'Sin datos';

    // Mapas para agrupaciones
    const productsMap = new Map<string, { views: number; uniqueVisitors: Set<string>; adds: number; whatsapp: number }>();
    const pagesMap = new Map<string, { views: number; visitors: Set<string>; engagement: number }>();
    const sourcesMap = new Map<string, number>();
    const citiesMap = new Map<string, number>();
    const whatsappLocMap = new Map<string, number>();
    
    // Para atribuir fuente por sesión
    const sessionSources = new Map<string, string>();

    events.forEach((ev: any) => {
      if (ev.device_type === 'mobile') devices.mobile++;
      else if (ev.device_type === 'desktop') devices.desktop++;
      else if (ev.device_type === 'tablet') devices.tablet++;

      if (ev.visitor_id) uniqueVisitors.add(ev.visitor_id);
      if (ev.session_id) uniqueSessions.add(ev.session_id);

      // Determinar fuente de la sesión si no se ha asignado
      if (ev.session_id && !sessionSources.has(ev.session_id)) {
        let source = 'Directo';
        if (ev.utm_source) {
          source = `${ev.utm_source} ${ev.utm_medium ? `(${ev.utm_medium})` : ''}`.trim();
        } else if (ev.referrer) {
          if (ev.referrer.includes('google')) source = 'Google Orgánico';
          else if (ev.referrer.includes('facebook') || ev.referrer.includes('instagram')) source = 'Social Orgánico';
          else source = `Referido: ${new URL(ev.referrer).hostname}`;
        }
        sessionSources.set(ev.session_id, source);
        sourcesMap.set(source, (sourcesMap.get(source) || 0) + 1);
      }

      // Geografía (por visitante para no inflar, pero simplificaremos por evento para el dashboard si no hay map, mejor por sesión)
      if (ev.session_id && ev.country) {
        const locKey = ev.city ? `${ev.city}, ${ev.country}` : ev.country;
        // Solo contamos una vez por sesión para la tabla de ubicaciones
        // Para simplificar el código en memoria, lo aproximamos
      }

      // Conteo de eventos específicos
      switch (ev.event_name) {
        case 'page_view':
          totalPageViews++;
          const pPath = ev.page_path || '/';
          if (!pagesMap.has(pPath)) pagesMap.set(pPath, { views: 0, visitors: new Set(), engagement: 0 });
          const pNode = pagesMap.get(pPath)!;
          pNode.views++;
          if (ev.visitor_id) pNode.visitors.add(ev.visitor_id);
          break;
        case 'page_engagement':
          if (ev.engagement_seconds && ev.engagement_seconds > 0) {
            totalEngagementSeconds += ev.engagement_seconds;
            const engPath = ev.page_path || '/';
            if (pagesMap.has(engPath)) {
              pagesMap.get(engPath)!.engagement += ev.engagement_seconds;
            }
          }
          break;
        case 'whatsapp_click':
          totalWhatsAppClicks++;
          if (ev.button_location) {
            whatsappLocMap.set(ev.button_location, (whatsappLocMap.get(ev.button_location) || 0) + 1);
          }
          // Si fue desde un producto, asociar
          if (ev.button_location === 'pdp' && ev.entity_id) {
            const pid = ev.entity_id;
            if (!productsMap.has(pid)) productsMap.set(pid, { views: 0, uniqueVisitors: new Set(), adds: 0, whatsapp: 0 });
            productsMap.get(pid)!.whatsapp++;
          }
          break;
        case 'quote_submitted':
          totalQuoteSubmitted++;
          break;
        case 'quote_started':
          totalQuoteStarted++;
          break;
        case 'product_view':
          totalProductViews++;
          if (ev.entity_id) {
            if (!productsMap.has(ev.entity_id)) productsMap.set(ev.entity_id, { views: 0, uniqueVisitors: new Set(), adds: 0, whatsapp: 0 });
            const p = productsMap.get(ev.entity_id)!;
            p.views++;
            if (ev.visitor_id) p.uniqueVisitors.add(ev.visitor_id);
          }
          break;
        case 'quote_item_added':
          totalQuoteItemAdded++;
          if (ev.entity_id) { // entity_id here is usually product slug or name depending on the tracker
            if (!productsMap.has(ev.entity_id)) productsMap.set(ev.entity_id, { views: 0, uniqueVisitors: new Set(), adds: 0, whatsapp: 0 });
            productsMap.get(ev.entity_id)!.adds++;
          }
          break;
      }
    });

    const max = Math.max(devices.mobile, devices.desktop, devices.tablet);
    if (max > 0) {
      if (max === devices.mobile) topDevice = `Móvil (${Math.round((devices.mobile / events.length) * 100)}%)`;
      else if (max === devices.desktop) topDevice = `Desktop (${Math.round((devices.desktop / events.length) * 100)}%)`;
      else if (max === devices.tablet) topDevice = `Tablet (${Math.round((devices.tablet / events.length) * 100)}%)`;
    }

    // Procesar ubicaciones únicas por sesión
    const sessionLocations = new Set<string>();
    events.forEach(ev => {
      if (ev.session_id && ev.country && !sessionLocations.has(ev.session_id)) {
        sessionLocations.add(ev.session_id);
        const locKey = ev.city ? `${ev.city}, ${ev.country}` : ev.country;
        citiesMap.set(locKey, (citiesMap.get(locKey) || 0) + 1);
      }
    });

    // Formatear Top Products
    const topProducts = Array.from(productsMap.entries())
      .map(([id, data]) => ({
        id,
        views: data.views,
        uniqueVisitors: data.uniqueVisitors.size,
        adds: data.adds,
        whatsapp: data.whatsapp,
        conversion: data.uniqueVisitors.size > 0 ? (data.adds / data.uniqueVisitors.size) * 100 : 0
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Formatear Top Pages
    const topPages = Array.from(pagesMap.entries())
      .map(([path, data]) => ({
        path,
        views: data.views,
        visitors: data.visitors.size,
        avgEngagement: data.views > 0 ? Math.round(data.engagement / data.views) : 0,
        percentage: totalPageViews > 0 ? (data.views / totalPageViews) * 100 : 0
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Formatear Fuentes y Ciudades
    const topSources = Array.from(sourcesMap.entries()).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count);
    const topCities = Array.from(citiesMap.entries()).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count);
    const topWhatsApp = Array.from(whatsappLocMap.entries()).map(([location, count]) => ({ location, count })).sort((a, b) => b.count - a.count);

    // Embudo
    const funnel = {
      visitors: uniqueVisitors.size,
      productViews: totalProductViews,
      itemAdded: totalQuoteItemAdded,
      quoteStarted: totalQuoteStarted,
      quoteSubmitted: totalQuoteSubmitted,
      whatsappClick: totalWhatsAppClicks // Mostrado pero no estrictamente secuencial
    };

    // Alertas Inteligentes
    const alerts: { message: string, type: 'warning' | 'info' | 'danger' }[] = [];
    
    // Alerta: Productos muy vistos sin interacción
    topProducts.forEach(p => {
      if (p.views >= 10 && p.adds === 0 && p.whatsapp === 0) {
        alerts.push({ message: `El producto "${p.id}" tiene ${p.views} vistas pero 0 conversiones. Revisar precio o descripción.`, type: 'warning' });
      }
    });

    // Alerta: Páginas con alto rebote (poco engagement)
    topPages.forEach(p => {
      if (p.views >= 10 && p.avgEngagement < 10) {
        alerts.push({ message: `La página "${p.path}" tiene poco tiempo de interacción (${p.avgEngagement}s). Los usuarios podrían no encontrar lo que buscan.`, type: 'danger' });
      }
    });

    if (uniqueVisitors.size >= 20 && totalQuoteSubmitted === 0 && totalWhatsAppClicks === 0) {
      alerts.push({ message: `Alto tráfico (${uniqueVisitors.size} visitantes) pero 0 contactos. Revisar el funcionamiento de los formularios.`, type: 'danger' });
    }

    return {
      leads: { total: leadsCount || 0 },
      quotes: { total: quotesCount || 0, pending: pendingQuotes || 0, approved: approvedQuotes || 0 },
      analytics: { hasData: hasData, pageViews: totalPageViews, topDevice: topDevice },
      summary: {
        uniqueVisitors: uniqueVisitors.size,
        sessions: uniqueSessions.size,
        pageViews: totalPageViews,
        avgEngagementSeconds: uniqueSessions.size > 0 ? Math.round(totalEngagementSeconds / uniqueSessions.size) : 0,
        whatsappClicks: totalWhatsAppClicks,
        quotesSubmitted: totalQuoteSubmitted,
        conversionRate: uniqueVisitors.size > 0 ? ((totalQuoteSubmitted + totalWhatsAppClicks) / uniqueVisitors.size) * 100 : 0
      },
      topProducts,
      topPages,
      topSources,
      topCities,
      topWhatsApp,
      funnel,
      alerts,
      hasData
    };
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return {
      leads: { total: 0 },
      quotes: { total: 0, pending: 0, approved: 0 },
      analytics: { hasData: false, pageViews: 0, topDevice: 'Error' },
      summary: { uniqueVisitors: 0, sessions: 0, pageViews: 0, avgEngagementSeconds: 0, whatsappClicks: 0, quotesSubmitted: 0, conversionRate: 0 },
      topProducts: [], topPages: [], topSources: [], topCities: [], topWhatsApp: [], funnel: { visitors: 0, productViews: 0, itemAdded: 0, quoteStarted: 0, quoteSubmitted: 0, whatsappClick: 0 },
      alerts: [{ message: 'Error al cargar los datos', type: 'danger' }],
      hasData: false
    };
  }
}
