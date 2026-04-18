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

const featuredProducts = [
  productsCatalog.find((p) => p.slug === 'cesped-esmeralda'),
  productsCatalog.find((p) => p.slug === 'cesped-siempre-verde'),
  productsCatalog.find((p) => p.slug === 'cesped-kavaju'),
  productsCatalog.find((p) => p.slug === 'cesped-mani-docena'),
].filter(Boolean);

const mixedProducts = [
  productsCatalog.find((p) => p.slug === 'mini-rotor-rain-bird-3500'),
  productsCatalog.find((p) => p.slug === 'difusor-riego'),
].filter(Boolean);

const underBannerProducts = [
  productsCatalog.find((p) => p.slug === 'valvula-riego-rain-bird'),
  productsCatalog.find((p) => p.slug === 'aspersor-rain-bird-5004'),
].filter(Boolean);

const secondaryProducts = [
  productsCatalog.find((p) => p.slug === 'piso-ecologico-40x60'),
  productsCatalog.find((p) => p.slug === 'separador-cesped-caminos'),
  productsCatalog.find((p) => p.slug === 'pisos-imitacion-madera'),
  productsCatalog.find((p) => p.slug === 'granza-blanca-fina-decorativa'),
  productsCatalog.find((p) => p.slug === 'canto-rodado'),
].filter(Boolean);

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
      <section className="border-b">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <div className="relative w-full aspect-[16/9] lg:h-[500px] rounded-xl overflow-hidden bg-[#f5fbf6]">
                <Image
                  src="/banners/hero-main-desktop.webp"
                  alt="Banner principal"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </a>

            <div className="grid gap-4">
              <a href={whatsappHref} target="_blank" rel="noreferrer">
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#f5fbf6]">
                  <Image
                    src="/banners/hero-side-1.webp"
                    alt="Banner lateral 1"
                    fill
                    className="object-contain"
                  />
                </div>
              </a>

              <a href={whatsappHref} target="_blank" rel="noreferrer">
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#f5fbf6]">
                  <Image
                    src="/banners/hero-side-2.jpg"
                    alt="Banner lateral 2"
                    fill
                    className="object-contain"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:gap-4">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <Card key={b.title} className="min-w-[80%] md:min-w-0">
                  <CardContent className="p-4">
                    <Icon className="text-corpicia-green mb-2 w-5 h-5" />
                    <h3 className="font-semibold">{b.title}</h3>
                    <p className="text-sm text-gray-600">{b.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">
            Productos destacados
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p!.id} product={p!} />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="grid gap-4">
              <a href={whatsappHref} target="_blank" rel="noreferrer">
                <div className="relative w-full aspect-[16/9] lg:h-[500px] rounded-xl overflow-hidden bg-[#f5fbf6]">
                  <Image
                    src="/banners/mixed-banner-desktop.jpg"
                    alt="Banner riego automático"
                    fill
                    className="object-contain"
                  />
                </div>
              </a>

              <div className="grid grid-cols-2 gap-4">
                {underBannerProducts.map((p) => (
                  <ProductCard key={p!.id} product={p!} />
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">
                Riego Automático
              </h2>
              {mixedProducts.map((p) => (
                <ProductCard key={p!.id} product={p!} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Paisajismo</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 justify-items-center">
            {secondaryProducts.map((p) => (
              <div className="w-full max-w-[260px]" key={p!.id}>
                <ProductCard product={p!} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}