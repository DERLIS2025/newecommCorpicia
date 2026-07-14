import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, Droplets, TreePine, Home, ArrowRight, Settings } from 'lucide-react';
import type { Metadata } from 'next';
import { getWhatsAppUrl } from '@/lib/utils';
import { getServices } from '@/lib/repositories/services';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Servicios - Corpicia | Instalación y Mantenimiento',
  description: 'Servicios profesionales de instalación de césped, mantenimiento de jardines, paisajismo y sistemas de riego en Paraguay.',
  alternates: {
    canonical: '/servicios/',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-corpicia-green text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Nuestros Servicios
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Ofrecemos soluciones integrales para tu jardín. Desde la instalación 
            hasta el mantenimiento continuo.
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service: any) => {
            // Manejar compatibilidad con fallback estático o DB
            const Icon = service.icon || Settings;
            const hasImage = !!service.image_url;

            return (
              <Card key={service.title || service.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {hasImage && (
                    <div className="relative w-full aspect-video bg-gray-100">
                      <Image 
                        src={service.image_url} 
                        alt={service.title} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {!hasImage && (
                      <div className="w-14 h-14 bg-corpicia-green/10 rounded-xl flex items-center justify-center mb-4">
                        <Icon className="w-7 h-7 text-corpicia-green" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                    
                    {service.features && service.features.length > 0 && (
                      <ul className="space-y-2 mt-4">
                        {service.features.map((feature: string) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-corpicia-green rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="px-6 pb-6">
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full gap-2">
                        Solicitar Presupuesto
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Tenés un proyecto en mente?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Contactanos y te ayudamos a hacer realidad el jardín de tus sueños. 
            Atendemos proyectos residenciales y comerciales en todo Paraguay.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="gap-2">
              Hablar con un Experto
              <ArrowRight className="w-5 h-5" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
