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
    const productsMap = new Map<string, { name: string; views: number; viewers: Set<string>; adds: number; adders: Set<string>; whatsapp: number; whatsappers: Set<string> }>();
    const pagesMap = new Map<string, { views: number; visitors: Set<string>; engagement: number }>();
    const sourcesMap = new Map<string, number>();
    const devicesMap = new Map<string, { label: string; visitors: Set<string>; sessions: Set<string>; pageViews: number; engagement: number; whatsapp: number; quotes: number }>();
    const locationsMap = new Map<string, { label: string; visitors: Set<string>; sessions: Set<string>; pageViews: number; engagement: number; whatsapp: number; quotes: number }>();
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

      // 1. Device Aggregation
      let d = 'Desconocido';
      if (ev.device_type === 'mobile') d = 'Teléfono';
      else if (ev.device_type === 'desktop') d = 'Computadora';
      else if (ev.device_type === 'tablet') d = 'Tablet';
      else if (ev.screen_width) {
        if (ev.screen_width < 768) d = 'Teléfono';
        else if (ev.screen_width < 1024) d = 'Tablet';
        else d = 'Computadora';
      }

      if (!devicesMap.has(d)) {
        devicesMap.set(d, { label: d, visitors: new Set(), sessions: new Set(), pageViews: 0, engagement: 0, whatsapp: 0, quotes: 0 });
      }
      const dNode = devicesMap.get(d)!;
      if (ev.visitor_id) dNode.visitors.add(ev.visitor_id);
      if (ev.session_id) dNode.sessions.add(ev.session_id);

      // 2. Location Aggregation
      let locKey = 'unknown';
      let locLabel = 'Sin datos de ubicación';
      if (ev.country) {
        const safeCity = ev.city ? ev.city.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ' ') : '';
        const safeRegion = ev.region ? ev.region.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ' ') : '';
        const safeCountry = ev.country.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ' ');
        locKey = `${safeCity}|${safeRegion}|${safeCountry}`;
        if (ev.city && ev.region) locLabel = `${ev.city}, ${ev.region}, ${ev.country}`;
        else if (ev.city) locLabel = `${ev.city}, ${ev.country}`;
        else if (ev.region) locLabel = `${ev.region}, ${ev.country}`;
        else locLabel = ev.country;
      }
      
      if (!locationsMap.has(locKey)) {
        locationsMap.set(locKey, { label: locLabel, visitors: new Set(), sessions: new Set(), pageViews: 0, engagement: 0, whatsapp: 0, quotes: 0 });
      }
      const lNode = locationsMap.get(locKey)!;
      if (ev.visitor_id) lNode.visitors.add(ev.visitor_id);
      if (ev.session_id) lNode.sessions.add(ev.session_id);

      // Helper para normalizar producto
      const normalizeProductKey = (e: any) => {
        let raw = e.metadata?.product_slug || e.entity_id || e.metadata?.product_name || '';
        if (!raw) return 'desconocido';
        return raw.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      };
      const resolveProductName = (e: any, pid: string) => {
        if (e.metadata?.product_name && e.metadata.product_name !== pid) return e.metadata.product_name;
        if (e.metadata?.productName && e.metadata.productName !== pid) return e.metadata.productName;
        return pid.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      };

      // Conteo de eventos específicos
      switch (ev.event_name) {
        case 'page_view':
          totalPageViews++;
          dNode.pageViews++;
          lNode.pageViews++;
          const pPath = ev.page_path || '/';
          if (!pagesMap.has(pPath)) pagesMap.set(pPath, { views: 0, visitors: new Set(), engagement: 0 });
          const pNode = pagesMap.get(pPath)!;
          pNode.views++;
          if (ev.visitor_id) pNode.visitors.add(ev.visitor_id);
          break;
        case 'page_engagement':
          if (ev.engagement_seconds && ev.engagement_seconds > 0) {
            totalEngagementSeconds += ev.engagement_seconds;
            dNode.engagement += ev.engagement_seconds;
            lNode.engagement += ev.engagement_seconds;
            const engPath = ev.page_path || '/';
            if (pagesMap.has(engPath)) {
              pagesMap.get(engPath)!.engagement += ev.engagement_seconds;
            }
          }
          break;
        case 'whatsapp_click':
          totalWhatsAppClicks++;
          dNode.whatsapp++;
          lNode.whatsapp++;
          if (ev.button_location) {
            whatsappLocMap.set(ev.button_location, (whatsappLocMap.get(ev.button_location) || 0) + 1);
          }
          // Si fue desde un producto, asociar
          if (ev.button_location === 'pdp' && ev.entity_id) {
            const pid = normalizeProductKey(ev);
            const pName = resolveProductName(ev, pid);
            if (!productsMap.has(pid)) productsMap.set(pid, { name: pName, views: 0, viewers: new Set(), adds: 0, adders: new Set(), whatsapp: 0, whatsappers: new Set() });
            const p = productsMap.get(pid)!;
            p.whatsapp++;
            if (ev.visitor_id) p.whatsappers.add(ev.visitor_id);
          }
          break;
        case 'quote_submitted':
          totalQuoteSubmitted++;
          dNode.quotes++;
          lNode.quotes++;
          break;
        case 'quote_started':
          totalQuoteStarted++;
          break;
        case 'product_view':
          totalProductViews++;
          if (ev.entity_id) {
            const pid = normalizeProductKey(ev);
            const pName = resolveProductName(ev, pid);
            if (!productsMap.has(pid)) productsMap.set(pid, { name: pName, views: 0, viewers: new Set(), adds: 0, adders: new Set(), whatsapp: 0, whatsappers: new Set() });
            const p = productsMap.get(pid)!;
            p.views++;
            if (ev.visitor_id) p.viewers.add(ev.visitor_id);
          }
          break;
        case 'quote_item_added':
          totalQuoteItemAdded++;
          if (ev.entity_id) { 
            const pid = normalizeProductKey(ev);
            const pName = resolveProductName(ev, pid);
            if (!productsMap.has(pid)) productsMap.set(pid, { name: pName, views: 0, viewers: new Set(), adds: 0, adders: new Set(), whatsapp: 0, whatsappers: new Set() });
            const p = productsMap.get(pid)!;
            p.adds++;
            if (ev.visitor_id) p.adders.add(ev.visitor_id);
          }
          break;
      }
    });

    // Formatear Devices
    const deviceStats = Array.from(devicesMap.values()).map(d => ({
      label: d.label,
      visitors: d.visitors.size,
      sessions: d.sessions.size,
      pageViews: d.pageViews,
      avgEngagement: d.sessions.size > 0 ? Math.round(d.engagement / d.sessions.size) : 0,
      whatsapp: d.whatsapp,
      quotes: d.quotes,
      conversion: d.visitors.size > 0 ? ((d.quotes + d.whatsapp) / d.visitors.size) * 100 : 0,
      percentage: uniqueVisitors.size > 0 ? (d.visitors.size / uniqueVisitors.size) * 100 : 0
    })).sort((a, b) => b.visitors - a.visitors);

    const topDeviceLabel = deviceStats.length > 0 && deviceStats[0].visitors > 0 ? `${deviceStats[0].label} — ${Math.round(deviceStats[0].percentage)}%` : 'Sin datos';

    // Formatear Locations
    const locationStats = Array.from(locationsMap.values()).map(l => ({
      label: l.label,
      visitors: l.visitors.size,
      sessions: l.sessions.size,
      pageViews: l.pageViews,
      avgEngagement: l.sessions.size > 0 ? Math.round(l.engagement / l.sessions.size) : 0,
      whatsapp: l.whatsapp,
      quotes: l.quotes,
      conversion: l.visitors.size > 0 ? ((l.quotes + l.whatsapp) / l.visitors.size) * 100 : 0
    })).sort((a, b) => b.visitors - a.visitors);

    // Formatear Top Products
    const topProducts = Array.from(productsMap.entries())
      .map(([id, data]) => {
        // Unir visitantes de adds y whatsapp
        const converters = new Set([...data.adders, ...data.whatsappers]);
        const convRate = data.viewers.size > 0 ? (converters.size / data.viewers.size) * 100 : 0;
        return {
          id: data.name,
          views: data.views,
          uniqueVisitors: data.viewers.size,
          adds: data.adds,
          whatsapp: data.whatsapp,
          conversion: Math.min(convRate, 100)
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Helper para formatear rutas
    const getPageLabel = (p: string) => {
      // Normalizar ruta: sin query, sin hash, sin barra final (salvo en '/') y sin barras repetidas
      let path = p.split('?')[0].split('#')[0].replace(/\/+/g, '/').replace(/(.)\/$/, '$1');
      
      if (path === '/') return 'Inicio';
      if (path === '/productos') return 'Productos';
      if (path.startsWith('/productos/')) {
        const slug = path.replace('/productos/', '').trim();
        if (!slug) return 'Productos';
        return `Producto: ${slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}`;
      }
      if (path === '/servicios') return 'Servicios';
      if (path === '/presupuesto') return 'Presupuesto';
      return path;
    };

    // Formatear Top Pages
    const topPages = Array.from(pagesMap.entries())
      .map(([path, data]) => ({
        path: getPageLabel(path),
        views: data.views,
        visitors: data.visitors.size,
        avgEngagement: data.views > 0 ? Math.round(data.engagement / data.views) : 0,
        percentage: totalPageViews > 0 ? (data.views / totalPageViews) * 100 : 0
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Formatear Fuentes y otros
    const topSources = Array.from(sourcesMap.entries()).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count);
    
    const getWhatsAppLabel = (loc: string) => {
      const labels: Record<string, string> = {
        'floating_button': 'Botón flotante',
        'product_detail': 'Detalle de producto',
        'product_card': 'Tarjeta de producto',
        'budget_drawer': 'Carrito de presupuesto',
        'quote_page': 'Página de presupuesto',
        'service_card': 'Servicio',
        'contact_page': 'Contacto',
        'footer': 'Pie de página',
        'final_cta': 'CTA final',
        'hero': 'Banner principal'
      };
      return labels[loc] || loc;
    };
    
    const topWhatsApp = Array.from(whatsappLocMap.entries()).map(([location, count]) => ({ location: getWhatsAppLabel(location), count })).sort((a, b) => b.count - a.count);

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
      analytics: { hasData: hasData, pageViews: totalPageViews, topDevice: topDeviceLabel },
      deviceStats,
      locationStats,
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
      deviceStats: [],
      locationStats: [],
      summary: { uniqueVisitors: 0, sessions: 0, pageViews: 0, avgEngagementSeconds: 0, whatsappClicks: 0, quotesSubmitted: 0, conversionRate: 0 },
      topProducts: [], topPages: [], topSources: [], topWhatsApp: [], funnel: { visitors: 0, productViews: 0, itemAdded: 0, quoteStarted: 0, quoteSubmitted: 0, whatsappClick: 0 },
      alerts: [{ message: 'Error al cargar los datos', type: 'danger' }],
      hasData: false
    };
  }
}
