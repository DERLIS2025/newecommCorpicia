// src/components/TopBarAnnouncement.tsx

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TopBarItem } from '@/types/announcement';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function TopBarAnnouncement() {
  const [items, setItems] = useState<TopBarItem[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from<TopBarItem>('top_bar_items')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching top‑bar items', error);
          setError(true);
        } else {
          const enabled = (data || []).filter((i) => i.enabled).sort((a, b) => a.order - b.order);
          setItems(enabled);
        }
        setLoading(false);
      });
  }, []);

  if (loading) return null; // Avoid flicker before we know

  const displayItems = (error || items.length === 0) ? [{
    id: 'fallback',
    text: '🌱 Césped Natural, Riego & Jardinería en Paraguay',
    order: 0,
    enabled: true
  } as TopBarItem] : items;

  return (
    <div className="bg-gradient-to-r from-corpicia-green to-corpicia-teal text-white py-2 px-4 flex items-center justify-center gap-4 overflow-x-auto whitespace-nowrap">
      {displayItems.map((item) => {
        const Content = (
          <>
            {item.emoji && <span>{item.emoji}</span>}
            <span>{item.text}</span>
            {item.buttonText && (
              <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded">
                {item.buttonText}
              </span>
            )}
          </>
        );

        if (item.url) {
          return (
            <Link
              key={item.id}
              href={item.url}
              className={cn('flex items-center gap-1 hover:opacity-90 transition-opacity')}
            >
              {Content}
            </Link>
          );
        }

        return (
          <div key={item.id} className="flex items-center gap-1">
            {Content}
          </div>
        );
      })}
    </div>
  );
}
