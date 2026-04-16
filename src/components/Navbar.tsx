'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingCart, Phone, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBudgetStore } from '@/store/budgetStore';
import { getWhatsAppUrl } from '@/lib/utils';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = useBudgetStore((state) => state.getItemCount());

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/productos/', label: 'Productos' },
    { href: '/servicios/', label: 'Servicios' },
    { href: '/nosotros/', label: 'Nosotros' },
    { href: '/contacto/', label: 'Contacto' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="border-b border-gray-100 bg-[#f8fbf8]">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between text-xs sm:text-sm text-gray-600">
          <p className="hidden md:block">
            Envíos a todo Paraguay · Asunción y Gran Asunción
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 ml-auto font-medium text-corpicia-green hover:underline"
          >
            <Phone className="w-4 h-4" />
            +595 992 588 770
          </a>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-[74px] gap-3">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-10 h-10 bg-corpicia-green rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500 leading-none">Corpicia</p>
              <p className="text-base font-semibold text-gray-900 leading-tight">Césped & Jardinería</p>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-2 lg:mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full h-11 pl-10 pr-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:border-corpicia-green focus:ring-2 focus:ring-corpicia-green/20"
              />
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-corpicia-green transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/presupuesto/">
              <Button variant="outline" size="icon" className="relative rounded-full border-gray-200">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-corpicia-green text-white text-[11px] rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="container mx-auto px-4 py-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-corpicia-green/20 focus:border-corpicia-green"
              />
            </div>

            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-xl font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
