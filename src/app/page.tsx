import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import {
  ArrowRight,
  Check,
  Leaf,
  Truck,
  Phone,
  Shield,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { homeHeroBanners, homeSecondaryBanners } from '@/data/banners';
import { productsCatalog } from './productos/[slug]/productsData';

export const metadata: Metadata = {
  title: 'Césped natural y jardinería en Paraguay | Corpicia',
  description:
    'Comprá césped en Paraguay, accesorios de riego y soluciones de jardinería. Cotizá online y enviá tu presupuesto por WhatsApp.',
  alternates: {
    canonical: '/',
  },
};

const featuredProducts = productsCatalog
  .filter((product) => product.isFeatured)
  .slice(0, 4);

const categories = [
  { name: 'Césped Natural', description: 'Variedades premium para alto tránsito', href: '/productos/' },
  { name: 'Semillas', description: 'Opciones para renovación y cobertura', href: '/productos/' },
  { name: 'Fertilizantes', description: 'Nutrición balanceada para césped saludable', href: '/productos/' },
  { name: 'Insumos', description: 'Complementos para instalación y mantenimiento', href: '/productos/' },
];

const benefits = [
  { icon: Leaf, title: 'Calidad Premium', description: 'Selección de productos confiables para resultados duraderos.' },
  { icon: Truck, title: 'Cobertura Nacional', description: 'Despachos coordinados para Asunción y todo Paraguay.' },
  { icon: Phone, title: 'Asesoría Experta', description: 'Acompañamiento personalizado antes y después de comprar.' },
  { icon: Shield, title: 'Compra Segura', description: 'Atención transparente y garantía sobre la cotización.' },
];

const promoBlocks = [
  {
    title: 'Comprá por categoría',
    description: 'Encontrá rápidamente césped, insumos y complementos para tu proyecto.',
    cta: 'Explorar catálogo',
    link: '/productos/',
  },
  {
    title: 'Cotizá sin fricción',
    description: 'Armá tu presupuesto por m², revisá el total y enviá por WhatsApp en minutos.',
    cta: 'Ir a presupuesto',
    link: '/presupuesto/',
  },
  {
    title: 'Te acompañamos en todo el proceso',
    description: 'Desde la elección del producto hasta la instalación y mantenimiento.',
    cta: 'Ver servicios',
    link: '/servicios/',
  },
];

const activeHeroBanners = homeHeroBanners
  .filter((banner) => banner.active)
  .sort((a, b) => a.order - b.order);

const activeSecondaryBanners = homeSecondaryBanners
  .filter((banner) => banner.active)
  .sort((a, b) => a.order - b.order);

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="bg-gradient-to-b from-[#f5fbf6] to-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-8 md:py-10">
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            {activeHeroBanners.map((banner, index) => (
              <Card
                key={banner.title}
                className={`${index === 0 ? 'lg:row-span-2' : ''} border-0 shadow-sm overflow-hidden`}
              >
                <CardContent className="p-0">
                  <div className="h-full min-h-[220px] md:min-h-[260px] p-8 bg-gradient-to-br from-corpicia-green to-[#025c17] text-white flex flex-col justify-between">
                    <div>
                      <span className="inline-flex items-center gap-2 border border-white/30 px-3 py-1 text-xs mb-4">
                        <Sparkles className="w-4 h-4" />
                        Banner
                      </span>
                      <h1 className="text-3xl font-bold">{banner.title}</h1>
                      <p className="mt-3 text-white/85">{banner.subtitle}</p>
                    </div>

                    <Link href={banner.link}>
                      <Button className="bg-white text-corpicia-green mt-4">
                        {banner.CTA}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PROMOS */}
      <section className="py-10">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-4">
          {promoBlocks.map((promo) => (
            <Card key={promo.title}>
              <CardContent className="p-6">
                <h2 className="font-bold text-lg">{promo.title}</h2>
                <p className="text-sm text-gray-600 mt-2">{promo.description}</p>
                <Link href={promo.link} className="text-corpicia-green mt-3 inline-flex">
                  {promo.cta}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* PRODUCTOS */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Productos destacados</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}