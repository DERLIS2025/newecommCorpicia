// src/components/PromotionalPopup.tsx

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PopupSettings } from '@/types/announcement';
import { shouldShowPopup, recordPopupShown } from '@/lib/utils/popupFrequency';
import Image from 'next/image';
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
        if (error) {
          console.error('Error fetching popup settings', error);
          return;
        }
        if (!data || !data.enabled) return;
        // Optional date range check
        const now = new Date();
        if (data.startDate && now < new Date(data.startDate)) return;
        if (data.endDate && now > new Date(data.endDate)) return;
        setSettings(data);
        const delay = data.showAfterSeconds ?? 0;
        if (delay > 0) {
          setTimeout(() => attemptShow(data), delay * 1000);
        } else {
          attemptShow(data);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const attemptShow = (cfg: PopupSettings) => {
    const freq = cfg.frequencyDays ?? 0;
    if (shouldShowPopup(freq)) {
      setVisible(true);
      recordPopupShown();
    }
  };

  const close = () => setVisible(false);

  if (!visible || !settings) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg max-w-md w-full p-4 relative">
        <button
          onClick={close}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close popup"
        >
          ✕
        </button>
        {settings.imageUrl && (
          <div className="mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={settings.imageUrl} alt={settings.title ?? 'Promoción'} className="w-full h-auto rounded" />
          </div>
        )}
        {settings.title && <h2 className="text-xl font-bold mb-2">{settings.title}</h2>}
        {settings.text && <p className="mb-4">{settings.text}</p>}
        {settings.buttonUrl && settings.buttonText && (
          <Link href={settings.buttonUrl} passHref>
            <a className="block text-center bg-corpicia-green text-white py-2 rounded">
              {settings.buttonText}
            </a>
          </Link>
        )}
      </div>
    </div>
  );
}
