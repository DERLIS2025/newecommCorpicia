'use client';

import { useState, useTransition } from 'react';
import { TopBarItem } from '@/types/announcement';
import { createTopBarItem, updateTopBarItem, deleteTopBarItem, reorderTopBarItems } from '@/lib/actions/admin-announcements';
import { GripVertical, Plus, Trash2, Edit2, ArrowUp, ArrowDown } from 'lucide-react';

export default function TopBarForm({ initialItems }: { initialItems: TopBarItem[] }) {
  const [items, setItems] = useState<TopBarItem[]>(initialItems);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [editingItem, setEditingItem] = useState<Partial<TopBarItem> | null>(null);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      let res;
      if (editingItem?.id) {
        formData.append('id', editingItem.id);
        res = await updateTopBarItem(null, formData);
      } else {
        // Calculate next order
        const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order)) : -1;
        formData.append('order', (maxOrder + 1).toString());
        res = await createTopBarItem(null, formData);
      }

      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        setEditingItem(null);
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este mensaje?')) return;
    startTransition(async () => {
      const res = await deleteTopBarItem(id);
      if (res.success) {
        setItems(items.filter(i => i.id !== id));
        setMessage({ type: 'success', text: res.message });
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    });
  };

  const handleToggle = (item: TopBarItem) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('id', item.id);
      formData.append('text', item.text);
      if (item.emoji) formData.append('emoji', item.emoji);
      if (item.url) formData.append('url', item.url);
      if (item.buttonText) formData.append('buttonText', item.buttonText);
      formData.append('order', item.order.toString());
      formData.append('enabled', String(!item.enabled));

      const res = await updateTopBarItem(null, formData);
      if (res.success) {
        setItems(items.map(i => i.id === item.id ? { ...i, enabled: !i.enabled } : i));
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;

    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Recalculate order
    const updatedItems = newItems.map((item, i) => ({ ...item, order: i }));
    setItems(updatedItems);

    startTransition(async () => {
      const res = await reorderTopBarItems(updatedItems.map(i => ({ id: i.id, order: i.order })));
      if (res.success) {
        setMessage({ type: 'success', text: 'Orden actualizado' });
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    });
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Mensajes Activos</h3>
          <button
            onClick={() => setEditingItem({})}
            className="flex items-center gap-2 px-3 py-1.5 bg-corpicia-green text-white rounded hover:bg-corpicia-green/90 text-sm"
          >
            <Plus className="w-4 h-4" />
            Nuevo Mensaje
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {items.map((item, index) => (
            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveItem(index, 'up')} disabled={index === 0 || isPending} className="text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                  <button onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1 || isPending} className="text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggle(item)}
                    disabled={isPending}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${item.enabled ? 'bg-corpicia-green' : 'bg-gray-200'}`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                  <div>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      {item.emoji && <span>{item.emoji}</span>}
                      {item.text}
                    </p>
                    {item.url && <a href={item.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">{item.url}</a>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingItem(item)}
                  disabled={isPending}
                  className="p-2 text-gray-400 hover:text-blue-600"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={isPending}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No hay mensajes configurados.
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      {editingItem !== null && (
        <form onSubmit={handleSave} className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h4 className="text-lg font-medium text-gray-900">{editingItem.id ? 'Editar Mensaje' : 'Nuevo Mensaje'}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Texto principal *</label>
              <input
                type="text"
                name="text"
                defaultValue={editingItem.text || ''}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-corpicia-green focus:ring-corpicia-green sm:text-sm p-2 border"
                maxLength={150}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Emoji (opcional)</label>
              <input
                type="text"
                name="emoji"
                defaultValue={editingItem.emoji || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-corpicia-green focus:ring-corpicia-green sm:text-sm p-2 border"
                maxLength={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">URL del enlace (opcional)</label>
              <input
                type="url"
                name="url"
                defaultValue={editingItem.url || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-corpicia-green focus:ring-corpicia-green sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Texto del botón (opcional)</label>
              <input
                type="text"
                name="buttonText"
                defaultValue={editingItem.buttonText || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-corpicia-green focus:ring-corpicia-green sm:text-sm p-2 border"
                maxLength={50}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" name="enabled" value="true" defaultChecked={editingItem.enabled ?? true} id="enabled_msg" />
            <label htmlFor="enabled_msg" className="text-sm text-gray-700">Mensaje activo</label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-corpicia-green border border-transparent rounded-md hover:bg-corpicia-green/90 disabled:opacity-50 flex items-center gap-2"
            >
              {isPending && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>}
              Guardar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
