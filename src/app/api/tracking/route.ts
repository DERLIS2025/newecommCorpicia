import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

const ALLOWED_EVENTS = [
  'page_view',
  'product_view',
  'service_view',
  'project_view',
  'banner_click',
  'whatsapp_click',
  'phone_click',
  'email_click',
  'quote_started',
  'quote_item_added',
  'quote_submitted',
  'search_performed',
  'page_engagement'
];

// Helper to truncate text to avoid payload abuse
function truncate(text: any, maxLength = 500): string | undefined {
  if (typeof text !== 'string') return undefined;
  return text.substring(0, maxLength);
}

export async function POST(req: NextRequest) {
  try {
    // 1. Basic payload size check (NextJS handles this partially, but good practice)
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10240) { // Max 10KB
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const body = await req.json();

    const {
      visitor_id,
      session_id,
      event_name,
      page_path,
      entity_type,
      entity_id,
      device_type,
      screen_width,
      browser,
      operating_system,
      landing_page,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      metadata,
      engagement_seconds,
      button_location
    } = body;

    // Geographic data exclusively from headers (Never from client payload)
    let country = req.headers.get('x-vercel-ip-country') || null;
    let region = req.headers.get('x-vercel-ip-country-region') || null;
    let city = req.headers.get('x-vercel-ip-city') || null;
    
    // Safely decode city if needed (Vercel sometimes URL-encodes headers)
    if (city) {
      try {
        city = decodeURIComponent(city);
      } catch(e) {}
    }

    // 2. Validation
    if (!visitor_id || typeof visitor_id !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid visitor_id' }, { status: 400 });
    }
    if (!session_id || typeof session_id !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid session_id' }, { status: 400 });
    }
    if (!event_name || !ALLOWED_EVENTS.includes(event_name)) {
      return NextResponse.json({ error: 'Invalid event_name' }, { status: 400 });
    }
    if (!page_path || typeof page_path !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid page_path' }, { status: 400 });
    }

    // Validation for engagement_seconds
    let safeEngagement = null;
    if (event_name === 'page_engagement' && typeof engagement_seconds === 'number') {
      if (engagement_seconds > 0 && engagement_seconds <= 1800) {
        safeEngagement = engagement_seconds;
      } else {
        // Drop invalid engagement seconds
        return NextResponse.json({ success: true }); // drop silently
      }
    }

    // 3. Metadata validation (ensure it's an object and not too deep/large)
    let safeMetadata = {};
    if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
      const stringified = JSON.stringify(metadata);
      if (stringified.length <= 2048) {
        safeMetadata = JSON.parse(stringified);
      }
    }

    // 4. Insert into database using admin client to bypass RLS
    const { error } = await (supabaseAdmin as any).from('analytics_events').insert({
      visitor_id: truncate(visitor_id, 100),
      session_id: truncate(session_id, 100),
      event_name,
      page_path: truncate(page_path, 500),
      entity_type: truncate(entity_type, 100),
      entity_id: String(entity_id || '').substring(0, 100) || null, // Enforced as text in DB
      device_type: truncate(device_type, 50),
      screen_width: typeof screen_width === 'number' ? screen_width : null,
      browser: truncate(browser, 100),
      operating_system: truncate(operating_system, 100),
      landing_page: truncate(landing_page, 500),
      referrer: truncate(referrer, 500),
      utm_source: truncate(utm_source, 200),
      utm_medium: truncate(utm_medium, 200),
      utm_campaign: truncate(utm_campaign, 200),
      utm_content: truncate(utm_content, 200),
      utm_term: truncate(utm_term, 200),
      metadata: safeMetadata,
      engagement_seconds: safeEngagement,
      button_location: truncate(button_location, 100),
      country: truncate(country, 10),
      region: truncate(region, 50),
      city: truncate(city, 100)
    });

    if (error) {
      console.error('[Analytics API] Error inserting event:', error.message);
      // We still return 200 to the client so we don't break UI/console on silent tracking failures
      return NextResponse.json({ success: false, reason: 'db_error' });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('[Analytics API] Unexpected error:', err);
    // Return 200 to avoid client-side errors for tracking
    return NextResponse.json({ success: false, reason: 'server_error' });
  }
}
