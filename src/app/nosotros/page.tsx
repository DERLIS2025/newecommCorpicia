import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Users, Award, Heart, Instagram, Facebook } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getWhatsAppUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Nosotros - Corpicia | Césped Natural en Paraguay',
  description:
    'Conocé a Corpicia, especialistas en césped natural y jardinería en Paraguay. Más de 10 años de experiencia transformando espacios verdes.',
  alternates: {
    canonical: '/nosotros/',
  },
};

const values = [
  {
    icon: Leaf,
    title: 'Calidad',
    description:
      'Seleccionamos los mejores productos para garantizar resultados excepcionales.',
  },
  {
    icon: Users,
    title: 'Compromiso',
    description:
      'Trabajamos cerca de nuestros clientes para entender y cumplir sus necesidades.',
  },
  {
    icon: Award,
    title: 'Experiencia',
    description: 'Más de 10 años en el mercado nos respaldan.',
  },
  {
    icon: Heart,
    title: 'Pasión',
    description: 'Amamos lo que hacemos y eso se refleja en cada proyecto.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-corpicia-green text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Sobre Corpicia
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Especialistas en césped natural y soluciones de jardinería en Paraguay.
            Transformamos espacios verdes con pasión y profesionalismo.
          </p>
        </div>
      </div>

      {/* Historia */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Nuestra Historia
          </h2>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="mb-4">
              Corpicia nació de la pasión por los espacios verdes y el deseo de llevar
              la mejor calidad en césped natural a los hogares y empresas de Paraguay.
            </p>
            <p className="mb-4">
              Nos especializamos en la instalación de césped natural, sistemas de riego
              y soluciones completas de jardinería adaptadas al clima paraguayo.
            </p>
            <p>
              Hoy, con más de 10 años de experiencia, ayudamos a nuestros clientes a
              transformar sus espacios con resultados duraderos y profesionales.
            </p>
          </div>
        </div>
      </div>

      {/* Trabajos realizados */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            Trabajos realizados por Corpicia
          </h2>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/trabajos/instalacion-cesped-asuncion.jpg"
                alt="Instalación de césped natural en Asunción"
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">
                Instalación de césped natural en Asunción
              </h3>

              <p className="text-gray-600 mb-6">
                Proyecto real realizado por el equipo de Corpicia. Nos encargamos
                desde la preparación del terreno hasta la instalación final del césped,
                garantizando un acabado uniforme, duradero y listo para disfrutar.
              </p>

              <ul className="text-gray-600 space-y-2 mb-6">
                <li>✔ Preparación del terreno</li>
                <li>✔ Nivelación y drenaje</li>
                <li>✔ Instalación profesional de césped</li>
                <li>✔ Asesoramiento post-instalación</li>
              </ul>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-corpicia-green text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Solicitar presupuesto por WhatsApp
              </a>
            </div>
          </div>

          {/* Video */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold mb-6">
              Mirá cómo trabajamos
            </h3>

            <div className="mx-auto max-w-sm md:max-w-md lg:max-w-lg rounded-2xl overflow-hidden shadow-xl bg-black">
              <video
                className="w-full h-auto"
                controls
                playsInline
                preload="metadata"
                poster="/trabajos/instalacion-cesped-asuncion.jpg"
              >
                <source src="/videos/trabajo-corpicia.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>

      {/* Valores */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Nuestros Valores
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-corpicia-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-corpicia-green" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <p className="text-4xl font-bold text-corpicia-green mb-2">10+</p>
            <p className="text-gray-600">Años de experiencia</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-corpicia-green mb-2">1000+</p>
            <p className="text-gray-600">Clientes satisfechos</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-corpicia-green mb-2">50000+</p>
            <p className="text-gray-600">m² instalados</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-corpicia-green mb-2">50+</p>
            <p className="text-gray-600">Proyectos corporativos</p>
          </div>
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Seguinos en redes
          </h2>

          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Mirá nuestros trabajos reales, instalaciones, proyectos terminados y novedades de Corpicia.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://www.instagram.com/corpi_y_ciaa/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              <Instagram className="w-5 h-5" />
              Instagram
            </a>

            <a
              href="https://www.facebook.com/corpi.jardin/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              <Facebook className="w-5 h-5" />
              Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
