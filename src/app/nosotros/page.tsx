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
  Phone,
  Mail,
  ArrowRight,
  Play,
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
    description: 'Más de 10 años transformando espacios verdes en Paraguay. Especialistas en césped natural, riego y jardinería profesional.',
    type: 'website',
  },
};

// Schema.org para SEO local
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

// Generar trabajos automáticos desde carpeta
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

      {/* ============================================
          HERO MEJORADO - Con imagen de fondo real
          ============================================ */}
      <section className="relative bg-corpicia-green text-white overflow-hidden">
        {/* Imagen de fondo - usá una imagen real de tus trabajos */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/trabajos/hero-nosotros.jpg" // Cambiá esto por una foto real de tu equipo trabajando
            alt="Equipo Corpicia trabajando"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-corpicia-green/95 to-corpicia-green/70" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Conocé a Corpicia</span>
            </div>

            <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Especialistas en césped natural,{' '}
              <span className="text-green-300">riego y jardinería</span> en Paraguay
            </h1>
            
            <p className="max-w-2xl text-lg md:text-xl text-white/90 leading-relaxed mb-8">
              Ayudamos a familias, empresas y proyectos comerciales a transformar
              sus espacios verdes con instalación profesional y resultados que duran años.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 font-semibold text-corpicia-green shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <MessageCircle className="h-5 w-5" />
                Solicitar presupuesto gratuito
              </a>

              <a
                href="#proyectos"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/50 px-6 py-4 font-semibold text-white hover:bg-white/10 transition-all"
              >
                <Play className="h-5 w-5" />
                Ver trabajos reales
              </a>
            </div>

            {/* Stats rápidos en hero */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/20 pt-8">
              {stats.slice(0, 4).map((s) => (
                <div key={s.label}>
                  <p className="text-2xl md:text-3xl font-bold text-white">{s.value}</p>
                  <p className="text-sm text-white/70">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          HISTORIA MEJORADA - Más emocional y estructurada
          ============================================ */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Imagen de la historia */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/trabajos/historia-corpicia.jpg" // Foto del fundador o primer trabajo
                  alt="Fundadores de Corpicia"
                  width={600}
                  height={500}
                  className="object-cover w-full"
                />
              </div>
              {/* Badge flotante */}
              <div className="absolute -bottom-6 -right-6 bg-corpicia-green text-white p-6 rounded-2xl shadow-xl hidden md:block">
                <p className="text-3xl font-bold">Desde 2014</p>
                <p className="text-sm text-white/80">Transformando Paraguay</p>
              </div>
            </div>

            {/* Texto */}
            <div className="lg:pl-8">
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-corpicia-green">
                Nuestra historia
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
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

              {/* Valores */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { label: 'Misión', text: 'Democratizar el acceso a césped natural de calidad en Paraguay.' },
                  { label: 'Visión', text: 'Ser la empresa líder en espacios verdes del Mercosur para 2030.' },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 p-4 rounded-xl">
                    <p className="font-bold text-corpicia-green mb-1">{item.label}</p>
                    <p className="text-sm text-gray-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          ¿POR QUÉ ELEGIRNOS? - Trust Items (antes faltaban)
          ============================================ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-bold uppercase tracking-wider text-corpicia-green mb-3">
              Diferencia Corpicia
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Por qué confiar en nosotros?
            </h2>
            <p className="text-gray-600">
              No somos solo vendedores de césped. Somos especialistas que te acompañan 
              en todo el proceso.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustItems.map((item) => (
              <Card key={item.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-corpicia-green/10 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-corpicia-green" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          PROYECTOS REALES - Grid mejorado
          ============================================ */}
      <section id="proyectos" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-corpicia-green mb-2">
                Galería de trabajos
              </p>
              <h2 className="text-3xl md:text-4xl font-bold">
                Proyectos que hablan por sí solos
              </h2>
            </div>
            <a
              href="https://www.instagram.com/corpi_y_ciaa/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-corpicia-green font-semibold hover:gap-3 transition-all"
            >
              Ver todos en Instagram
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {works.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {works.slice(0, 6).map((work, i) => (
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
                    <h3 className="font-bold text-lg mb-1 group-hover:text-corpicia-green transition-colors">
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
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
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

      {/* ============================================
          PROCESO DE INSTALACIÓN - Visual mejorado
          ============================================ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-bold uppercase tracking-wider text-corpicia-green mb-3">
              Cómo trabajamos
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Instalación profesional en 4 pasos
            </h2>
            <p className="text-gray-600">
              Un proceso probado que garantiza resultados duraderos desde el día uno.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {processSteps.map((step, i) => (
              <div key={step.step} className="relative">
                <div className="bg-white p-6 rounded-2xl shadow-lg h-full">
                  <span className="text-4xl font-bold text-corpicia-green/20 block mb-4">
                    {step.step}
                  </span>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 text-corpicia-green">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Video mejorado */}
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl aspect-video">
              <video
                controls
                className="w-full h-full"
                poster="/trabajos/video-poster.jpg" // Agregá una imagen de preview
                preload="metadata"
              >
                <source src="/videos/trabajo-corpicia.mp4" type="video/mp4" />
                Tu navegador no soporta videos. Contactanos por WhatsApp para ver trabajos.
              </video>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              Video: Instalación de césped Esmeralda en residencia de Asunción
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          STATS CON IMPACTO - Animados visualmente
          ============================================ */}
      <section className="py-16 bg-corpicia-green text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold mb-2">{s.value}</p>
                <p className="text-white/80 font-medium">{s.label}</p>
                <p className="text-sm text-white/60 mt-1">{s.suffix}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          CTA SOCIAL + CONTACTO DIRECTO
          ============================================ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* CTA Social */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-8 md:p-12 rounded-3xl">
              <h2 className="text-3xl font-bold mb-4">
                Ver más trabajos en tiempo real
              </h2>
              <p className="text-green-100 mb-8">
                Subimos fotos y videos de nuestros proyectos diariamente. 
                Seguinos para ver el antes y después de cada instalación.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.instagram.com/corpi_y_ciaa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  <Instagram className="w-5 h-5" />
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/corpi.jardin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-all"
                >
                  <Facebook className="w-5 h-5" />
                  Facebook
                </a>
              </div>

              <div className="mt-8 pt-8 border-t border-white/20">
                <p className="text-sm text-green-200 mb-2">¿Preferís hablar directo?</p>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white font-semibold hover:underline"
                >
                  <MessageCircle className="w-5 h-5" />
                  Escribinos por WhatsApp
                </a>
              </div>
            </div>

            {/* Contacto rápido */}
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-corpicia-green mb-3">
                Contacto directo
              </p>
              <h2 className="text-3xl font-bold mb-6">
                ¿Tenés un proyecto en mente?
              </h2>
              <p className="text-gray-600 mb-8">
                Estamos en Asunción pero trabajamos en todo Paraguay. 
                Escribinos y te damos un presupuesto sin compromiso en menos de 24 horas.
              </p>

              <div className="space-y-4">
                <a
                  href="tel:+595992588770"
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-corpicia-green/10 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-corpicia-green" />
                  </div>
                  <div>
                    <p className="font-semibold">Llamanos</p>
                    <p className="text-corpicia-green">+595 992 588 770</p>
                  </div>
                </a>

                <a
                  href="mailto:info@corpicia.com"
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-corpicia-green/10 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-corpicia-green" />
                  </div>
                  <div>
                    <p className="font-semibold">Escribinos</p>
                    <p className="text-corpicia-green">info@corpicia.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-corpicia-green/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-corpicia-green" />
                  </div>
                  <div>
                    <p className="font-semibold">Ubicación</p>
                    <p className="text-gray-600">Asunción, Paraguay</p>
                  </div>
                </div>
              </div>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-corpicia-green text-white px-6 py-4 rounded-xl font-bold hover:bg-corpicia-green/90 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Solicitar presupuesto ahora
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
