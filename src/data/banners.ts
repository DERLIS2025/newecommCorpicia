import { getWhatsAppUrl } from '@/lib/utils';

export type HomeBanner = {
  title: string;
  subtitle: string;
  imageDesktop: string;
  imageMobile: string;
  CTA: string;
  link: string;
  active: boolean;
  order: number;
};

export const homeHeroBanners: HomeBanner[] = [
  {
    title: 'Césped natural premium para transformar tus espacios',
    subtitle: 'Asesoría personalizada, instalación profesional y entrega en todo Paraguay.',
    imageDesktop: '/banners/mixed-banner-desktop (2).jpg',
    imageMobile: '/banners/mixed-banner-desktop (2).jpg',
    CTA: 'Ver productos',
    link: '/productos/',
    active: true,
    order: 1,
  },
  {
    title: 'Armá tu presupuesto por m² y enviá por WhatsApp',
    subtitle: 'Proceso simple, rápido y pensado para que cotices sin fricción.',
    imageDesktop: '/banners/hero-side-1.webp',
    imageMobile: '/banners/hero-side-1.webp',
    CTA: 'Ir a mi presupuesto',
    link: '/presupuesto/',
    active: true,
    order: 2,
  },
  {
    title: 'Soluciones para jardines residenciales y comerciales',
    subtitle: 'Productos confiables y acompañamiento en cada etapa de tu proyecto.',
    imageDesktop: '/banners/hero-side-2.jpg',
    imageMobile: '/banners/hero-side-2.jpg',
    CTA: 'Conocer servicios',
    link: '/servicios/',
    active: true,
    order: 3,
  },
];

export const homeSecondaryBanners: HomeBanner[] = [
  {
    title: 'Instalación profesional en Asunción y Gran Asunción',
    subtitle: 'Equipo técnico con experiencia en proyectos residenciales y corporativos.',
    imageDesktop: '/banners/hero-main-desktop.webp',
    imageMobile: '/banners/hero-main-desktop.webp',
    CTA: 'Solicitar asesoría',
    link: getWhatsAppUrl(),
    active: true,
    order: 1,
  },
  {
    title: 'Elegí productos destacados para tu jardín',
    subtitle: 'Catálogo curado para resultados duraderos y mantenimiento eficiente.',
    imageDesktop: '/banners/hero-side-1.webp',
    imageMobile: '/banners/hero-side-1.webp',
    CTA: 'Explorar catálogo',
    link: '/productos/',
    active: true,
    order: 2,
  },
];
