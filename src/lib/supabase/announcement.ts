// src/lib/supabase/announcement.ts
import { supabaseAdmin, assertAdminWritesEnabled } from '@/lib/supabase/admin';
import type { TopBarItem, PopupSettings } from '@/types/announcement';

/** TOP BAR */
export async function getTopBarItems(): Promise<TopBarItem[]> {
  const { data, error } = await supabaseAdmin.from<TopBarItem>('top_bar_items').select('*');
  if (error) throw error;
  return data.sort((a, b) => a.order - b.order);
}

export async function upsertTopBarItem(item: TopBarItem): Promise<void> {
  assertAdminWritesEnabled();
  const { error } = await supabaseAdmin.from<TopBarItem>('top_bar_items').upsert(item);
  if (error) throw error;
}

export async function deleteTopBarItem(id: string): Promise<void> {
  assertAdminWritesEnabled();
  const { error } = await supabaseAdmin.from<TopBarItem>('top_bar_items').delete().eq('id', id);
  if (error) throw error;
}

export async function reorderTopBarItems(items: TopBarItem[]): Promise<void> {
  assertAdminWritesEnabled();
  const updates = items.map((it) =>
    supabaseAdmin.from<TopBarItem>('top_bar_items').update({ order: it.order }).eq('id', it.id)
  );
  const results = await Promise.all(updates);
  results.forEach(({ error }) => { if (error) throw error; });
}

/** POPUP */
export async function getPopupSettings(): Promise<PopupSettings | null> {
  const { data, error } = await supabaseAdmin.from<PopupSettings>('popup_settings').select('*').limit(1).single();
  if (error && error.code !== 'PGRST116') { // row not found
    throw error;
  }
  return data ?? null;
}

export async function upsertPopupSettings(settings: PopupSettings): Promise<void> {
  assertAdminWritesEnabled();
  const { error } = await supabaseAdmin.from<PopupSettings>('popup_settings').upsert(settings);
  if (error) throw error;
}
