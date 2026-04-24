import { Card, CardContent } from '@/components/ui/card';
import {
  Leaf,
  Users,
  Award,
  Heart,
  Instagram,
  Facebook,
  MessageCircle,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getWhatsAppUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Nosotros - Corpicia | Césped Natural en Paraguay',
  description:
    'Conocé a Corpicia, especialistas en césped natural, riego y jardinería en Paraguay.',
  alternates: {
    canonical: '/nosotros/',
  },
};

const works = [
  {
    title: 'Instalación de césped natural',
    location: 'Asunción',
    category: 'Césped natural',
    image: '/trabajos/instalacion-cesped-asuncion.jpg',
  },
];

const trustItems = [
  {
    icon: Leaf,
    title: 'Césped de calidad',
    description: 'Seleccionamos variedades adaptadas al clima paraguayo.',
  },
  {
    icon: Users,
    title: 'Acompañamiento',
    description: 'Asesoramos antes, durante y después de cada instalación.',
  },
  {
    icon: Award,
    title: 'Experiencia',
    description: 'Más de 10 años trabajando en espacios verdes.',
  },
  {
    icon: Heart,
    title: 'Trabajo responsable',
    description: 'Cuidamos cada detalle para lograr un resultado prolijo.',
  },
];

const stats = [
  { value: '10+', label: 'Años de experiencia' },
  { value: '1000+', label: 'Clientes satisfechos' },
  { value: '50000+', label: 'm² instalados' },
  { value: '50+', label: 'Proyectos corporativos' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-corpicia-green text-white">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/80">
              Conocé a Corpicia
            </p>
            <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
              Especialistas en césped natural, riego y jardinería en Paraguay
            </h1>
            <p className="max-w-2xl text-lg text-white/90">
              Ayudamos a familias, empresas y proyectos comerciales a transformar
              sus espacios verdes con productos confiables, instalación profesional
              y asesoramiento cercano.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-corpicia-green transition hover:opacity-90"
              >
                <MessageCircle className="h-5 w-5" />
                Solicitar presupuesto
              </a>

              <a
                href="https://www.instagram.com/corpi_y_ciaa/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                <Instagram className="h-5 w-5" />
                Ver trabajos reales
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto grid gap-10 px-4 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-corpicia-green">
              Nuestra historia
            </p>
            <h2 className="mb-5 text-3xl font-bold text-gray-900">
              Crecimos trabajando en espacios verdes reales
            </h2>
          </div>

          <div className="space-y-4 text-base leading-relaxed text-gray-600">
            <p>
              Corpicia nació de la pasión por los espacios verdes y el deseo de
              llevar césped natural de calidad a hogares, empresas y proyectos en
              Paraguay.
            </p>
            <p>
              Nos especializamos en instalación de césped natural, sistemas de riego
              y soluciones de jardinería pensadas para lograr espacios prolijos,
              funcionales y duraderos.
            </p>
            <p>
              Nuestro enfoque es simple: escuchar al cliente, recomendar la mejor
              solución y acompañar cada proyecto con responsabilidad.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-corpicia-green">
                Trabajos realizados
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                Proyectos reales de Corpicia
              </h2>
              <p className="mt-3 max-w-2xl text-gray-600">
                Esta sección está preparada para sumar más imágenes y convertirla en
                un carrusel de trabajos reales.
              </p>
            </div>

            <a
              href="https://www.instagram.com/corpi_y_ciaa/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-corpicia-green hover:underline"
            >
              <Instagram className="h-4 w-4" />
              Ver más en Instagram
            </a>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4">
            {works.map((work) => (
              <Card
                key={work.title}
                className="min-w-[280px] overflow-hidden md:min-w-[380px]"
              >
                <div className="relative h-56 w-full md:h-64">
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-5">
                  <p className="mb-2 inline-flex rounded-full bg-corpicia-green/10 px-3 py-1 text-xs font-semibold text-corpicia-green">
                    {work.category}
                  </p>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    {work.title}
                  </h3>
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-corpicia-green" />
                    {work.location}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto grid gap-10 px-4 md:grid-cols-[1fr_380px] md:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-corpicia-green">
              Cómo trabajamos
            </p>
            <h2 className="mb-5 text-3xl font-bold text-gray-900">
              Instalaciones cuidadas de principio a fin
            </h2>

            <div className="space-y-3 text-gray-600">
              {[
                'Revisamos el espacio y recomendamos la solución adecuada.',
                'Preparamos el terreno para una instalación prolija.',
                'Instalamos el césped con criterio técnico y terminación limpia.',
                'Brindamos orientación para el cuidado posterior.',
              ].map((item) => (
                <p key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-corpicia-green" />
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-black shadow-xl">
            <video
              className="h-auto w-full"
              controls
              playsInline
              preload="metadata"
              poster="/trabajos/instalacion-cesped-asuncion.jpg"
            >
              <source src="/videos/trabajo-corpicia.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-corpicia-green">
              Por qué confiar
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              Lo que nos diferencia
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title}>
                  <CardContent className="p-5">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-corpicia-green/10">
                      <Icon className="h-6 w-6 text-corpicia-green" />
                    </div>
                    <h3 className="mb-2 font-bold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 rounded-2xl bg-gray-50 p-6 md:grid-cols-4 md:p-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-corpicia-green">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-corpicia-green p-8 text-center text-white md:p-10">
            <Instagram className="mx-auto mb-4 h-9 w-9" />
            <h2 className="mb-3 text-3xl font-bold">
              Mirá más trabajos reales en Instagram
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-white/90">
              Publicamos instalaciones, avances de obra y resultados terminados.
              Es el mejor lugar para ver cómo trabaja Corpicia en proyectos reales.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://www.instagram.com/corpi_y_ciaa/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-corpicia-green transition hover:opacity-90"
              >
                <Instagram className="h-5 w-5" />
                Ir a Instagram
              </a>

              <a
                href="https://www.facebook.com/corpi.jardin/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                <Facebook className="h-5 w-5" />
                Facebook
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
