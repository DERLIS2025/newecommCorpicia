// src/app/admin/announcements/PopupForm.tsx

'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PopupSettings } from '@/types/announcement';
import { getPopupSettings, upsertPopupSettings } from '@/lib/supabase/announcement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const popupSchema = z.object({
  enabled: z.boolean(),
  image_url: z.string().url().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  button_text: z.string().optional().nullable(),
  button_url: z.string().url().optional().nullable(),
  show_after_seconds: z.number().int().min(0).default(5),
  frequency_days: z.number().int().min(0).default(30),
  start_at: z.string().datetime().optional().nullable(),
  end_at: z.string().datetime().optional().nullable(),
});

type FormValues = z.infer<typeof popupSchema>;

export default function PopupForm() {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(popupSchema),
    defaultValues: {
      enabled: false,
      image_url: null,
      title: null,
      description: null,
      button_text: null,
      button_url: null,
      show_after_seconds: 5,
      frequency_days: 30,
      start_at: null,
      end_at: null,
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getPopupSettings();
      if (data) {
        reset({
          enabled: data.enabled,
          image_url: data.image_url,
          title: data.title,
          description: data.description,
          button_text: data.button_text,
          button_url: data.button_url,
          show_after_seconds: data.show_after_seconds,
          frequency_days: data.frequency_days,
          start_at: data.start_at,
          end_at: data.end_at,
        });
      }
      setLoading(false);
    })();
  }, [reset]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const payload: PopupSettings = {
      ...values,
      id: 'singleton',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as PopupSettings;
    await upsertPopupSettings(payload);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center space-x-2">
        <Label>Activado</Label>
        <Controller
          name="enabled"
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>
      <div>
        <Label>URL de la imagen (public URL de Supabase Storage)</Label>
        <Controller
          name="image_url"
          control={control}
          render={({ field }) => <Input {...field} placeholder="https://..." />}
        />
      </div>
      <div>
        <Label>Título</Label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Título del popup" />}
        />
      </div>
      <div>
        <Label>Descripción</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => <Textarea {...field} placeholder="Texto descriptivo" />}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Texto del botón</Label>
          <Controller
            name="button_text"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Ej. Ver oferta" />}
          />
        </div>
        <div>
          <Label>URL del botón</Label>
          <Controller
            name="button_url"
            control={control}
            render={({ field }) => <Input {...field} placeholder="https://..." />}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Mostrar después (segundos)</Label>
          <Controller
            name="show_after_seconds"
            control={control}
            render={({ field }) => <Input type="number" {...field} min={0} />}
          />
        </div>
        <div>
          <Label>Frecuencia (días)</Label>
          <Controller
            name="frequency_days"
            control={control}
            render={({ field }) => <Input type="number" {...field} min={0} />}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Fecha de inicio (ISO)</Label>
          <Controller
            name="start_at"
            control={control}
            render={({ field }) => <Input type="datetime-local" {...field} />}
          />
        </div>
        <div>
          <Label>Fecha de fin (ISO)</Label>
          <Controller
            name="end_at"
            control={control}
            render={({ field }) => <Input type="datetime-local" {...field} />}
          />
        </div>
      </div>
      <Button type="submit" disabled={loading}>Guardar popup</Button>
    </form>
  );
}
