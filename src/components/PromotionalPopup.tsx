// src/components/PromotionalPopup.tsx

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PopupSettings } from '@/types/announcement';
import Link from 'next/link';

export default function PromotionalPopup() {
  const [settings, setSettings] = useState<PopupSettings | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from<PopupSettings>('popup_settings')
      .select('*')
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (error || !data || !data.enabled) {
          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching popup settings', error);
          }
          return;
        }

        const now = new Date();
        if (data.start_at && now < new Date(data.start_at)) return;
        if (data.end_at && now > new Date(data.end_at)) return;

        setSettings(data);

        const delay = data.show_after_seconds ?? 0;
        if (delay > 0) {
          setTimeout(() => attemptShow(data), delay * 1000);
        } else {
          attemptShow(data);
        }
      });
  }, []);

  const attemptShow = (cfg: PopupSettings) => {
    const id = cfg.id;
    const freq = cfg.frequency_days ?? 30;
    const lastShownKey = `corpicia_popup_last_shown_${id}`;
    const sessionKey = `corpicia_popup_session_${id}`;

    if (freq === 0) {
      // Always show
      setVisible(true);
      return;
    }

    if (freq === -1) {
      // Once per session
      if (!sessionStorage.getItem(sessionKey)) {
        setVisible(true);
        sessionStorage.setItem(sessionKey, 'true');
      }
      return;
    }

    // Once per N days
    const lastShown = localStorage.getItem(lastShownKey);
    if (!lastShown) {
      setVisible(true);
      localStorage.setItem(lastShownKey, new Date().toISOString());
      return;
    }

    const lastDate = new Date(lastShown);
    const diffTime = Math.abs(new Date().getTime() - lastDate.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays >= freq) {
      setVisible(true);
      localStorage.setItem(lastShownKey, new Date().toISOString());
    }
  };

  const close = () => {
    setVisible(false);
  };

  if (!visible || !settings) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-4 md:p-6 relative shadow-2xl animate-in fade-in zoom-in duration-300">
        <button
          onClick={close}
          className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-400 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close popup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {settings.image_url && (
          <div className="mb-4 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={settings.image_url}
              alt={settings.title ?? 'Promoción Corpicia'}
              className="w-full max-h-[300px] object-cover rounded-md"
            />
          </div>
        )}

        <div className="text-center mt-2">
          {settings.title && <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">{settings.title}</h2>}
          {settings.description && <p className="mb-6 text-gray-600 text-sm md:text-base">{settings.description}</p>}

          {settings.button_url && settings.button_text && (
            <Link
              href={settings.button_url}
              onClick={close}
              className="block w-full text-center bg-corpicia-green hover:bg-corpicia-green/90 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              {settings.button_text}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
