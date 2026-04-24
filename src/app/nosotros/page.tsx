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

export const metadata: Metadata = {
  title: 'Nosotros - Corpicia | Césped Natural en Paraguay',
  description:
    'Conocé a Corpicia, especialistas en césped natural, riego y jardinería en Paraguay. Más de 10 años transformando espacios verdes con instalación profesional.',
  alternates: {
    canonical: '/nosotros/',
  },
  openGraph: {
    title: 'Nosotros - Corpicia | Césped Natural en Paraguay',
    description: 'Más de 10 años transformando espacios verdes en Paraguay.',
    type: 'website',
  },
};

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

      {/* HERO LIMPIO */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-corpicia-green rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-corpicia-green rounded-full" />
              <span className="text-sm font-medium text-corpicia-green">Conocé a Corpicia</span>
            </div>

            <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl text-gray-900">
              Especialistas en césped natural,{' '}
              <span className="text-corpicia-green">riego y jardinería</span> en Paraguay
            </h1>
            
            <p className="max-w-2xl text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
              Ayudamos a familias, empresas y proyectos comerciales a transformar
              sus espacios verdes con instalación profesional y resultados que duran años.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-xl bg-[#25D366] px-6 py-4 font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <Image
                  src="/icons/whatsapp-sticker.svg"
                  alt="WhatsApp"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                Solicitar presupuesto gratuito
              </a>

              <a
                href="#proyectos"
                className="inline-flex items-center gap-3 rounded-xl border-2 border-gray-200 px-6 py-4 font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <Image
                  src="/icons/play-sticker.svg"
                  alt="Ver trabajos"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                Ver trabajos reales
              </a>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-gray-100 pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl md:text-3xl font-bold text-corpicia-green">{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HISTORIA */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
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
              
              <div className="absolute -bottom-4 -right-4 md:-bottom-4 md:-right-4 bg-corpicia-green text-white p-4 md:p-5 rounded-2xl shadow-xl z-10">
                <p className="text-2xl md:text-3xl font-bold">Desde 2014</p>
                <p className="text-xs md:text-sm text-white/80">Transformando Paraguay</p>
              </div>
            </div>

            <div className="lg:pl-8">
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-corpicia-green">
                Nuestra historia
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-gray-900">
                Crecimos trabajando en espacios reales, no en una oficina
              </h2>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p className="text-lg">
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

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { label: 'Misión', text: 'Democratizar el acceso a césped natural de calidad en Paraguay.' },
                  { label: 'Visión', text: 'Ser la empresa líder en espacios verdes del Mercosur para 2030.' },
                ].map((item) => (
                  <div key={item.label} className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="font-bold text-corpicia-green mb-1">{item.label}</p>
                    <p className="text-sm text-gray-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST ITEMS */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-bold uppercase tracking-wider text-corpicia-green mb-3">
              Diferencia Corpicia
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              ¿Por qué confiar en nosotros?
            </h2>
            <p className="text-gray-600">
              No somos solo vendedores de césped. Somos especialistas que te acompañan 
              en todo el proceso.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustItems.map((item) => (
              <Card key={item.title} className="border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-corpicia-green" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PROYECTOS */}
      <section id="proyectos" className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-corpicia-green mb-2">
                Galería de trabajos
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Proyectos que hablan por sí solos
              </h2>
            </div>
            <a
              href="https://www.instagram.com/corpi_y_ciaa/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-corpicia-green font-semibold hover:gap-3 transition-all shrink-0"
            >
              Ver todos en Instagram
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {works.length > 0 ? (
            <div className={`grid gap-6 ${works.length === 1 ? 'md:grid-cols-1 max-w-2xl mx-auto' : works.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
              {works.map((work, i) => (
                <Card key={i} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-sm font-medium">{work.category}</p>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-corpicia-green transition-colors text-gray-900">
                      {work.title}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
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
            <div className="text-center mt-8">
              <a
                href="https://www.instagram.com/corpi_y_ciaa/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-corpicia-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-corpicia-green/90 transition-colors"
              >
                <Instagram className="w-5 h-5" />
                Ver {works.length - 6} proyectos más en Instagram
              </a>
            </div>
          )}
        </div>
      </section>

      {/* PROCESO */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-bold uppercase tracking-wider text-corpicia-green mb-3">
              Cómo trabajamos
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Instalación profesional en 4 pasos
            </h2>
            <p className="text-gray-600">
              Un proceso probado que garantiza resultados duraderos desde el día uno.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-2 mb-12">
            {processSteps.map((step, i) => (
              <div key={step.step} className="relative flex items-center">
                <div className="bg-gray-50 p-6 rounded-2xl flex-1 h-full border border-gray-100">
                  <span className="text-4xl font-bold text-corpicia-green/20 block mb-4">
                    {step.step}
                  </span>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
                
                {i < 3 && (
                  <div className="hidden lg:flex items-center justify-center shrink-0 mx-1">
                    <div className="bg-corpicia-green text-white rounded-full p-2 shadow-md">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Video */}
          <div className="max-w-[400px] mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
              <video
                controls
                className="w-full h-auto"
                poster={works.length > 0 ? works[0].image : undefined}
                preload="metadata"
                playsInline
              >
                <source src="/videos/trabajo-corpicia.mp4" type="video/mp4" />
                <p className="text-white text-center py-12 px-4">
                  Tu navegador no soporta videos.
                  <a href={getWhatsAppUrl()} className="text-green-400 underline ml-1 block mt-2">
                    Contactanos por WhatsApp
                  </a>
                </p>
              </video>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              Instalación de césped profesional en Paraguay
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Social */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                  Ver más trabajos en tiempo real
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Subimos fotos y videos de nuestros proyectos diariamente. 
                  Seguinos para ver el antes y después de cada instalación.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.instagram.com/corpi_y_ciaa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    <Image
                      src="/icons/instagram-sticker.svg"
                      alt="Instagram"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    Instagram
                  </a>
                  <a
                    href="https://www.facebook.com/corpi.jardin/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#1877F2] text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    <Image
                      src="/icons/facebook-sticker.svg"
                      alt="Facebook"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    Facebook
                  </a>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">¿Preferís hablar directo?</p>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-corpicia-green font-semibold hover:underline"
                >
                  <Image
                    src="/icons/whatsapp-sticker.svg"
                    alt="WhatsApp"
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  Escribinos por WhatsApp
                </a>
              </div>
            </div>

            {/* Contacto */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-corpicia-green mb-3">
                  Contacto directo
                </p>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                  ¿Tenés un proyecto en mente?
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Estamos en Asunción pero trabajamos en todo Paraguay. 
                  Escribinos y te damos un presupuesto sin compromiso en menos de 24 horas.
                </p>

                <div className="space-y-3">
                  <a
                    href="tel:+595992588770"
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-corpicia-green" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900">Llamanos</p>
                      <p className="text-corpicia-green text-sm">+595 992 588 770</p>
                    </div>
                  </a>

                  <a
                    href="mailto:info@corpicia.com"
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-corpicia-green" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900">Escribinos</p>
                      <p className="text-corpicia-green text-sm truncate">info@corpicia.com</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-corpicia-green" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900">Ubicación</p>
                      <p className="text-gray-600 text-sm">Asunción, Paraguay</p>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-6 py-3.5 rounded-xl font-bold hover:bg-[#128C7E] transition-colors"
              >
                <Image
                  src="/icons/whatsapp-sticker.svg"
                  alt="WhatsApp"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                Solicitar presupuesto ahora
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
