'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBudgetStore } from '@/store/budgetStore';
import { formatPrice, generateWhatsAppMessage } from '@/lib/utils';
import { Minus, Plus, Trash2, ShoppingCart, MessageCircle, ArrowLeft, Package } from 'lucide-react';

export default function PresupuestoClient() {
  const { items, removeItem, updateQuantity, getTotal, clearBudget } = useBudgetStore();

  const handleWhatsAppClick = () => {
    const messageItems = items.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      total: item.total,
    }));
    const url = generateWhatsAppMessage(messageItems, getTotal());
    window.open(url, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Tu presupuesto está vacío
            </h1>
            <p className="text-gray-500 mb-8">
              Agregá productos para armar tu presupuesto personalizado
            </p>
            <Link href="/productos/">
              <Button className="gap-2">
                <Package className="w-4 h-4" />
                Ver Productos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TODO: pegá acá TODO el resto de tu código tal cual */}
    </div>
  );
}
