// src/lib/supabase/announcement.ts
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { TopBarItem, PopupSettings } from '@/types/announcement';

/** TOP BAR */
export async function getTopBarItems(): Promise<TopBarItem[]> {
  const { data, error } = await supabaseAdmin.from('top_bar_items').select('*');
  if (error) throw error;

  const mapped = (data || []).map((row) => ({
    id: row.id,
    text: row.text, // Assuming text matches message if updated in DB types, wait, we set DB types to text, emoji, url
    emoji: row.emoji ?? undefined,
    url: row.url ?? undefined,
    buttonText: row.button_text ?? undefined,
    order: row.order_index,
    enabled: row.is_active,
  } as TopBarItem));

  return mapped.sort((a, b) => a.order - b.order);
}

/** POPUP */
export async function getPopupSettings(): Promise<PopupSettings | null> {
  const { data, error } = await supabaseAdmin.from('popup_settings').select('*').limit(1).single();
  if (error && error.code !== 'PGRST116') { // row not found
    throw error;
  }
  return (data as PopupSettings) ?? null;
}
