import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { ArrowRight, Leaf, Truck, Phone, Shield } from 'lucide-react';
import { homeHeroBanners, homeSecondaryBanners } from '@/data/banners';
import { productsCatalog } from './productos/[slug]/productsData';

export const metadata: Metadata = {
  title: 'Césped natural y jardinería en Paraguay | Corpicia',
  description: 'Comprá césped en Paraguay, accesorios de riego y soluciones de jardinería. Cotizá online y enviá tu presupuesto por WhatsApp.',
  alternates: {
    canonical: '/',
  },
};

const benefits = [
  { icon: Leaf, title: 'Calidad premium', description: 'Productos seleccionados para resultados duraderos.' },
  { icon: Truck, title: 'Cobertura nacional', description: 'Entregas coordinadas en Asunción y Paraguay.' },
  { icon: Phone, title: 'Asesoría experta', description: 'Acompañamiento antes y después de comprar.' },
  { icon: Shield, title: 'Compra segura', description: 'Atención transparente y soporte personalizado.' },
];

const activeHeroBanners = homeHeroBanners.filter((banner) => banner.active).sort((a, b) => a.order - b.order);
const activeSecondaryBanners = homeSecondaryBanners.filter((banner) => banner.active).sort((a, b) => a.order - b.order);

const firstRowProducts = productsCatalog.slice(0, 4);
const secondRowProducts = productsCatalog.slice(4, 8);
const mixedBlockProducts = productsCatalog.slice(8, 10);

export default function HomePage() {
  const primaryHero = activeHeroBanners[0];
  const rightHeroes = activeHeroBanners.slice(1, 3);
  const mixedBanner = activeSecondaryBanners[0];
  const wideBanner = activeSecondaryBanners[1] || activeSecondaryBanners[0];

  return (
    <div className="bg-[#f7f7f7]">
      {/* 1) HERO SUPERIOR */}
      <section className="py-6 md:py-10">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            {primaryHero && (
              <Card className="overflow-hidden bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow h-full">
                <CardContent className="p-0 h-full">
                  <div className="relative h-full min-h-[260px] md:min-h-[420px]">
                    <Image src={primaryHero.imageDesktop} alt={primaryHero.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/35" />
                    <div className="relative z-10 h-full p-5 md:p-8 text-white flex flex-col justify-end">
                      <h1 className="text-2xl md:text-4xl font-bold leading-tight max-w-2xl">{primaryHero.title}</h1>
                      <p className="text-sm md:text-base text-white/90 mt-2 max-w-xl line-clamp-2 md:line-clamp-none">{primaryHero.subtitle}</p>
                      <Link href={primaryHero.link} className="mt-4">
                        <Button className="bg-corpicia-green hover:bg-corpicia-green-dark text-white gap-2">
                          {primaryHero.CTA}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 grid-rows-2">
              {rightHeroes.map((banner) => (
                <Card key={banner.title} className="overflow-hidden bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-0 h-full">
                    <div className="relative h-full min-h-[128px] md:min-h-[202px]">
                      <Image src={banner.imageDesktop} alt={banner.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/35" />
                      <div className="relative z-10 h-full p-4 md:p-6 text-white flex flex-col justify-end">
                        <h2 className="text-base md:text-xl font-semibold leading-snug line-clamp-2">{banner.title}</h2>
                        <Link href={banner.link} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
                          {banner.CTA}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2) BENEFICIOS */}
      <section className="pb-6 md:pb-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                  <CardContent className="p-4 md:p-5">
                    <div className="w-9 h-9 rounded-lg bg-corpicia-green/10 flex items-center justify-center mb-2">
                      <Icon className="w-4.5 h-4.5 text-corpicia-green" />
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-gray-900">{benefit.title}</h3>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3) PRIMERA FILA DE PRODUCTOS */}
      <section className="py-6 md:py-8 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Productos destacados</h2>
            <Link href="/productos/" className="text-corpicia-green text-sm md:text-base font-medium">Ver todo</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6">
            {firstRowProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4) BLOQUE MIXTO */}
      <section className="py-6 md:py-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4 md:gap-6">
            {mixedBanner && (
              <Card className="overflow-hidden bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow min-h-[260px] md:min-h-[420px]">
                <CardContent className="p-0 h-full">
                  <div className="relative h-full min-h-[260px] md:min-h-[420px]">
                    <Image src={mixedBanner.imageDesktop} alt={mixedBanner.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/35" />
                    <div className="relative z-10 h-full p-5 md:p-8 text-white flex flex-col justify-end">
                      <h3 className="text-2xl md:text-4xl font-bold leading-tight max-w-xl">{mixedBanner.title}</h3>
                      <p className="text-white/90 mt-2 max-w-lg line-clamp-2 md:line-clamp-none">{mixedBanner.subtitle}</p>
                      <a href={mixedBanner.link} target={mixedBanner.link.startsWith('http') ? '_blank' : undefined} rel={mixedBanner.link.startsWith('http') ? 'noopener noreferrer' : undefined} className="mt-4">
                        <Button className="bg-corpicia-green hover:bg-corpicia-green-dark text-white">
                          {mixedBanner.CTA}
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
              {mixedBlockProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5) BANNER HORIZONTAL ANCHO */}
      {wideBanner && (
        <section className="py-2 md:py-4">
          <div className="container mx-auto px-4">
            <Card className="overflow-hidden bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="relative min-h-[170px] md:min-h-[260px]">
                  <Image src={wideBanner.imageDesktop} alt={wideBanner.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/35" />
                  <div className="relative z-10 p-5 md:p-8 h-full flex flex-col justify-end text-white">
                    <h3 className="text-2xl md:text-4xl font-bold leading-tight">{wideBanner.title}</h3>
                    <p className="text-white/90 mt-2 max-w-2xl line-clamp-2 md:line-clamp-none">{wideBanner.subtitle}</p>
                    <a href={wideBanner.link} target={wideBanner.link.startsWith('http') ? '_blank' : undefined} rel={wideBanner.link.startsWith('http') ? 'noopener noreferrer' : undefined} className="mt-4">
                      <Button className="bg-corpicia-green hover:bg-corpicia-green-dark text-white">
                        {wideBanner.CTA}
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* 6) SEGUNDA FILA DE PRODUCTOS */}
      <section className="py-6 md:py-10 bg-white mt-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Más productos para tu proyecto</h2>
            <Link href="/productos/" className="text-corpicia-green text-sm md:text-base font-medium">Ver todo</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6">
            {secondRowProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
