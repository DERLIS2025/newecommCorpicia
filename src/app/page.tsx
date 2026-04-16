import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import {
  ArrowRight,
  Leaf,
  Truck,
  Phone,
  Shield,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { homeHeroBanners } from '@/data/banners';
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

const promoBlocks = [
  {
    title: 'Comprá por categoría',
    description: 'Encontrá rápidamente césped, insumos y complementos.',
    cta: 'Explorar catálogo',
    link: '/productos/',
  },
  {
    title: 'Cotizá sin fricción',
    description: 'Calculá por m² y enviá por WhatsApp en minutos.',
    cta: 'Ir a presupuesto',
    link: '/presupuesto/',
  },
  {
    title: 'Te acompañamos',
    description: 'Desde la elección hasta la instalación.',
    cta: 'Ver servicios',
    link: '/servicios/',
  },
];

const benefits = [
  { icon: Leaf, title: 'Calidad Premium', description: 'Productos duraderos.' },
  { icon: Truck, title: 'Cobertura Nacional', description: 'Envíos en Paraguay.' },
  { icon: Phone, title: 'Asesoría Experta', description: 'Acompañamiento total.' },
  { icon: Shield, title: 'Compra Segura', description: 'Transparencia total.' },
];

const activeHeroBanners = homeHeroBanners
  .filter((banner) => banner.active)
  .sort((a, b) => a.order - b.order);

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="bg-gradient-to-b from-[#f5fbf6] to-white border-b">
        <div className="container mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
            {activeHeroBanners.map((banner, index) => (
              <Card key={banner.title} className={`${index === 0 ? 'lg:row-span-2' : ''}`}>
                <CardContent className="p-0">
                  <div className="p-8 bg-gradient-to-br from-corpicia-green to-[#025c17] text-white h-full flex flex-col justify-between">
                    <div>
                      <span className="text-xs mb-3 inline-flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Destacado
                      </span>
                      <h1 className="text-3xl font-bold">{banner.title}</h1>
                      <p className="mt-2 text-white/90">{banner.subtitle}</p>
                    </div>

                    <Link href={banner.link}>
                      <Button className="bg-white text-corpicia-green mt-4">
                        {banner.CTA}
                        <ArrowRight className="ml-2 w-4 h-4" />
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
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-4">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <Card key={b.title}>
                <CardContent className="p-5">
                  <Icon className="text-corpicia-green mb-2" />
                  <h3 className="font-semibold">{b.title}</h3>
                  <p className="text-sm text-gray-600">{b.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* PRODUCTOS */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Productos destacados</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}