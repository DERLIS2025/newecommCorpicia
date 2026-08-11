import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Product, PriceTier } from "@/types";

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
    case 'kg':
      return 'kg';
    case 'bolsa':
      return 'bolsa';
    case 'bolsa_30kg':
      return 'Bolsa de 30 (kg)';
    case 'litro':
      return 'litro';
    case 'metro_lineal':
      return 'metro lineal';
    case 'docena':
      return 'docena';
    case 'unidad':
      return 'unidad';
    case 'visita':
      return 'visita';
    case 'servicio':
      return 'servicio';
    default:
      return 'm²';
  }
}

export function getWhatsAppUrl(message?: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '595992588770';
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${phone}${encodedMessage}`;
}

export function getSafeMinQuantity(product: any): number {
  if (!product) return 1;
  const min = product.minQuantity ?? product.minOrderQuantity ?? product.min_order_quantity ?? 1;
  return Number.isFinite(Number(min)) ? Number(min) : 1;
}

/**
 * Returns the most appropriate image URL for a product.
 * Order of precedence:
 *   1. First entry of `product.images` array (if array exists and has elements)
 *   2. `product.image`
 *   3. `product.imageUrl`
 *   4. Fallback based on slug: `/productos/${product.slug}.jpg`
 *   5. Empty string (placeholder can be handled by the caller)
 */
export function getProductImage(product: any): string {
  if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0];
  }
  if (product?.image) return product.image;
  if (product?.imageUrl) return product.imageUrl;
  if (product?.slug) return `/productos/${product.slug}.jpg`;
  return '';
}

export function getSafeQuantity(quantity: any, safeMinQuantity: number): number {
  const numQty = Number(quantity);
  const parsed = Number.isFinite(numQty) ? numQty : safeMinQuantity;
  return Math.max(parsed, safeMinQuantity);
}

export function getPriceForQuantity(
  product: Product,
  quantity: number
): {
  unitPrice: number;
  totalPrice: number;
  activeTier: PriceTier | null;
} {
  const safeMinQuantity = getSafeMinQuantity(product);
  const safeQuantity = getSafeQuantity(quantity, safeMinQuantity);

  if (!product.priceTiers || product.priceTiers.length === 0) {
    return {
      unitPrice: product.pricePerM2,
      totalPrice: product.pricePerM2 * safeQuantity,
      activeTier: null,
    };
  }

  const activeTier =
    product.priceTiers.find((tier) => {
      // Support both static and database formats
      const normalizedTier = tier as typeof tier & {
        minQuantity?: number;
        maxQuantity?: number | null;
      };

      const min = Number(normalizedTier.min ?? normalizedTier.minQuantity ?? 0);
      const maxRaw = normalizedTier.max ?? normalizedTier.maxQuantity;
      const max =
        maxRaw === null || maxRaw === undefined
          ? null
          : Number(maxRaw);

      if (max === null) return safeQuantity >= min;
      return safeQuantity >= min && safeQuantity <= max;
    }) || null;

  const unitPrice = Number(activeTier?.price) || Number(product.pricePerM2) || 0;
  const totalPrice = unitPrice * safeQuantity;

  return {
    unitPrice,
    totalPrice,
    activeTier,
  };
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
  items: { name: string; quantity: number; total: number; unit: Product['unit']; unitPrice?: number }[],
  total: number
): string {
  let message = 'Hola, quiero solicitar un presupuesto:\n\n';

  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `Cantidad: ${item.quantity} ${formatUnit(item.unit)}\n`;
    if (item.unitPrice !== undefined) {
      message += `Precio aplicado: ${formatPrice(item.unitPrice)}/${formatUnit(item.unit)}\n`;
    }
    message += `Subtotal: ${formatPrice(item.total)}\n\n`;
  });

  message += `Total estimado: ${formatPrice(total)}\n\n`;
  message += 'Nombre:\nZona:\nComentario:';

  // ✅ CORREGIDO: Usar api.whatsapp.com en vez de wa.me (evita bloqueo FortiGate)
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '595992588770';
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}
