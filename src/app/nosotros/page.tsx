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

// 🔥 IMPORTANTE
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Nosotros - Corpicia | Césped Natural en Paraguay',
  description:
    'Conocé a Corpicia, especialistas en césped natural, riego y jardinería en Paraguay.',
  alternates: {
    canonical: '/nosotros/',
  },
};

// 🔥 GENERAR WORKS AUTOMÁTICOS
function getWorks() {
  const dir = path.join(process.cwd(), 'public/trabajos');

  let files: string[] = [];

  try {
    files = fs.readdirSync(dir);
  } catch (error) {
    console.log('No se pudo leer carpeta trabajos');
  }

  return files
    .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map((file, index) => ({
      title: `Trabajo realizado ${index + 1}`,
      location: 'Paraguay',
      category: 'Proyecto real',
      image: `/trabajos/${file}`,
    }));
}

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
  const works = getWorks();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
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
              sus espacios verdes con instalación profesional y resultados reales.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-corpicia-green"
              >
                <MessageCircle className="h-5 w-5" />
                Solicitar presupuesto
              </a>

              <a
                href="https://www.instagram.com/corpi_y_ciaa/"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 font-semibold text-white"
              >
                <Instagram className="h-5 w-5" />
                Ver trabajos reales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* HISTORIA */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto grid gap-10 px-4 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="mb-2 text-sm font-semibold text-corpicia-green">
              Nuestra historia
            </p>
            <h2 className="text-3xl font-bold">
              Crecimos trabajando en espacios reales
            </h2>
          </div>

          <div className="space-y-4 text-gray-600">
            <p>
              Corpicia nació de la pasión por los espacios verdes y el deseo de
              llevar césped natural de calidad en Paraguay.
            </p>
            <p>
              Nos especializamos en instalación, riego y jardinería profesional.
            </p>
            <p>
              Nuestro enfoque es simple: resultados reales, clientes satisfechos.
            </p>
          </div>
        </div>
      </section>

      {/* 🔥 TRABAJOS AUTOMÁTICOS */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between">
            <h2 className="text-3xl font-bold">Proyectos reales</h2>

            <a
              href="https://www.instagram.com/corpi_y_ciaa/"
              target="_blank"
              className="text-corpicia-green text-sm font-semibold"
            >
              Ver Instagram →
            </a>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4">
            {works.map((work, i) => (
              <Card key={i} className="min-w-[280px] md:min-w-[380px]">
                <div className="relative h-56 w-full">
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <CardContent className="p-5">
                  <p className="text-xs text-corpicia-green mb-1">
                    {work.category}
                  </p>
                  <h3 className="font-bold">{work.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {work.location}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto grid gap-10 px-4 md:grid-cols-[1fr_380px]">
          <div>
            <h2 className="text-3xl font-bold mb-5">
              Instalación profesional
            </h2>

            <div className="space-y-3 text-gray-600">
              {[
                'Revisamos el espacio',
                'Preparamos el terreno',
                'Instalamos césped profesional',
                'Te guiamos después',
              ].map((item) => (
                <p key={item} className="flex gap-3">
                  <CheckCircle2 className="text-green-600 w-5" />
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-black">
            <video controls className="w-full">
              <source src="/videos/trabajo-corpicia.mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-10">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-green-600">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-green-600 text-white p-8 rounded-2xl text-center">
            <h2 className="text-2xl font-bold mb-3">
              Ver más trabajos en Instagram
            </h2>

            <div className="flex justify-center gap-3">
              <a
                href="https://www.instagram.com/corpi_y_ciaa/"
                target="_blank"
                className="bg-white text-green-600 px-5 py-2 rounded-lg font-semibold"
              >
                Instagram
              </a>

              <a
                href="https://www.facebook.com/corpi.jardin/"
                target="_blank"
                className="border border-white px-5 py-2 rounded-lg"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
