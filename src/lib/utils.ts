import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function generateWhatsAppMessage(items: { name: string; quantity: number; total: number }[], total: number): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '595992588770';
  
  let message = 'Hola, quiero solicitar un presupuesto:\n\n';
  
  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `   Cantidad: ${item.quantity} m²\n`;
    message += `   Precio estimado: ${formatPrice(item.total)}\n\n`;
  });
  
  message += `Total estimado: ${formatPrice(total)}\n\n`;
  message += '¡Gracias!';
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}
