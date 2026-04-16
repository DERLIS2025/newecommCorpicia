import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { ArrowRight, Check, Leaf, Truck, Phone, Shield } from 'lucide-react';
import { getFeaturedProducts } from '@/lib/supabase';

// Mock data for initial development
const featuredProducts = [
  {
    id: '1',
    name: 'Césped Esmeralda Premium',
    slug: 'cesped-esmeralda-premium',
    description: 'Césped de alta calidad, resistente y de rápido crecimiento. Ideal para jardines residenciales.',
    shortDescription: 'Césped premium de alta resistencia',
    pricePerM2: 31000,
    minQuantity: 10,
    images: [],
    category: 'cesped',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Césped Bermuda',
    slug: 'cesped-bermuda',
    description: 'Césped resistente a la sequía, perfecto para climas cálidos.',
    shortDescription: 'Ideal para climas cálidos',
    pricePerM2: 28000,
    minQuantity: 15,
    images: [],
    category: 'cesped',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Fertilizante Orgánico',
    slug: 'fertilizante-organico',
    description: 'Fertilizante 100% orgánico para mantener tu césped verde y saludable.',
    shortDescription: 'Nutrición natural para tu jardín',
    pricePerM2: 15000,
    minQuantity: 5,
    images: [],
    category: 'fertilizantes',
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Kit de Riego Automático',
    slug: 'kit-riego-automatico',
    description: 'Sistema completo de riego por aspersión para mantener tu jardín hidratado.',
    shortDescription: 'Riego eficiente y automático',
    pricePerM2: 125000,
    minQuantity: 1,
    images: [],
    category: 'insumos',
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const categories = [
  { name: 'Césped Natural', slug: 'cesped', image: '/images/cat-cesped.jpg' },
  { name: 'Semillas', slug: 'semillas', image: '/images/cat-semillas.jpg' },
  { name: 'Fertilizantes', slug: 'fertilizantes', image: '/images/cat-fertilizantes.jpg' },
  { name: 'Insumos', slug: 'insumos', image: '/images/cat-insumos.jpg' },
];

const benefits = [
  { icon: Leaf, title: 'Productos de Calidad', description: 'Seleccionamos los mejores productos para tu jardín' },
  { icon: Truck, title: 'Envíos a Domicilio', description: 'Llegamos a todo Paraguay' },
  { icon: Phone, title: 'Asesoría Personalizada', description: 'Expertos en jardinería a tu disposición' },
  { icon: Shield, title: 'Garantía de Satisfacción', description: 'Tu satisfacción es nuestra prioridad' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-corpicia-green to-corpicia-green-dark text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Envíos a todo Paraguay
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Transforma tu espacio con{' '}
                <span className="text-green-300">césped natural</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 max-w-lg">
                Especialistas en césped de alta calidad, instalación profesional y 
                mantenimiento de jardines en Paraguay.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/productos/">
                  <Button size="lg" className="bg-white text-corpicia-green hover:bg-gray-100 gap-2">
                    Ver Productos
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <a href="https://wa.me/595992588770" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Solicitar Presupuesto
                  </Button>
                </a>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-300" />
                  <span className="text-sm">Calidad garantizada</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-300" />
                  <span className="text-sm">Instalación profesional</span>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="aspect-square bg-white/10 rounded-3xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Leaf className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-white/80">Imagen de césped premium</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="text-center">
                  <div className="w-14 h-14 bg-corpicia-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-corpicia-green" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-gray-500">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestras Categorías</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Todo lo que necesitas para tu jardín en un solo lugar
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link key={category.slug} href={`/productos/${category.slug}/`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-corpicia-green/80 group-hover:bg-corpicia-green/90 transition-colors flex items-center justify-center">
                      <Leaf className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-center group-hover:text-corpicia-green transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Productos Destacados</h2>
              <p className="text-gray-500">Los más elegidos por nuestros clientes</p>
            </div>
            <Link href="/productos/" className="hidden md:flex items-center gap-2 text-corpicia-green font-medium hover:underline">
              Ver todos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/productos/">
              <Button variant="outline" className="gap-2">
                Ver todos los productos
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-corpicia-green rounded-3xl p-8 md:p-16 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Necesitas un presupuesto?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Contanos sobre tu proyecto y te enviamos un presupuesto personalizado 
              en minutos. Atendemos Asunción y todo Paraguay.
            </p>
            <a 
              href="https://wa.me/595992588770" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-white text-corpicia-green hover:bg-gray-100">
                <Phone className="w-5 h-5 mr-2" />
                Contactar por WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
