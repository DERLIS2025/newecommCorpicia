'use client';

import { useState } from 'react';
import { updateQuoteStatus } from '@/lib/actions/admin-quotes';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function QuoteStatusUpdater({ quoteId, currentStatus }: { quoteId: string, currentStatus: string }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [status, setStatus] = useState(currentStatus);
  const router = useRouter();

  const handleUpdate = async () => {
    setIsUpdating(true);
    setMessage(null);
    const result = await updateQuoteStatus(quoteId, status);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Estado guardado.' });
      router.refresh();
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    
    setIsUpdating(false);
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <select 
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="Nuevo">Nuevo</option>
          <option value="En revisión">En revisión</option>
          <option value="Respondido">Respondido</option>
          <option value="Ganado">Ganado</option>
          <option value="Perdido">Perdido</option>
        </select>
        <Button 
          onClick={handleUpdate} 
          disabled={isUpdating || status === currentStatus}
          className="bg-gray-900 text-white hover:bg-gray-800"
        >
          {isUpdating ? '...' : 'Guardar'}
        </Button>
      </div>
      
      {message && (
        <div className={`text-xs flex items-center gap-1 mt-1 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          {message.text}
        </div>
      )}
    </div>
  );
}
