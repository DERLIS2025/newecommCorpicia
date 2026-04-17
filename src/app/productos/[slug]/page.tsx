import Image from 'next/image';
import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { Leaf, Truck, Phone, Shield } from 'lucide-react';
import { productsCatalog } from './productos/[slug]/productsData';

export const metadata: Metadata = {
  title: 'Césped natural y jardinería en Paraguay | Corpicia',
  description:
    'Comprá césped en Paraguay, accesorios de riego y soluciones de jardinería.',
  alternates: {
    canonical: '/',
  },
};

// 🔥 FILTRO: OCULTAR SERVICIOS DEL HOME
const homeProducts = productsCatalog.filter(
  (product) => product.category !== 'servicios'
);

// 🔥 ORDEN VISUAL DEL HOME
const featuredProducts = homeProducts.slice(0, 4);
const mixedProducts = homeProducts.slice(4, 6);
const underBannerProducts = homeProducts.slice(6, 8);
const secondaryProducts = homeProducts.slice(8, 12);

const benefits = [
  { icon: Leaf, title: 'Calidad Premium', description: 'Productos duraderos.' },
  { icon: Truck, title: 'Cobertura Nacional', description: 'Envíos en Paraguay.' },
  { icon: Phone, title: 'Asesoría Experta', description: 'Acompañamiento total.' },
  { icon: Shield, title: 'Compra Segura', description: 'Transparencia total.' },
];

const whatsappHref = 'https://wa.me/595992588770';

export default function HomePage() {
  return (
    <div className="bg-white">

      {/* HERO */}
      <section className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">

            {/* Banner principal */}
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="block">
              <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] lg:h-[500px] rounded-xl overflow-hidden bg-[#f5fbf6]">
                <Image
                  src="/banners/hero-main-desktop.webp"
                  alt="Banner principal"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </a>

            {/* Banners laterales */}
            <div className="grid gap-4">

              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <div className="relative w-full h-[160px] md:h-[200px] lg:h-[240px] rounded-xl overflow-hidden bg-[#f5fbf6]">
                  <Image
                    src="/banners/hero-side-1.webp"
                    alt="Banner secundario superior"
                    fill
                    className="object-contain"
                  />
                </div>
              </a>

              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <div className="relative w-full h-[160px] md:h-[200px] lg:h-[240px] rounded-xl overflow-hidden bg-[#f5fbf6]">
                  <Image
                    src="/banners/hero-side-2.jpg"
                    alt="Banner secundario inferior"
                    fill
                    className="object-contain"
                  />
                </div>
              </a>

            </div>
          </div>
        </div>
      </
