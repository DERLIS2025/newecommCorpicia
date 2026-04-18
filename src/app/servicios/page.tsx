import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, Droplets, TreePine, Home, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getWhatsAppUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Servicios - Corpicia | Instalación y Mantenimiento',
  description: 'Servicios profesionales de instalación de césped, mantenimiento de jardines, paisajismo y sistemas de riego en Paraguay.',
  alternates: {
    canonical: '/servicios/',
  },
};

const services = [
  {
    icon: Leaf,
    title: 'Instalación de Césped',
    description: 'Instalación profesional de césped natural con preparación del terreno, nivelación y siembra o colocación de tepes.',
    features: [
      'Evaluación del terreno',
      'Preparación y nivelación',
      'Instalación de tepes o siembra',
      'Garantía de instalación',
    ],
  },
  {
    icon: Droplets,
    title: 'Sistemas de Riego',
    description: 'Diseño e instalación de sistemas de riego automático para mantener tu jardín siempre hidratado.',
    features: [
      'Diseño personalizado',
      'Instalación de aspersores',
      'Programadores automáticos',
      'Mantenimiento',
    ],
  },
  {
    icon: TreePine,
    title: 'Paisajismo',
    description: 'Diseño y ejecución de proyectos de jardinería y paisajismo para espacios residenciales y comerciales.',
    features: [
      'Diseño 3D del proyecto',
      'Selección de plantas',
      'Ejecución integral',
      'Mantenimiento continuo',
    ],
  },
  {
    icon: Home,
    title: 'Mantenimiento',
    description: 'Servicio de mantenimiento regular para mantener tu jardín en óptimas condiciones todo el año.',
    features: [
      'Corte y bordes',
      'Fertilización',
      'Control de plagas',
      'Poda de plantas',
    ],
  },
];

export default function ServicesPage() {
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
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="w-14 h-14 bg-corpicia-green/10 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-corpicia-green" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-corpicia-green rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
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
