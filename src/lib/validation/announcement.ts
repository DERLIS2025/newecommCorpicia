import { z } from 'zod';

export const topBarItemSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, 'El texto es obligatorio').max(150, 'Texto demasiado largo'),
  emoji: z.string().optional().nullable(),
  url: z.string().url('URL inválida').optional().or(z.literal('')).nullable(),
  buttonText: z.string().optional().nullable(),
  order: z.number().int().default(0),
  enabled: z.boolean().default(true),
});

export const popupSettingsSchema = z.object({
  id: z.string().optional(),
  enabled: z.boolean().default(false),
  image_url: z.string().url('URL inválida').optional().or(z.literal('')).nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  button_text: z.string().optional().nullable(),
  button_url: z.string().url('URL inválida').optional().or(z.literal('')).nullable(),
  show_after_seconds: z.number().int().min(0, 'El delay no puede ser negativo').default(5),
  frequency_days: z.number().int().default(30),
  start_at: z.string().optional().nullable(),
  end_at: z.string().optional().nullable(),
});
