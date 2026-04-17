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

const featuredProducts = productsCatalog
  .filter((product) => product.isFeatured)
  .slice(0, 4);

const secondaryProducts = productsCatalog.slice(4, 8);
const mixedProducts = productsCatalog.slice(8, 10);
const underBannerProducts = productsCatalog.slice(10, 12);

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
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ir a WhatsApp desde banner principal"
              className="block"
            >
              <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] lg:h-[500px] rounded-xl overflow-hidden bg-[#f5fbf6]">
                <Image
                  src="/banners/hero-main-desktop.webp"
                  alt="Banner principal"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
                />
              </div>
            </a>

            <div className="grid gap-4">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ir a WhatsApp desde banner secundario superior"
                className="block"
              >
                <div className="relative w-full h-[160px] sm:h-[180px] md:h-[200px] lg:h-[240px] rounded-xl overflow-hidden bg-[#f5fbf6]">
                  <Image
                    src="/banners/hero-side-1.webp"
                    alt="Banner secundario superior"
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              </a>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ir a WhatsApp desde banner secundario inferior"
                className="block"
              >
                <div className="relative w-full h-[160px] sm:h-[180px] md:h-[200px] lg:h-[240px] rounded-xl overflow-hidden bg-[#f5fbf6]">
                  <Image
                    src="/banners/hero-side-2.jpg"
                    alt="Banner secundario inferior"
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <Card
                  key={b.title}
                  className="min-w-[85%] snap-start border border-gray-200 rounded-xl md:min-w-0"
                >
                  <CardContent className="p-5">
                    <Icon className="text-corpicia-green mb-2 w-5 h-5" />
                    <h3 className="font-semibold text-gray-900">{b.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{b.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Productos destacados</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE MIXTO REDISEÑADO */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            {/* COLUMNA IZQUIERDA */}
            <div className="grid gap-4">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ir a WhatsApp desde banner mixto"
                className="block"
              >
                <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] lg:h-[500px] rounded-xl overflow-hidden bg-[#f5fbf6]">
                  <Image
                    src="/banners/mixed-banner-desktop.jpg"
                    alt="Banner mixto"
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>
              </a>

              {/* NUEVOS 2 PRODUCTOS DEBAJO DEL BANNER */}
              <div className="grid grid-cols-2 gap-4">
                {underBannerProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>

            {/* COLUMNA DERECHA */}
            <div className="grid gap-4">
              {mixedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MÁS PRODUCTOS */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Más productos</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {secondaryProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
