'use client';

// Helper to generate a random ID (pseudo-UUID) for visitors/sessions
function generateId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
}

// Get or create persistent visitor ID
export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let visitorId = localStorage.getItem('corpicia_visitor_id');
  if (!visitorId) {
    visitorId = generateId();
    localStorage.setItem('corpicia_visitor_id', visitorId);
  }
  return visitorId;
}

// Get or create session ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = sessionStorage.getItem('corpicia_session_id');
  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem('corpicia_session_id', sessionId);
  }
  return sessionId;
}

// Detect basic device info without saving exact user-agent if not needed
function getBrowserInfo() {
  if (typeof window === 'undefined') return { browser: 'unknown', os: 'unknown', device_type: 'unknown' };

  const ua = navigator.userAgent;
  let browser = 'unknown';
  let os = 'unknown';
  let device_type = 'desktop';

  // Basic Browser
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('SamsungBrowser')) browser = 'Samsung Internet';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
  else if (ua.includes('Edge') || ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';

  // Basic OS
  if (ua.includes('Win')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('X11')) os = 'UNIX';
  else if (ua.includes('Linux')) os = 'Linux';
  if (ua.includes('Android')) os = 'Android';
  if (ua.includes('like Mac OS X')) os = 'iOS';

  // Device Type
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    device_type = 'tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    device_type = 'mobile';
  }

  return { browser, os, device_type };
}

// Parse UTM parameters from URL
function getUtmParams() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_content: params.get('utm_content') || undefined,
    utm_term: params.get('utm_term') || undefined,
  };
}

export type TrackEventPayload = {
  event_name: string;
  page_path?: string;
  entity_type?: string;
  entity_id?: string;
  landing_page?: string;
  metadata?: Record<string, any>;
};

// Queue to avoid blasting the server if called rapidly
let isTracking = false;
const eventQueue: TrackEventPayload[] = [];

async function processQueue() {
  if (isTracking || eventQueue.length === 0 || typeof window === 'undefined') return;
  isTracking = true;

  try {
    const event = eventQueue.shift();
    if (!event) return;

    const { browser, os, device_type } = getBrowserInfo();
    const utms = getUtmParams();
    
    // Save landing page if it's the very first visit of this session
    let landingPage = sessionStorage.getItem('corpicia_landing_page');
    if (!landingPage) {
      landingPage = window.location.pathname;
      sessionStorage.setItem('corpicia_landing_page', landingPage);
    }

    const payload = {
      ...event,
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      page_path: event.page_path || window.location.pathname,
      device_type,
      browser,
      operating_system: os,
      screen_width: window.innerWidth,
      referrer: document.referrer || undefined,
      landing_page: landingPage,
      ...utms,
      metadata: event.metadata || {},
    };

    // Fire and forget, don't throw on error to prevent breaking UI
    await fetch('/api/tracking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      // keepalive helps ensure the request fires even if navigating away
      keepalive: true 
    }).catch(() => {
      // Silently fail on client to avoid console spam or UI issues
    });
  } finally {
    isTracking = false;
    if (eventQueue.length > 0) {
      setTimeout(processQueue, 100);
    }
  }
}

export function trackEvent(payload: TrackEventPayload) {
  if (typeof window === 'undefined') return;
  eventQueue.push(payload);
  processQueue();
}
