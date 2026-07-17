// src/lib/validation/announcement.ts

import { z } from 'zod';

// Schema for a top‑bar announcement item
export const TopBarItemSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, 'Texto requerido'),
  emoji: z.string().optional(),
  url: z.string().url().optional(),
  buttonText: z.string().optional(),
  order: z.number().int().nonnegative(),
  enabled: z.boolean(),
});

export const TopBarItemsSchema = z.array(TopBarItemSchema);

// Schema for popup settings
export const PopupSettingsSchema = z.object({
  id: z.string().optional(),
  enabled: z.boolean(),
  imageUrl: z.string().url().optional(),
  title: z.string().optional(),
  text: z.string().optional(),
  buttonText: z.string().optional(),
  buttonUrl: z.string().url().optional(),
  showAfterSeconds: z.number().int().nonnegative().default(0),
  frequencyDays: z.number().int().nonnegative().default(0),
  startDate: z.string().optional(), // ISO date string
  endDate: z.string().optional(),
});

export type TopBarItem = z.infer<typeof TopBarItemSchema>;
export type PopupSettings = z.infer<typeof PopupSettingsSchema>;
