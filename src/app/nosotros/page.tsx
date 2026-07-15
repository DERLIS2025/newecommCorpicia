import { Card, CardContent } from '@/components/ui/card';
import {
  Leaf,
  Users,
  Award,
  Heart,
  Instagram,
  Facebook,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getWhatsAppUrl } from '@/lib/utils';
import fs from 'fs';
import path from 'path';

import { getSeoEntry } from '@/lib/repositories/seo';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoEntry('/nosotros');

  const defaultMeta = {
    title: 'Nosotros - Corpicia | Césped Natural en Paraguay',
    description: 'Conocé a Corpicia, especialistas en césped natural, riego y jardinería en Paraguay. Más de 10 años transformando espacios verdes con instalación profesional.',
    alternates: { canonical: '/nosotros/' },
  };

  if (!seo) return defaultMeta;

  const seoTitle = seo.title || defaultMeta.title;
  const seoDescription = seo.description || defaultMeta.description;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seo.keywords ? seo.keywords.split(',').map((k: string) => k.trim()) : undefined,
    alternates: defaultMeta.alternates,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: seo.og_image ? [{ url: seo.og_image }] : undefined,
    },
    twitter: {
      title: seoTitle,
      description: seoDescription,
      images: seo.og_image ? [seo.og_image] : undefined,
    }
  };
}

function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Corpicia - Césped y Jardinería',
    description: 'Especialistas en césped natural, riego y jardinería en Paraguay',
    url: 'https://www.corpicia.com/nosotros/',
    telephone: '+595-992-588-770',
    email: 'info@corpicia.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Asunción',
      addressCountry: 'PY',
    },
    image: 'https://www.corpicia.com/og-image.jpg',
    priceRange: '$$',
    openingHours: 'Mo-Sa 08:00-18:00',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// 🔥 NUEVO: Lee data.json para títulos reales, ignora archivos que no estén en el JSON
function getWorks() {
  const dir = path.join(process.cwd(), 'public/trabajos');
  let metadata: Array<{ file: string; title: string; location: string }> = [];

  // Leer data.json si existe
  try {
    const dataPath = path.join(process.cwd(), 'public/trabajos/data.json');
    const raw = fs.readFileSync(dataPath, 'utf-8');
    metadata = JSON.parse(raw);
  } catch (error) {
    console.log('No se encontró data.json');
  }

  // Si hay data.json, usar esos datos (solo archivos que existan)
  if (metadata.length > 0) {
    return metadata
      .filter((item) => {
        const fullPath = path.join(dir, item.file);
        return fs.existsSync(fullPath);
      })
      .map((item) => ({
        title: item.title,
        location: item.location,
        category: 'Proyecto real',
        image: `/trabajos/${item.file}`,
      }));
  }

  // Fallback: leer todos los archivos
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
    description: 'Seleccionamos variedades adaptadas al clima paraguayo para máxima resistencia.',
  },
  {
    icon: Users,
    title: 'Acompañamiento total',
    description: 'Asesoramos antes, durante y después de cada instalación. No te dejamos solo.',
  },
  {
    icon: Award,
    title: '10+ años de experiencia',
    description: 'Más de una década transformando espacios verdes en todo Paraguay.',
  },
  {
    icon: Heart,
    title: 'Trabajo responsable',
    description: 'Cuidamos cada detalle para lograr un resultado prolijo y duradero.',
  },
];

const stats = [
  { value: '10+', label: 'Años de experiencia', suffix: 'años' },
  { value: '1000+', label: 'Clientes satisfechos', suffix: 'clientes' },
  { value: '50000+', label: 'm² instalados', suffix: 'm²' },
  { value: '50+', label: 'Proyectos corporativos', suffix: 'proyectos' },
];

const processSteps = [
  {
    step: '01',
    title: 'Revisamos el espacio',
    desc: 'Visitamos tu terreno para evaluar condiciones del suelo, acceso y necesidades específicas.',
  },
  {
    step: '02',
    title: 'Preparamos el terreno',
    desc: 'Nivelamos, fertilizamos y acondicionamos el suelo para garantizar el crecimiento óptimo.',
  },
  {
    step: '03',
    title: 'Instalamos césped profesional',
    desc: 'Colocamos rollos de césped natural de la más alta calidad con técnicas profesionales.',
  },
  {
    step: '04',
    title: 'Te guiamos después',
    desc: 'Te damos instrucciones de riego y mantenimiento para que tu césped se mantenga verde.',
  },
];

