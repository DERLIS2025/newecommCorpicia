// src/app/admin/announcements/TopBarForm.tsx

'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TopBarItem } from '@/types/announcement';
import { getTopBarItems, upsertTopBarItem, deleteTopBarItem, reorderTopBarItems } from '@/lib/supabase/announcement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { DragHandle, GripHorizontal } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '@/components/ui/sortable-item';

const topBarSchema = z.array(
  z.object({
    id: z.string().optional(),
    text: z.string().min(1, 'Texto requerido'),
    emoji: z.string().optional(),
    url: z.string().url().optional(),
    buttonText: z.string().optional(),
    order: z.number().int().nonnegative(),
    enabled: z.boolean(),
  })
);

type FormValues = z.infer<typeof topBarSchema>;

export default function TopBarForm() {
  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    resolver: zodResolver(topBarSchema),
    defaultValues: [],
  });

  const { fields, append, remove, move } = useFieldArray({ control, name: '' });
  const [loading, setLoading] = useState(false);

  // Load items from Supabase on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      const items = await getTopBarItems();
      reset(items);
      setLoading(false);
    })();
  }, [reset]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    // Upsert all items
    for (const item of data) {
      await upsertTopBarItem(item as TopBarItem);
    }
    // Delete removed items – we compare IDs
    const existingIds = (await getTopBarItems()).map((i) => i.id);
    const newIds = data.map((i) => i.id).filter(Boolean) as string[];
    const toDelete = existingIds.filter((id) => !newIds.includes(id));
    for (const id of toDelete) {
      await deleteTopBarItem(id);
    }
    // Reorder based on current order field
    await reorderTopBarItems(data);
    setLoading(false);
  };

  const handleDragEnd = ({ active, over }: any) => {
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          {fields.map((field, index) => (
            <SortableItem key={field.id} id={field.id}>
              <div className="flex items-center space-x-4 p-2 bg-gray-50 rounded-md">
                <DragHandle className="cursor-move" />
                <Controller
                  name={`${index}.text` as const}
                  control={control}
                  render={({ field }) => <Input {...field} placeholder="Texto del anuncio" />}
                />
                <Controller
                  name={`${index}.emoji` as const}
                  control={control}
                  render={({ field }) => <Input {...field} placeholder="Emoji (opcional)" maxLength={2} />}
                />
                <Controller
                  name={`${index}.url` as const}
                  control={control}
                  render={({ field }) => <Input {...field} placeholder="URL (opcional)" />}
                />
                <Controller
                  name={`${index}.buttonText` as const}
                  control={control}
                  render={({ field }) => <Input {...field} placeholder="Texto del botón (opcional)" />}
                />
                <Controller
                  name={`${index}.enabled` as const}
                  control={control}
                  render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                />
                <Button variant="destructive" type="button" onClick={() => remove(index)}>
                  Eliminar
                </Button>
              </div>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      <Button type="button" onClick={() => append({ text: '', order: fields.length, enabled: true })}>
        Añadir elemento
      </Button>
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={loading}>
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
