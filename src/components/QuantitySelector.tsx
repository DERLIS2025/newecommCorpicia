'use client';

import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  minQuantity: number;
  onChange: (quantity: number) => void;
}

export function QuantitySelector({ quantity, minQuantity, onChange }: QuantitySelectorProps) {
  const safeMin = Number.isFinite(Number(minQuantity)) ? Number(minQuantity) : 1;
  const safeQty = Number.isFinite(Number(quantity)) ? Number(quantity) : safeMin;

  const decrement = () => {
    if (safeQty > safeMin) {
      onChange(Math.max(safeMin, safeQty - 1));
    }
  };

  const increment = () => {
    onChange(safeQty + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const newQty = Number.isFinite(value) ? value : safeMin;
    onChange(Math.max(safeMin, newQty));
  };

  return (
    <div className="flex items-center">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={decrement}
        disabled={safeQty <= safeMin}
        className={`rounded-r-none h-12 w-12 ${safeQty <= safeMin ? 'text-gray-300 cursor-not-allowed' : ''}`}
      >
        <Minus className="w-4 h-4" />
      </Button>
      <input
        type="number"
        value={safeQty}
        onChange={handleInputChange}
        min={safeMin}
        className="h-12 w-20 text-center border-y border-gray-200 focus:outline-none focus:ring-0 [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={increment}
        className="rounded-l-none h-12 w-12"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
