'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getWhatsAppUrl } from '@/lib/utils';
import type { TopBarItem } from '@/types/announcement';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const fallbackItems: TopBarItem[] = [
  {
    id: 'fallback-1',
    emoji: '🌱',
    text: 'CÉSPED SIEMPRE VERDE — resistente todo el año',
    order: 0,
    enabled: true,
  },
  {
    id: 'fallback-2',
    emoji: '🏡',
    text: 'INSTALACIÓN PROFESIONAL — garantizada en Asunción',
    order: 1,
    enabled: true,
  },
  {
    id: 'fallback-3',
    emoji: '🔥',
    text: 'CÉSPED ESMERALDA + INSTALACIÓN: Gs. 31.000/m² · APROVECHÁ AHORA',
    order: 2,
    enabled: true,
  },
];

export function TopBarAnnouncement() {
  const [items, setItems] = useState<TopBarItem[]>(fallbackItems);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from('top_bar_items')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          if (error) {
            console.error('Error fetching top-bar items', error);
          }
          setItems(fallbackItems);
          return;
        }

        setItems(
          data.map((row) => ({
            id: row.id,
            text: row.text,
            emoji: row.emoji ?? undefined,
            url: row.url ?? undefined,
            buttonText: row.button_text ?? undefined,
            order: row.order_index,
            enabled: row.is_active,
          }))
        );
      });
  }, []);

  const duplicatedItems = [...items, ...items];

  return (
    <div className="bg-red-600 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center">
          <div className="overflow-hidden flex-1">
            <div className="animate-marquee whitespace-nowrap flex gap-8">
              {duplicatedItems.map((item, index) => {
                const content = (
                  <span className="inline-flex items-center gap-2 text-xs sm:text-sm">
                    {item.emoji && <span>{item.emoji}</span>}
                    <strong>{item.text}</strong>
                    {item.buttonText && (
                      <span className="font-normal">{item.buttonText}</span>
                    )}
                  </span>
                );

                if (item.url) {
                  return (
                    <a
                      key={`${item.id}-${index}`}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-90 transition-opacity"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <span key={`${item.id}-${index}`}>
                    {content}
                  </span>
                );
              })}
            </div>
          </div>

          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-white text-red-600 font-bold px-3 py-1.5 rounded-full text-xs transition-all duration-300 hover:scale-105 hover:shadow-lg ml-2 flex-shrink-0"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WHATSAPP</span>
          </a>
        </div>
      </div>
    </div>
  );
}
