// src/types/announcement.ts

export interface TopBarItem {
  id: string;
  text: string;
  emoji?: string;
  url?: string;
  buttonText?: string;
  order: number;
  enabled: boolean;
}

export interface PopupSettings {
  id: string;
  enabled: boolean;
  image_url: string | null;
  title: string | null;
  description: string | null;
  button_text: string | null;
  button_url: string | null;
  show_after_seconds: number;
  frequency_days: number;
  start_at: string | null; // ISO timestamp
  end_at: string | null;   // ISO timestamp
  created_at: string;
  updated_at: string;
}
