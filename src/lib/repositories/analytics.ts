import { supabaseAdmin } from '../supabase/admin';

export async function getDashboardSummary() {
  try {
    // 1. Get Leads from clients
    const { count: leadsCount } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact', head: true });

    // 2. Get Quotes summary
    const { count: quotesCount } = await supabaseAdmin
      .from('quotes')
      .select('*', { count: 'exact', head: true });

    const { count: pendingQuotes } = await supabaseAdmin
      .from('quotes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Nuevo');

    const { count: approvedQuotes } = await supabaseAdmin
      .from('quotes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Aprobado');

    // 3. Get basic events data
    // Usually we would filter by date, but for V1 we just show totals or 'Sin datos suficientes'
    const { data: eventsData, error: eventsError } = await (supabaseAdmin as any)
      .from('analytics_events')
      .select('event_name, device_type, utm_source');

    let totalPageViews = 0;
    let devices = { mobile: 0, desktop: 0, tablet: 0 };
    let topDevice = 'Sin datos';
    let hasEvents = false;

    if (!eventsError && eventsData && eventsData.length > 0) {
      hasEvents = true;
      eventsData.forEach(ev => {
        if (ev.event_name === 'page_view') totalPageViews++;
        
        if (ev.device_type === 'mobile') devices.mobile++;
        else if (ev.device_type === 'desktop') devices.desktop++;
        else if (ev.device_type === 'tablet') devices.tablet++;
      });

      const max = Math.max(devices.mobile, devices.desktop, devices.tablet);
      if (max > 0) {
        if (max === devices.mobile) topDevice = `Móvil (${Math.round((devices.mobile / eventsData.length) * 100)}%)`;
        else if (max === devices.desktop) topDevice = `Desktop (${Math.round((devices.desktop / eventsData.length) * 100)}%)`;
        else if (max === devices.tablet) topDevice = `Tablet (${Math.round((devices.tablet / eventsData.length) * 100)}%)`;
      }
    }

    return {
      leads: {
        total: leadsCount || 0
      },
      quotes: {
        total: quotesCount || 0,
        pending: pendingQuotes || 0,
        approved: approvedQuotes || 0,
      },
      analytics: {
        hasData: hasEvents,
        pageViews: totalPageViews,
        topDevice,
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return {
      leads: { total: 0 },
      quotes: { total: 0, pending: 0, approved: 0 },
      analytics: { hasData: false, pageViews: 0, topDevice: 'Error' }
    };
  }
}
