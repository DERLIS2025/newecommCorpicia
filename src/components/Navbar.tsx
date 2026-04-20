'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBudgetStore } from '@/store/budgetStore';
import { getWhatsAppUrl } from '@/lib/utils';

// Icono oficial de WhatsApp
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopQuery, setDesktopQuery] = useState('');
  const [mobileQuery, setMobileQuery] = useState('');
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
      {/* TOP BAR - MARQUEE DE OFERTAS */}
      <div className="bg-red-600 text-white overflow-hidden">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center">
            {/* Desktop y Mobile: marquee scrolleable */}
            <div className="overflow-hidden flex-1">
              <div className="animate-marquee whitespace-nowrap flex gap-8">
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm">
                  🔥 <strong>CÉSPED ESMERALDA + INSTALACIÓN: Gs. 32.000/m²</strong> · APROVECHÁ AHORA
                </span>
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm">
                  🌱 <strong>CÉSPED SIEMPRE VERDE</strong> resistente todo el año
                </span>
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm">
                  🏡 <strong>INSTALACIÓN PROFESIONAL</strong> garantizada en Asunción
                </span>
                {/* Duplicado para loop suave */}
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm">
                  🔥 <strong>CÉSPED ESMERALDA + INSTALACIÓN: Gs. 32.000/m²</strong> · APROVECHÁ AHORA
                </span>
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm">
                  🌱 <strong>CÉSPED SIEMPRE VERDE</strong> resistente todo el año
                </span>
              </div>
            </div>

            {/* Botón WhatsApp siempre visible */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-1.5 
                bg-white text-red-600 
                font-bold 
                px-3 py-1.5 rounded-full 
                text-xs
                transition-all duration-300
                hover:scale-105 hover:shadow-lg
                ml-2 flex-shrink-0
              "
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WHATSAPP</span>
            </a>
          </div>
        </div>
      </div>

      {/* MAIN NAV */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[88px] lg:h-[72px]">
          {/* MENÚ HAMBURGUESA - IZQUIERDA EN MOBILE */}
          <div className="flex items-center lg:hidden flex-shrink-0 w-10">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>

          {/* LOGO - CENTRO, MUCHO MÁS GRANDE EN MOBILE */}
          <Link
            href="/"
            className="
              flex items-center justify-center
              flex-1 min-w-0
              lg:flex-none lg:justify-start
            "
          >
            <Image
              src="/logo-corpicia-navbar.png"
              alt="Corpicia"
              width={400}
              height={200}
              priority
              className="
                h-[76px]
                sm:h-[84px]
                md:h-[60px]
                lg:h-[64px]
                w-auto
                min-w-[200px]
                sm:min-w-[260px]
                md:min-w-[160px]
                lg:min-w-[180px]
                object-contain
              "
            />
          </Link>

          {/* SEARCH DESKTOP */}
          <div className="hidden md:flex flex-1 max-w-xl mx-2 lg:mx-6">
            <form action="/productos/" method="get" className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="q"
                placeholder="Buscar productos..."
                value={desktopQuery}
                onChange={(event) => setDesktopQuery(event.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:border-corpicia-green focus:ring-2 focus:ring-corpicia-green/20"
              />
            </form>
          </div>

          {/* NAV LINKS */}
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

          {/* ACTIONS - DERECHA */}
          <div className="flex items-center gap-2 flex-shrink-0 w-10 justify-end lg:w-auto">
            <Link href="/presupuesto/" className="hidden sm:block">
              <Button variant="outline" size="icon" className="relative rounded-full border-gray-200">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-corpicia-green text-white text-[11px] rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* Carrito visible solo en mobile */}
            <Link href="/presupuesto/" className="sm:hidden">
              <Button variant="outline" size="icon" className="relative rounded-full border-gray-200 w-9 h-9">
                <ShoppingCart className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-corpicia-green text-white text-[10px] rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="container mx-auto px-4 py-4">
            {/* SEARCH MOBILE */}
            <div className="relative mb-4">
              <form action="/productos/" method="get" className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="q"
                  placeholder="Buscar productos..."
                  value={mobileQuery}
                  onChange={(event) => setMobileQuery(event.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-corpicia-green/20 focus:border-corpicia-green"
                />
              </form>
            </div>

            {/* LINKS MOBILE */}
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

            {/* BOTÓN WHATSAPP EN MENÚ MÓVIL */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-4 flex items-center justify-center gap-2 
                bg-corpicia-green hover:bg-green-700 
                text-white font-semibold 
                px-4 py-3 rounded-xl 
                transition-all duration-300
                animate-pulse-slow
              "
            >
              <WhatsAppIcon className="w-5 h-5" />
              HABLAR CON UN ASESOR
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
