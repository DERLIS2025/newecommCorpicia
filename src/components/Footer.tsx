'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram, Facebook, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-[#0f1f12] text-white mt-8">
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-8 md:py-10">
          <div className="grid gap-4 md:grid-cols-[1.2fr_1fr] items-center">
            <div>
              <h3 className="text-2xl font-bold">Recibí novedades de Corpicia</h3>
              <p className="text-white/70 text-sm mt-2 max-w-xl">
                Suscribite para recibir promociones, consejos de mantenimiento y lanzamientos de productos.
              </p>
            </div>
            <div className="flex gap-2 w-full">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                className="bg-white text-gray-900 border-0 h-12"
              />
              <Button className="h-12 px-5 bg-corpicia-green hover:bg-corpicia-green-dark whitespace-nowrap">
                Suscribirme
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-corpicia-green rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-white/60">Corpicia</p>
                <p className="text-lg font-semibold">Césped y Jardinería</p>
              </div>
            </div>

            <p className="text-white/70 text-sm leading-relaxed">
              Especialistas en césped natural y jardinería en Paraguay. Diseñamos experiencias de compra simples
              para que armes tu presupuesto y consultes por WhatsApp sin fricción.
            </p>

            <div className="flex gap-3 mt-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-corpicia-green transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-corpicia-green transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Productos</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <Link href="/productos/" className="hover:text-white transition-colors inline-flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5" /> Césped Natural
                </Link>
              </li>
              <li>
                <Link href="/productos/" className="hover:text-white transition-colors inline-flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5" /> Semillas
                </Link>
              </li>
              <li>
                <Link href="/productos/" className="hover:text-white transition-colors inline-flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5" /> Fertilizantes
                </Link>
              </li>
              <li>
                <Link href="/productos/" className="hover:text-white transition-colors inline-flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5" /> Insumos de Jardinería
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Servicios</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <Link href="/servicios/" className="hover:text-white transition-colors inline-flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5" /> Instalación de Césped
                </Link>
              </li>
              <li>
                <Link href="/servicios/" className="hover:text-white transition-colors inline-flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5" /> Mantenimiento
                </Link>
              </li>
              <li>
                <Link href="/servicios/" className="hover:text-white transition-colors inline-flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5" /> Paisajismo
                </Link>
              </li>
              <li>
                <Link href="/servicios/" className="hover:text-white transition-colors inline-flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5" /> Sistemas de Riego
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Contacto</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-corpicia-green flex-shrink-0 mt-0.5" />
                <span>Asunción, Paraguay</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-corpicia-green flex-shrink-0" />
                <a href="tel:+595992588770" className="hover:text-white transition-colors">
                  +595 992 588 770
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-corpicia-green flex-shrink-0" />
                <a href="mailto:info@corpicia.com" className="hover:text-white transition-colors">
                  info@corpicia.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-white/50">
            <p>© 2026 Corpicia. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <Link href="/terminos/" className="hover:text-white transition-colors">
                Términos y condiciones
              </Link>
              <Link href="/privacidad/" className="hover:text-white transition-colors">
                Política de privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
