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

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from<TopBarItem>('top_bar_items')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching top‑bar items', error);
          setError(true);
          return;
        }
        const enabled = (data || []).filter((i) => i.enabled).sort((a, b) => a.order - b.order);
        setItems(enabled);
      });
  }, []);

  if (error || items.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-corpicia-green to-corpicia-teal text-white py-2 px-4 flex items-center justify-center gap-4 overflow-x-auto whitespace-nowrap">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.url || '#'}
          className={cn('flex items-center gap-1 hover:opacity-90 transition-opacity')}
        >
          {item.emoji && <span>{item.emoji}</span>}
          <span>{item.text}</span>
          {item.buttonText && (
            <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded">
              {item.buttonText}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