export default function AboutPage() {
  const works = getWorks();

  return (
    <div className="min-h-screen bg-gray-50">
      <OrganizationSchema />

      {/* HERO CON IMAGEN DEL EQUIPO */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-corpicia-green rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* IMAGEN DEL EQUIPO */}
            <div className="relative order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] sm:aspect-[3/4] max-w-md mx-auto lg:max-w-none">
                <Image
                  src="/trabajos/equipo-corpicia.png"
                  alt="Equipo Corpicia - Especialistas en jardinería Paraguay"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 bg-corpicia-green text-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl">
                <p className="text-xl md:text-2xl font-bold">Desde 2014</p>
                <p className="text-[10px] md:text-xs text-white/80">Transformando Paraguay</p>
              </div>
            </div>

            {/* TEXTO */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 px-4 py-2 rounded-full mb-4 md:mb-6">
                <span className="w-2 h-2 bg-corpicia-green rounded-full" />
                <span className="text-sm font-medium text-corpicia-green">Conocé a Corpicia</span>
              </div>

              <h1 className="mb-4 md:mb-5 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                Especialistas en césped natural,{' '}
                <span className="text-corpicia-green">riego y jardinería</span> en Paraguay
              </h1>
              
              <p className="max-w-xl text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-6 md:mb-8">
                Ayudamos a familias, empresas y proyectos comerciales a transformar
                sus espacios verdes con instalación profesional y resultados que duran años.
              </p>

              <div className="flex flex-wrap gap-3 md:gap-4">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 md:gap-3 rounded-xl bg-[#25D366] px-5 md:px-6 py-3 md:py-4 font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 text-sm md:text-base"
                >
                  <Image
                    src="/icons/whatsapp-sticker.svg"
                    alt="WhatsApp"
                    width={24}
                    height={24}
                    className="w-5 h-5 md:w-6 md:h-6"
                  />
                  Solicitar presupuesto
                </a>

                <a
                  href="#proyectos"
                  className="inline-flex items-center gap-2 md:gap-3 rounded-xl border-2 border-gray-200 px-5 md:px-6 py-3 md:py-4 font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all text-sm md:text-base"
                >
                  <Image
                    src="/icons/play-sticker.svg"
                    alt="Ver trabajos"
                    width={20}
                    height={20}
                    className="w-4 h-4 md:w-5 md:h-5"
                  />
                  Ver trabajos reales
                </a>
              </div>

              <div className="mt-8 md:mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 border-t border-gray-100 pt-6 md:pt-8">
                {stats.map((s) => (
                  <div key={s.label} className="text-center md:text-left">
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-corpicia-green">{s.value}</p>
                    <p className="text-xs md:text-sm text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HISTORIA */}
      <section className="bg-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:gap-12 lg:grid-cols-2 items-center">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-gray-100">
                {works.length > 1 ? (
                  <Image
                    src={works[1].image}
                    alt="Nuestro trabajo en Paraguay"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : works.length > 0 ? (
                  <Image
                    src={works[0].image}
                    alt="Nuestro trabajo en Paraguay"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full bg-corpicia-green/10 flex flex-col items-center justify-center">
                    <Leaf className="w-16 h-16 text-corpicia-green/40 mb-3" />
                    <p className="text-corpicia-green/60 font-medium">Próximamente fotos</p>
                  </div>
                )}
              </div>
              
              <div className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 bg-corpicia-green text-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl z-10">
                <p className="text-xl md:text-2xl font-bold">Desde 2014</p>
                <p className="text-[10px] md:text-xs text-white/80">Transformando Paraguay</p>
              </div>
            </div>

            <div className="lg:pl-8">
              <p className="mb-2 md:mb-3 text-sm font-bold uppercase tracking-wider text-corpicia-green">
                Nuestra historia
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight text-gray-900">
                Crecimos trabajando en espacios reales, no en una oficina
              </h2>
              
              <div className="space-y-3 md:space-y-4 text-gray-600 leading-relaxed text-sm md:text-base">
                <p>
                  Corpicia nació de una simple observación: los paraguayos merecían 
                  césped natural de calidad, instalado por gente que entiende del clima 
                  local y las necesidades reales de cada terreno.
                </p>
                <p>
                  Lo que empezó como un pequeño servicio de jardinería en Asunción, 
                  hoy se convirtió en un equipo de especialistas que atiende desde 
                  hogares familiares hasta proyectos corporativos de gran escala.
                </p>
                <p>
                  Nuestro enfoque sigue siendo el mismo desde el día uno:{' '}
                  <strong className="text-gray-900">resultados reales, clientes satisfechos</strong>. 
                  No vendemos rollos de césped, vendemos espacios verdes donde tu familia 
                  se reúne, donde tus clientes se quedan, donde tu empresa crece.
                </p>
              </div>

              <div className="mt-6 md:mt-8 grid grid-cols-2 gap-3 md:gap-4">
                {[
                  { label: 'Misión', text: 'Democratizar el acceso a césped natural de calidad en Paraguay.' },
                  { label: 'Visión', text: 'Ser la empresa líder en espacios verdes del Mercosur para 2030.' },
                ].map((item) => (
                  <div key={item.label} className="bg-white p-3 md:p-4 rounded-xl shadow-sm">
                    <p className="font-bold text-corpicia-green mb-1 text-sm md:text-base">{item.label}</p>
                    <p className="text-xs md:text-sm text-gray-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST ITEMS */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
            <p className="text-sm font-bold uppercase tracking-wider text-corpicia-green mb-2 md:mb-3">
              Diferencia Corpicia
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-gray-900">
              ¿Por qué confiar en nosotros?
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              No somos solo vendedores de césped. Somos especialistas que te acompañan 
              en todo el proceso.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {trustItems.map((item) => (
              <Card key={item.title} className="border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-5 md:p-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                    <item.icon className="w-5 h-5 md:w-6 md:h-6 text-corpicia-green" />
                  </div>
                  <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PROYECTOS */}
      <section id="proyectos" className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-10 gap-3 md:gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-corpicia-green mb-1 md:mb-2">
                Galería de trabajos
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                Proyectos que hablan por sí solos
              </h2>
            </div>
            <a
              href="https://www.instagram.com/corpi_y_ciaa/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-corpicia-green font-semibold hover:gap-3 transition-all shrink-0 text-sm md:text-base"
            >
              Ver todos en Instagram
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {works.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {works.map((work, i) => (
                <Card key={i} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                  <div className="relative h-40 sm:h-48 md:h-64 w-full overflow-hidden">
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs md:text-sm font-medium">{work.category}</p>
                    </div>
                  </div>
                  <CardContent className="p-3 md:p-5">
                    <h3 className="font-bold text-sm md:text-lg mb-0.5 md:mb-1 group-hover:text-corpicia-green transition-colors text-gray-900">
                      {work.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1.5 md:gap-2">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                      {work.location}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl">
              <p className="text-gray-500">
                Próximamente mostraremos nuestros proyectos. Seguinos en Instagram para ver trabajos en tiempo real.
              </p>
            </div>
          )}

          {works.length > 6 && (
            <div className="text-center mt-6 md:mt-8">
              <a
                href="https://www.instagram.com/corpi_y_ciaa/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-corpicia-green text-white px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold hover:bg-corpicia-green/90 transition-colors text-sm md:text-base"
              >
                <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                Ver {works.length - 6} proyectos más en Instagram
              </a>
            </div>
          )}
        </div>
      </section>

      {/* PROCESO */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
            <p className="text-sm font-bold uppercase tracking-wider text-corpicia-green mb-2 md:mb-3">
              Cómo trabajamos
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-gray-900">
              Instalación profesional en 4 pasos
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Un proceso probado que garantiza resultados duraderos desde el día uno.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-2 mb-8 md:mb-12">
            {processSteps.map((step, i) => (
              <div key={step.step} className="relative flex items-center">
                <div className="bg-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl flex-1 h-full border border-gray-100">
                  <span className="text-2xl md:text-4xl font-bold text-corpicia-green/20 block mb-2 md:mb-4">
                    {step.step}
                  </span>
                  <h3 className="font-bold text-sm md:text-lg mb-1 md:mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{step.desc}</p>
                </div>
                
                {i < 3 && (
                  <div className="hidden lg:flex items-center justify-center shrink-0 mx-1">
                    <div className="bg-corpicia-green text-white rounded-full p-1.5 md:p-2 shadow-md">
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Video */}
          <div className="max-w-[320px] sm:max-w-[400px] mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
              <video
                controls
                className="w-full h-auto"
                poster={works.length > 0 ? works[0].image : undefined}
                preload="metadata"
                playsInline
              >
                <source src="/videos/trabajo-corpicia.mp4" type="video/mp4" />
                <p className="text-white text-center py-12 px-4 text-sm">
                  Tu navegador no soporta videos.
                  <a href={getWhatsAppUrl()} className="text-green-400 underline ml-1 block mt-2">
                    Contactanos por WhatsApp
                  </a>
                </p>
              </video>
            </div>
            <p className="text-center text-xs md:text-sm text-gray-500 mt-3 md:mt-4">
              Instalación de césped profesional en Paraguay
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
            {/* Social */}
            <div className="bg-white p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 text-gray-900">
                  Ver más trabajos en tiempo real
                </h2>
                <p className="text-gray-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                  Subimos fotos y videos de nuestros proyectos diariamente. 
                  Seguinos para ver el antes y después de cada instalación.
                </p>
                
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <a
                    href="https://www.instagram.com/corpi_y_ciaa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-bold hover:shadow-lg transition-all text-sm"
                  >
                    <Image
                      src="/icons/instagram-sticker.svg"
                      alt="Instagram"
                      width={18}
                      height={18}
                      className="w-4 h-4 md:w-5 md:h-5"
                    />
                    Instagram
                  </a>
                  <a
                    href="https://www.facebook.com/corpi.jardin/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#1877F2] text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-bold hover:shadow-lg transition-all text-sm"
                  >
                    <Image
                      src="/icons/facebook-sticker.svg"
                      alt="Facebook"
                      width={18}
                      height={18}
                      className="w-4 h-4 md:w-5 md:h-5"
                    />
                    Facebook
                  </a>
                </div>
              </div>

              <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100">
                <p className="text-xs md:text-sm text-gray-500 mb-2">¿Preferís hablar directo?</p>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-corpicia-green font-semibold hover:underline text-sm md:text-base"
                >
                  <Image
                    src="/icons/whatsapp-sticker.svg"
                    alt="WhatsApp"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                  Escribinos por WhatsApp
                </a>
              </div>
            </div>

            {/* Contacto */}
            <div className="bg-white p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-corpicia-green mb-2 md:mb-3">
                  Contacto directo
                </p>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 text-gray-900">
                  ¿Tenés un proyecto en mente?
                </h2>
                <p className="text-gray-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                  Estamos en Asunción pero trabajamos en todo Paraguay. 
                  Escribinos y te damos un presupuesto sin compromiso en menos de 24 horas.
                </p>

                <div className="space-y-2 md:space-y-3">
                  <a
                    href="tel:+595992588770"
                    className="flex items-center gap-3 md:gap-4 p-2.5 md:p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-corpicia-green" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs md:text-sm text-gray-900">Llamanos</p>
                      <p className="text-corpicia-green text-xs md:text-sm">+595 992 588 770</p>
                    </div>
                  </a>

                  <a
                    href="mailto:info@corpicia.com"
                    className="flex items-center gap-3 md:gap-4 p-2.5 md:p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-corpicia-green" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs md:text-sm text-gray-900">Escribinos</p>
                      <p className="text-corpicia-green text-xs md:text-sm truncate">info@corpicia.com</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-3 md:gap-4 p-2.5 md:p-3 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-corpicia-green" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs md:text-sm text-gray-900">Ubicación</p>
                      <p className="text-gray-600 text-xs md:text-sm">Asunción, Paraguay</p>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 md:mt-6 w-full inline-flex items-center justify-center gap-2 md:gap-3 bg-[#25D366] text-white px-5 md:px-6 py-3 md:py-3.5 rounded-xl font-bold hover:bg-[#128C7E] transition-colors text-sm md:text-base"
              >
                <Image
                  src="/icons/whatsapp-sticker.svg"
                  alt="WhatsApp"
                  width={18}
                  height={18}
                  className="w-4 h-4 md:w-5 md:h-5"
                />
                Solicitar presupuesto ahora
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BOTÓN WHATSAPP FLOTANTE — Solo mobile */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50 lg:hidden bg-[#25D366] text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform"
        aria-label="Contactar por WhatsApp"
      >
        <Image
          src="/icons/whatsapp-sticker.svg"
          alt="WhatsApp"
          width={28}
          height={28}
          className="w-7 h-7"
        />
      </a>
    </div>
  );
}
