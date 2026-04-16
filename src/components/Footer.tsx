'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter */}
      <div className="bg-corpicia-green py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">¡Suscribite a nuestro newsletter!</h3>
              <p className="text-white/80 text-sm mt-1">
                Recibí ofertas exclusivas y novedades sobre jardinería
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                className="bg-white text-gray-900 border-0 h-12 w-full md:w-72"
              />
              <Button className="bg-gray-900 hover:bg-gray-800 h-12 px-6 whitespace-nowrap">
                Suscribirse
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-corpicia-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold">Corpicia</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Especialistas en césped natural y soluciones de jardinería en Paraguay. 
              Transformamos tus espacios verdes con calidad y profesionalismo.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-corpicia-green transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-corpicia-green transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Productos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/productos/cesped/" className="hover:text-white transition-colors">
                  Césped Natural
                </Link>
              </li>
              <li>
                <Link href="/productos/semillas/" className="hover:text-white transition-colors">
                  Semillas
                </Link>
              </li>
              <li>
                <Link href="/productos/fertilizantes/" className="hover:text-white transition-colors">
                  Fertilizantes
                </Link>
              </li>
              <li>
                <Link href="/productos/insumos/" className="hover:text-white transition-colors">
                  Insumos de Jardinería
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/servicios/instalacion/" className="hover:text-white transition-colors">
                  Instalación de Césped
                </Link>
              </li>
              <li>
                <Link href="/servicios/mantenimiento/" className="hover:text-white transition-colors">
                  Mantenimiento
                </Link>
              </li>
              <li>
                <Link href="/servicios/paisajismo/" className="hover:text-white transition-colors">
                  Paisajismo
                </Link>
              </li>
              <li>
                <Link href="/servicios/riego/" className="hover:text-white transition-colors">
                  Sistemas de Riego
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-gray-400">
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

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-500">
            <p>© 2024 Corpicia. Todos los derechos reservados.</p>
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
