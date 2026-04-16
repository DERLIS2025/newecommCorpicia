import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Product } from "@/types";

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

export function formatUnit(unit: Product['unit']): string {
  switch (unit) {
    case 'm2':
      return 'm²';
    case 'docena':
      return 'docena';
    case 'unidad':
      return 'unidad';
    case 'visita':
      return 'visita';
    default:
      return 'm²';
  }
}

export function getWhatsAppUrl(message?: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '595992588770';
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${phone}${encodedMessage}`;
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

export function generateWhatsAppMessage(
  items: { name: string; quantity: number; total: number; unit: Product['unit'] }[],
  total: number
): string {
  let message = 'Hola, quiero solicitar un presupuesto:\n\n';
  
  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `   Cantidad: ${item.quantity} ${formatUnit(item.unit)}\n`;
    message += `   Precio estimado: ${formatPrice(item.total)}\n\n`;
  });
  
  message += `Total estimado: ${formatPrice(total)}\n\n`;
  message += '¡Gracias!';
  
  return getWhatsAppUrl(message);
}
