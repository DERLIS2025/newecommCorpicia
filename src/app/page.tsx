import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { ArrowRight, Check, Leaf, Truck, Phone, Shield, ChevronRight, Sparkles } from 'lucide-react';
import { homeHeroBanners, homeSecondaryBanners } from '@/data/banners';
import { productsCatalog } from './productos/[slug]/productsData';

export const metadata: Metadata = {
  title: 'Césped natural y jardinería en Paraguay | Corpicia',
  description: 'Comprá césped en Paraguay, accesorios de riego y soluciones de jardinería. Cotizá online y enviá tu presupuesto por WhatsApp.',
  alternates: {
    canonical: '/',
  },
};

const featuredProducts = productsCatalog.filter((product) => product.isFeatured).slice(0, 4);

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

const activeHeroBanners = homeHeroBanners.filter((banner) => banner.active).sort((a, b) => a.order - b.order);
const activeSecondaryBanners = homeSecondaryBanners.filter((banner) => banner.active).sort((a, b) => a.order - b.order);

export default function HomePage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-[#f5fbf6] to-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-8 md:py-10">
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            {activeHeroBanners.map((banner, index) => (
              <Card
                key={banner.title}
                className={`${index === 0 ? 'lg:row-span-2' : ''} border-0 shadow-sm overflow-hidden bg-white`}
              >
                <CardContent className="p-0">
                  <div className="h-full min-h-[220px] md:min-h-[260px] p-8 md:p-10 bg-gradient-to-br from-corpicia-green to-[#025c17] text-white flex flex-col justify-between">
                    <div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/30 px-3 py-1 text-xs md:text-sm mb-4">
                        <Sparkles className="w-4 h-4" />
                        Banner {index + 1}
                      </span>
                      <h1 className={`${index === 0 ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'} font-bold leading-tight`}>
                        {banner.title}
                      </h1>
                      <p className="mt-3 text-white/85 max-w-2xl">{banner.subtitle}</p>
                    </div>
                    <div className="mt-6">
                      <Link href={banner.link}>
                        <Button size="lg" className="bg-white text-corpicia-green hover:bg-gray-100 gap-2">
                          {banner.CTA}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 md:grid-cols-3">
            {promoBlocks.map((promo) => (
              <Card key={promo.title} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900">{promo.title}</h2>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">{promo.description}</p>
                  <Link href={promo.link} className="inline-flex items-center gap-2 mt-4 text-corpicia-green font-medium text-sm">
                    {promo.cta}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10 bg-[#f8faf8] border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="border border-gray-100 shadow-none">
                  <CardContent className="p-4 md:p-5">
                    <div className="w-10 h-10 rounded-lg bg-corpicia-green/10 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-corpicia-green" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">{benefit.title}</h3>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-sm text-corpicia-green font-semibold uppercase tracking-wide">Categorías</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">Comprá por categoría</h2>
            </div>
            <Link href="/productos/" className="text-corpicia-green font-medium hidden md:inline-flex items-center gap-2">
              Ver todo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {categories.map((category) => (
              <Link key={category.name} href={category.href}>
                <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div className="w-12 h-12 rounded-xl bg-corpicia-green/10 flex items-center justify-center mb-5">
                      <Leaf className="w-6 h-6 text-corpicia-green" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600 mt-2">{category.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm text-corpicia-green font-semibold uppercase tracking-wide">Destacados</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">Productos recomendados</h2>
            </div>
            <Link href="/productos/" className="hidden md:flex items-center gap-2 text-corpicia-green font-medium">
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 md:grid-cols-2">
            {activeSecondaryBanners.map((banner) => (
              <Card key={banner.title} className="overflow-hidden border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="p-8 bg-gradient-to-br from-[#0b7f2a] to-corpicia-green text-white min-h-[220px] flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold leading-tight">{banner.title}</h3>
                      <p className="text-white/85 mt-2">{banner.subtitle}</p>
                    </div>
                    <div className="mt-5">
                      <a href={banner.link} target={banner.link.startsWith('http') ? '_blank' : undefined} rel={banner.link.startsWith('http') ? 'noopener noreferrer' : undefined}>
                        <Button className="bg-white text-corpicia-green hover:bg-gray-100">
                          {banner.CTA}
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#f3f7f3] border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900">Recibí novedades y promociones</h2>
            <p className="text-gray-600 mt-3">
              Consejos prácticos para el cuidado del césped, lanzamientos y oportunidades exclusivas.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="w-full h-12 rounded-lg border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-corpicia-green/30 focus:border-corpicia-green"
              />
              <Button className="h-12 px-6">Suscribirme</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="bg-corpicia-green rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold">¿Listo para armar tu presupuesto?</h2>
            <p className="text-white/90 mt-3 max-w-2xl mx-auto">
              Elegí tus productos, definí los m² y enviá tu solicitud por WhatsApp con un solo clic.
            </p>
            <div className="mt-7 flex justify-center gap-3 flex-wrap">
              <Link href="/productos/">
                <Button size="lg" className="bg-white text-corpicia-green hover:bg-gray-100">
                  Ver catálogo
                </Button>
              </Link>
              <a href="https://wa.me/595992588770" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Phone className="w-4 h-4 mr-2" />
                  Contactar por WhatsApp
                </Button>
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white/90">
              <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4" /> Cálculo por m²</span>
              <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4" /> Presupuesto inmediato</span>
              <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4" /> Atención personalizada</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
