'use client';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';

export default function PinInput({
  onComplete,
  disabled = false,
  autoFocus = true
}: {
  onComplete: (pin: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}) {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    
    // Solo toma el último dígito
    const digit = value.slice(-1);
    
    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);

    // Si llenó el casillero, pasa al siguiente
    if (digit !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newPin.every((p) => p !== '')) {
      onComplete(newPin.join(''));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
      // Borra el anterior si el actual está vacío
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newPin = [...pin];
      for (let i = 0; i < pastedData.length; i++) {
        if (i < 6) newPin[i] = pastedData[i];
      }
      setPin(newPin);
      
      const nextFocus = Math.min(pastedData.length, 5);
      inputRefs.current[nextFocus]?.focus();
      
      if (pastedData.length === 6) {
        onComplete(pastedData);
      }
    }
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {pin.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          disabled={disabled}
          value={digit}
          ref={(el) => { inputRefs.current[index] = el; }}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-12 h-14 text-center text-xl font-bold bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-corpicia-green/20 focus:border-corpicia-green focus:bg-white transition-all disabled:opacity-50"
        />
      ))}
    </div>
  );
}
